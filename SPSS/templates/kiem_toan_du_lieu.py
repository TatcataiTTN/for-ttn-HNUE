"""
Tầng "Kiểm định dữ liệu đầu vào" trong kiến trúc Data Pipeline 4 tầng.
Đóng vai trò "người gác cổng": kiểm tra dữ liệu trước khi đưa vào phân tích/mô
hình, nếu sai sẽ dừng ngay và cảnh báo — tránh việc mô hình "nhả ra" kết quả sai
lệch từ dữ liệu bẩn (garbage in, garbage out).

Có 2 lựa chọn tương đương, chọn 1 tuỳ mức độ nghiêm ngặt cần thiết:
  A. Pydantic  — nhẹ, khai báo kiểu dữ liệu như dataclass, phù hợp kiểm tra
     từng dòng/từng bản ghi (record-level validation).
  B. Great Expectations — nặng hơn nhưng kiểm tra ở mức TOÀN BẢNG (dataset-level):
     phân phối, tỷ lệ missing, ràng buộc thống kê.

Cài đặt: pip install pydantic great_expectations pandas
"""
import sys
import pandas as pd

# ============================================================
# A. PYDANTIC — kiểm tra từng dòng dữ liệu khảo sát
# ============================================================
from pydantic import BaseModel, Field, ValidationError, field_validator


class DongKhaoSat(BaseModel):
    id: int
    nhom_thuc_nghiem: str
    gioi_tinh: str
    diem_truoc_tac_dong: float | None = Field(default=None, ge=0, le=10)
    diem_sau_tac_dong: float = Field(ge=0, le=10)
    sdl_ke_hoach_hoa: int = Field(ge=1, le=5)

    @field_validator("nhom_thuc_nghiem")
    @classmethod
    def kiem_tra_nhom(cls, v):
        hop_le = {"Thuc_nghiem_PBL", "Doi_chung_thuyet_trinh"}
        if v not in hop_le:
            raise ValueError(f"Giá trị nhóm '{v}' không hợp lệ, chỉ chấp nhận {hop_le}")
        return v


def kiem_tra_pydantic(duong_dan_csv: str) -> bool:
    df = pd.read_csv(duong_dan_csv)
    loi = []
    for i, row in df.iterrows():
        try:
            DongKhaoSat(**row.to_dict())
        except ValidationError as e:
            loi.append((i, str(e)))
    if loi:
        print(f"❌ Phát hiện {len(loi)} dòng lỗi, dừng pipeline:")
        for idx, msg in loi[:10]:
            print(f"  - Dòng {idx}: {msg}")
        return False
    print(f"✅ Pydantic: {len(df)} dòng hợp lệ, thang đo 1-5 và 0-10 đều đúng phạm vi.")
    return True


# ============================================================
# B. GREAT EXPECTATIONS (phiên bản rút gọn, dùng pandas trực tiếp
#    để không phụ thuộc cấu hình project GE đầy đủ — phù hợp demo nhanh)
# ============================================================
def kiem_tra_dataset_level(duong_dan_csv: str, nguong_missing_pct: float = 15.0) -> bool:
    df = pd.read_csv(duong_dan_csv)
    canh_bao = []

    # Kỳ vọng 1: tỷ lệ missing không vượt ngưỡng
    for col in df.columns:
        missing_pct = df[col].isna().mean() * 100
        if missing_pct > nguong_missing_pct:
            canh_bao.append(f"Cột '{col}' có {missing_pct:.1f}% giá trị khuyết (> {nguong_missing_pct}%)")

    # Kỳ vọng 2: các cột Likert 1-5 phải nằm trong khoảng hợp lệ
    cot_likert = [c for c in df.columns if c.startswith(("bl_", "sdl_"))]
    for col in cot_likert:
        ngoai_pham_vi = df[(df[col] < 1) | (df[col] > 5)][col].dropna()
        if len(ngoai_pham_vi) > 0:
            canh_bao.append(f"Cột '{col}' có {len(ngoai_pham_vi)} giá trị nằm ngoài thang 1-5")

    # Kỳ vọng 3: điểm số 0-10 không âm, không vượt 10
    for col in ["diem_truoc_tac_dong", "diem_sau_tac_dong", "ket_qua_hoc_tap"]:
        if col in df.columns:
            ngoai_pham_vi = df[(df[col] < 0) | (df[col] > 10)][col].dropna()
            if len(ngoai_pham_vi) > 0:
                canh_bao.append(f"Cột '{col}' có {len(ngoai_pham_vi)} giá trị ngoài thang 0-10")

    if canh_bao:
        print("⚠️  Cảnh báo chất lượng dữ liệu ở mức toàn bảng:")
        for c in canh_bao:
            print("  -", c)
        return False
    print("✅ Kiểm tra mức toàn bảng (dataset-level) đạt yêu cầu.")
    return True


if __name__ == "__main__":
    duong_dan = sys.argv[1] if len(sys.argv) > 1 else "../sample_data/khao_sat_mau.csv"
    ok1 = kiem_tra_pydantic(duong_dan)
    ok2 = kiem_tra_dataset_level(duong_dan)
    if not (ok1 and ok2):
        print("\n🛑 Pipeline DỪNG LẠI do dữ liệu không đạt chuẩn kiểm toán.")
        sys.exit(1)
    print("\n🟢 Dữ liệu đạt chuẩn, có thể tiếp tục sang tầng Processing & Modeling.")
