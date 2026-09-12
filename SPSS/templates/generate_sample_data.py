"""
Sinh dữ liệu khảo sát mẫu (mô phỏng) để demo công cụ SPSS-Lite.
Chạy 1 lần bằng Python thật trên máy (không phải trong trình duyệt) để tạo
sample_data/khao_sat_mau.csv — có random.seed cố định để tái lập được.

Kịch bản mô phỏng theo đúng 2 ví dụ minh hoạ trong bài giảng "Xử lý dữ liệu
thực nghiệm sư phạm" (Phần 1):
  - Ví dụ 1: PPDH dự án (PBL) và nhóm đối chứng (thuyết trình) -> điểm kiểm tra
  - Ví dụ 2: Môi trường Blended Learning -> Năng lực tự học (SDL) -> Kết quả học tập
"""
import numpy as np
import pandas as pd

rng = np.random.default_rng(seed=42)
N = 200

nhom = rng.choice(["Thuc_nghiem_PBL", "Doi_chung_thuyet_trinh"], size=N)
diem_truoc = np.clip(rng.normal(6.0, 1.0, N), 0, 10)
hieu_ung = np.where(nhom == "Thuc_nghiem_PBL", 1.1, 0.2)
diem_sau = np.clip(diem_truoc + hieu_ung + rng.normal(0, 0.8, N), 0, 10)

gioi_tinh = rng.choice(["Nam", "Nu"], size=N)
nganh_hoc = rng.choice(["Su_pham", "Ngoai_su_pham"], size=N, p=[0.55, 0.45])

# Biến tiềm ẩn "Môi trường Blended Learning" (IV) -> vài chỉ báo Likert 1-5
blended_base = rng.normal(3.5, 0.8, N)
bl_toc_do = np.clip(np.round(blended_base + rng.normal(0, 0.5, N)), 1, 5)
bl_giao_dien = np.clip(np.round(blended_base + rng.normal(0, 0.5, N)), 1, 5)
bl_tai_lieu = np.clip(np.round(blended_base + rng.normal(0, 0.5, N)), 1, 5)
bl_phan_hoi = np.clip(np.round(blended_base + rng.normal(0, 0.5, N)), 1, 5)

# Biến trung gian tiềm ẩn "Năng lực tự học" (M) — phụ thuộc một phần vào blended_base
sdl_base = 0.5 * blended_base + rng.normal(2.0, 0.7, N)
sdl_ke_hoach = np.clip(np.round(sdl_base + rng.normal(0, 0.5, N)), 1, 5)
sdl_chien_luoc = np.clip(np.round(sdl_base + rng.normal(0, 0.5, N)), 1, 5)
sdl_tu_danh_gia = np.clip(np.round(sdl_base + rng.normal(0, 0.5, N)), 1, 5)

# Biến phụ thuộc "Kết quả học tập" (Y) — phụ thuộc vào SDL (trung gian) nhiều hơn blended trực tiếp
ket_qua_hoc_tap = np.clip(
    4.0 + 0.9 * sdl_base + 0.15 * blended_base + rng.normal(0, 0.9, N), 0, 10
)

df = pd.DataFrame({
    "id": np.arange(1, N + 1),
    "nhom_thuc_nghiem": nhom,
    "gioi_tinh": gioi_tinh,
    "nganh_hoc": nganh_hoc,
    "diem_truoc_tac_dong": np.round(diem_truoc, 2),
    "diem_sau_tac_dong": np.round(diem_sau, 2),
    "bl_toc_do_truy_cap": bl_toc_do.astype(int),
    "bl_giao_dien_de_nhin": bl_giao_dien.astype(int),
    "bl_tai_lieu_phong_phu": bl_tai_lieu.astype(int),
    "bl_giang_vien_phan_hoi": bl_phan_hoi.astype(int),
    "sdl_ke_hoach_hoa": sdl_ke_hoach.astype(int),
    "sdl_chien_luoc_thuc_hien": sdl_chien_luoc.astype(int),
    "sdl_tu_danh_gia_phan_tu": sdl_tu_danh_gia.astype(int),
    "ket_qua_hoc_tap": np.round(ket_qua_hoc_tap, 2),
})

# Thêm một vài giá trị khuyết (missing) ngẫu nhiên để demo phần thống kê mô tả
for col in ["diem_truoc_tac_dong", "sdl_tu_danh_gia_phan_tu"]:
    idx = rng.choice(N, size=6, replace=False)
    df.loc[idx, col] = np.nan

df.to_csv("../sample_data/khao_sat_mau.csv", index=False, encoding="utf-8-sig")
print("Đã tạo sample_data/khao_sat_mau.csv với", len(df), "dòng.")
