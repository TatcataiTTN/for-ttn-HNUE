"""
SEM/Path Model đầy đủ bằng semopy — thay thế SmartPLS/AMOS.
Chạy OFFLINE trong Jupyter/Python thật trên máy bạn (KHÔNG chạy được ổn định
trong trình duyệt qua Pyodide do phụ thuộc biên dịch native + Graphviz để vẽ sơ
đồ đường dẫn). Trang web SPSS-Lite chỉ cung cấp bản proxy nhẹ (mediation 3 bước
Baron & Kenny) — dùng file này khi cần chỉ số phù hợp mô hình đầy đủ (CFI, TLI,
RMSEA) như trong "A Primer on PLS-SEM" (Hair et al.).

Cài đặt: pip install semopy pandas graphviz
(cần cài thêm Graphviz ở hệ điều hành: `brew install graphviz` trên macOS)

Mô hình minh hoạ đúng Ví dụ minh hoạ 2 trong bài giảng:
  Môi trường Blended Learning (BL, biến tiềm ẩn)
      -> Năng lực tự học (SDL, biến tiềm ẩn, vai trò trung gian)
      -> Kết quả học tập (KQ, biến tiềm ẩn)
"""
import pandas as pd
import semopy
from semopy import Model, semplot

df = pd.read_csv("../sample_data/khao_sat_mau.csv")

# Cú pháp mô hình đo lường + mô hình cấu trúc kiểu "lavaan syntax"
mo_ta_mo_hinh = """
# Mô hình đo lường (measurement model) — biến tiềm ẩn <=~ biến quan sát
BL =~ bl_toc_do_truy_cap + bl_giao_dien_de_nhin + bl_tai_lieu_phong_phu + bl_giang_vien_phan_hoi
SDL =~ sdl_ke_hoach_hoa + sdl_chien_luoc_thuc_hien + sdl_tu_danh_gia_phan_tu

# Mô hình cấu trúc (structural model) — biến tiềm ẩn ~ biến tiềm ẩn khác
SDL ~ BL
ket_qua_hoc_tap ~ SDL + BL
"""

model = Model(mo_ta_mo_hinh)
result = model.fit(df)

print("=== Ước lượng tham số ===")
print(model.inspect())

print("\n=== Chỉ số phù hợp mô hình (Model Fit) ===")
stats = semopy.calc_stats(model)
print(stats.T[["chi2", "CFI", "TLI", "RMSEA", "GFI"]])

# Vẽ sơ đồ đường dẫn (path diagram) giống SmartPLS — cần cài Graphviz
g = semplot(model, "path_diagram_output.png")
print("\nĐã lưu sơ đồ đường dẫn vào path_diagram_output.png")

print(
    "\nGợi ý đọc kết quả:\n"
    "  - CFI, TLI > 0.90 (lý tưởng > 0.95): mô hình phù hợp tốt.\n"
    "  - RMSEA < 0.08 (lý tưởng < 0.06): sai số xấp xỉ chấp nhận được.\n"
    "  - Hệ số hồi quy SDL ~ BL và ket_qua_hoc_tap ~ SDL có ý nghĩa (p<0.05)\n"
    "    => xác nhận vai trò trung gian của Năng lực tự học."
)
