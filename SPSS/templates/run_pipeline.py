"""
Bảng điều khiển trung tâm — gọi Papermill để chạy ẩn SPSS_auto_template.ipynb
với tham số mới, lưu lại một bản notebook kết quả riêng làm bằng chứng kiểm toán.

Cài đặt trước khi chạy:
    pip install papermill pandas numpy scipy matplotlib jupyter

Chạy thử:
    python run_pipeline.py
"""
import papermill as pm
from datetime import datetime
from pathlib import Path

THU_MUC_KET_QUA = Path("ket_qua_audit")
THU_MUC_KET_QUA.mkdir(exist_ok=True)

thoi_gian = datetime.now().strftime("%Y%m%d_%H%M")
file_dau_ra = THU_MUC_KET_QUA / f"Ket_qua_phantich_{thoi_gian}.ipynb"

pm.execute_notebook(
    input_path="SPSS_auto_template.ipynb",
    output_path=str(file_dau_ra),
    parameters=dict(
        file_du_lieu="../sample_data/khao_sat_mau.csv",
        muc_y_nghia=0.05,
        bien_phu_thuoc="ket_qua_hoc_tap",
        bien_nhom="nhom_thuc_nghiem",
    ),
)

print(f"Quy trình hoàn tất. Dấu vết kiểm toán lưu tại: {file_dau_ra}")
