"""
Web-app self-service kiểu SPSS bằng Gradio — chạy trên máy cá nhân/server riêng
(KHÔNG phải trang GitHub Pages tĩnh — Gradio cần một máy chủ Python thật đứng sau).

Dùng khi bạn cần: (1) người khác trong Lab tự tải CSV lên, (2) không muốn họ
đụng vào code, (3) chấp nhận đánh đổi là dữ liệu đi qua máy chủ trung gian
(khác với công cụ web tĩnh SPSS-Lite chạy 100% trong trình duyệt của trang này).

Cài đặt: pip install gradio pandas scipy plotly
Chạy:    python gradio_app_mau.py
"""
import gradio as gr
import pandas as pd
from scipy import stats
import plotly.express as px


def phan_tich(file_csv, bien_phu_thuoc, bien_nhom, muc_y_nghia):
    df = pd.read_csv(file_csv.name)
    groups = df[bien_nhom].dropna().unique().tolist()
    if len(groups) != 2:
        return f"Lỗi: biến nhóm phải có đúng 2 nhóm, hiện có {len(groups)}", None

    g1 = df.loc[df[bien_nhom] == groups[0], bien_phu_thuoc].dropna()
    g2 = df.loc[df[bien_nhom] == groups[1], bien_phu_thuoc].dropna()

    _, p1 = stats.shapiro(g1) if len(g1) >= 3 else (None, 1.0)
    _, p2 = stats.shapiro(g2) if len(g2) >= 3 else (None, 1.0)
    normal_ok = p1 >= muc_y_nghia and p2 >= muc_y_nghia
    _, lev_p = stats.levene(g1, g2)
    equal_var = lev_p >= muc_y_nghia

    if not normal_ok:
        stat, p = stats.mannwhitneyu(g1, g2)
        method = "Mann-Whitney U"
    elif not equal_var:
        stat, p = stats.ttest_ind(g1, g2, equal_var=False)
        method = "Welch's t-test"
    else:
        stat, p = stats.ttest_ind(g1, g2, equal_var=True)
        method = "Student's t-test"

    ket_luan = (
        f"Phương pháp: {method}\n"
        f"Thống kê = {stat:.4f}, p = {p:.4f}\n"
        f"=> {'CÓ' if p < muc_y_nghia else 'KHÔNG'} khác biệt có ý nghĩa (α={muc_y_nghia})"
    )
    fig = px.box(df, x=bien_nhom, y=bien_phu_thuoc, points="all", title=method)
    return ket_luan, fig


with gr.Blocks(title="SPSS Self-Service (Gradio)") as demo:
    gr.Markdown("## Cổng phân tích tự phục vụ — So sánh 2 nhóm độc lập")
    gr.Markdown(
        "⚠️ Lưu ý quản trị rủi ro: dữ liệu CSV bạn tải lên đây sẽ được gửi tới "
        "máy chủ chạy ứng dụng này. Nếu dữ liệu nhạy cảm (nội bộ Lab, y tế...), "
        "hãy dùng công cụ web tĩnh chạy client-side (SPSS-Lite) thay vì cách này."
    )
    with gr.Row():
        file_input = gr.File(label="Tải file CSV")
        with gr.Column():
            dv = gr.Textbox(label="Tên biến phụ thuộc", value="ket_qua_hoc_tap")
            group_col = gr.Textbox(label="Tên biến nhóm (2 nhóm)", value="nhom_thuc_nghiem")
            alpha = gr.Slider(0.01, 0.10, value=0.05, step=0.01, label="Mức ý nghĩa alpha")
    run_btn = gr.Button("Chạy phân tích", variant="primary")
    output_text = gr.Textbox(label="Kết quả", lines=5)
    output_plot = gr.Plot(label="Biểu đồ")

    run_btn.click(phan_tich, inputs=[file_input, dv, group_col, alpha], outputs=[output_text, output_plot])

if __name__ == "__main__":
    demo.launch()
