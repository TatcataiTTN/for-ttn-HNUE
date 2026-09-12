# Quy trình chuẩn bị & làm sạch dữ liệu (trích từ "!Huong dan SPSS.docx")

Bản tóm tắt của quy trình gốc trong thư mục `Bài tập 12-9-2026/`, dùng làm tài liệu
đối chiếu khi thao tác trên bộ dữ liệu thật bằng công cụ SPSS-Lite này hoặc bằng
SPSS thật. Bản này đã được đối chiếu trực tiếp với **65 ảnh chụp màn hình gốc**
nhúng trong file docx (không chỉ phần chữ), và xác minh chéo với chính 3 file
`.sav` — 2 con số dưới đây trùng khớp tuyệt đối với dữ liệu thật đã chuyển thành
CSV trong `sample_data/`, nên các mục 4 và 6 bên dưới **có thể tin cậy áp dụng
trực tiếp** cho `pilot_khao_sat_AI_giao_vien.csv` và `khao_sat_nang_luc_so_HS_GV.csv`:

- Cronbach's Alpha ví dụ trong docx chạy trên **đúng 42 phiếu hợp lệ / 141 phiếu
  bị loại / 183 tổng** — khớp 100% với số phiếu hợp lệ thực tế trong
  `pilot_khao_sat_AI_giao_vien.csv`.
- Bảng tần suất `XL_PPDH` ví dụ trong docx cho ra 178/710/23 (tổng 911) — khớp
  100% với cột `XL_PPDH` thực tế trong `khao_sat_nang_luc_so_HS_GV.csv`.

⚠️ Riêng phần minh hoạ cơ chế mã hoá Excel ở Mục 1-2 dưới đây (đặt ký hiệu PU1,
PU2…/PU.1, PEOU.1, AN.1…) là một **ví dụ khác, không phải Pilot.sav** — Pilot.sav
thật dùng ký hiệu A1-K4 (khảo sát Động lực tự học SDL của sinh viên, xem Mục 5).
Cơ chế (transpose, Find&Replace, lọc câu hỏi ngược chiều) thì áp dụng chung cho
mọi bộ bảng hỏi, kể cả Pilot.sav.

## 1. Chuẩn bị số liệu sau khảo sát bằng Excel (file `0. Chuanbi.xlsx`)

1. Bôi đen hàng tên biến (câu hỏi đầy đủ), copy → Paste Special → Transpose để
   chuyển tên biến từ hàng ngang sang cột dọc.
2. Đặt **ký hiệu ngắn gọn** tương ứng với từng biến (ví dụ PU1, PU2… hoặc A1, B1…).
   Copy ký hiệu, quay lại bảng dữ liệu, Paste Special → Transpose lần nữa để gán
   ký hiệu làm tên cột chính thức.
3. Chuyển câu trả lời dạng chữ sang dạng số bằng `Ctrl+H` (Replace):
   - Ví dụ: Nữ → 1, Nam → 2.
   - Thâm niên: dưới 7 năm → 1, từ 7–12 năm → 2, trên 12 năm → 3.
   - **Lưu ý bắt buộc:** ký hiệu giữa các biến phải khác nhau; trong cùng 1 biến,
     các mã số phải phân biệt rõ ràng. Luôn lưu lại **bảng mã hoá (codebook)** để
     tra cứu và phân tích về sau — đây chính là phần "Variable View" trong SPSS
     hoặc bảng khai báo thang đo ở Mục 1 của công cụ SPSS-Lite.

## 2. Làm sạch dữ liệu bằng Excel — loại phiếu "kém tin cậy"

Bộ bảng hỏi có cặp câu hỏi kiểm định ý nghĩa **ngược chiều nhau**, ví dụ:
- **PU10**: "Các ứng dụng của AI làm tôi thấy khó khăn để sử dụng thành thạo."
- **PU7** (câu tham chiếu): "Tôi cảm thấy các ứng dụng AI dễ dàng để sử dụng một
  cách thành thạo."

Nếu một phiếu trả lời **cùng một mức 5 (hoặc cùng mức 1)** cho cả 2 câu hỏi
ngược chiều này → người trả lời không đọc kỹ câu hỏi → phiếu "kém tin cậy",
cần loại bỏ:
1. Excel: Data → Filter, lọc giá trị 5 ở cả cột PU7 và PU10, xoá các hàng đó.
2. Lặp lại tương tự với các hàng đều chọn giá trị 1.

*Áp dụng nguyên tắc này với bất kỳ cặp câu hỏi ngược chiều nào có trong bộ bảng
hỏi của bạn — không riêng PU7/PU10.*

## 3. Làm sạch dữ liệu bằng SPSS

1. Chuyển câu trả lời dạng chữ sang số **trước** khi mở bằng SPSS (làm ở bước 1).
2. SPSS: File → Open → Data, chọn loại file Excel.
3. Các hàng có dấu `.` (dấu chấm) là phiếu đã bị loại ở bước lọc PU7/PU10 trước đó.
4. Loại các hàng missing: Data → Select Cases → If condition is satisfied →
   ví dụ `PU.1 >= 1` (chỉ giữ dòng có dữ liệu hợp lệ) → tick **Delete unselected
   cases** → OK.
5. *Ghi chú:* với bảng hỏi dạng trắc nghiệm/lựa chọn sẵn (không cho gõ tự do),
   thường không phát sinh giá trị bất thường ngoài phạm vi thang đo, nên bước
   sàng lọc không quá phức tạp.

## 4. Kiểm định độ tin cậy Cronbach's Alpha (đã đối chiếu với Pilot.sav thật)

Chạy Cronbach's Alpha cho **từng nhóm biến** (mỗi nhóm ứng với 1 khái niệm/thang
đo trong khung lý thuyết) — tương ứng Mục 4 của công cụ SPSS-Lite này. Ảnh chụp
màn hình gốc cho thấy: Analyze → Scale → Reliability Analysis, đưa **A1 đến A10**
(10 items, thang đo "Động lực nội tại" của khảo sát Động lực tự học – SDL) vào ô
Items → Model: Alpha. Kết quả thật:

| Chỉ số | Giá trị thật (từ docx) |
|---|---|
| Cases Valid | 42 (23.0%) |
| Cases Excluded | 141 (77.0%) |
| Cronbach's Alpha | **0.916** |
| N of Items | 10 |

Theo Nunnally (1978): Alpha > 0.7 → thang đo đảm bảo tin cậy, đơn hướng. **Bạn có
thể tự kiểm chứng công cụ SPSS-Lite đúng hay sai bằng cách:** nạp bộ dữ liệu
"1. Pilot" ở Mục 1, sang Mục 4, tick chọn đúng A1-A10, bấm "Tính Cronbach's Alpha"
— kết quả phải ra N=42, Alpha≈0.916 (đã tự kiểm tra khớp khi xây dựng công cụ này).
Lặp lại quy trình tương tự cho các nhóm biến còn lại trong bảng hỏi (B, C, D…).

## 5. Phân tích EFA (Exploratory Factor Analysis) — kết quả thật trên Pilot.sav

1. Analyze → Dimension Reduction → Factor. Đưa **toàn bộ biến quan sát đo SDL**
   (A1…K4, trừ 4 biến nhân khẩu học Gender/Year/Nganh/Khoa) vào ô Variables.
   Descriptives: tick KMO and Bartlett's Test. Extraction: Principal Components,
   Eigenvalue > 1. Rotation: Varimax.
2. **Kết quả KMO & Bartlett thật:** KMO = 0.530 (> 0.5 → đạt, theo Kaiser 1974),
   Bartlett's Chi-Square = 1286.764, df = 561, Sig. = 0.000 (< 0.05 → các biến có
   tương quan, đủ điều kiện chạy EFA).
3. **Initial Eigenvalues thật:** 9 thành phần (component) có Eigenvalue > 1,
   giải thích tích luỹ 80.112% phương sai ở thành phần thứ 9.
4. **Trích một phần Rotated Component Matrix thật:** Component 1 gồm D3(.792),
   C1(.790), C3(.757), D1(.686), D4(.652), E3(.622), E1(.457); Component 2 gồm
   A5(.750), A7(.749), A6(.686), A8(.664, cũng tải .390 lên Component 1 nhưng hệ
   số Component 2 lớn hơn nên thuộc Component 2 — nguyên tắc "biến xuất hiện ở
   nhiều nhóm thì thuộc nhóm có trọng số lớn hơn").
5. **Loại bỏ các biến kiểm định** trước khi chạy lại EFA lần cuối (ví dụ `A11`,
   `B8` — 2 biến dùng để lọc phiếu kém tin cậy, tương tự cơ chế PU7/PU10 ở Mục 2).
6. **Loại trừ các nhóm chỉ còn 1 câu hỏi.** Kết quả cuối cùng (sau khi đặt tên lý
   thuyết cho từng thành phần) rút gọn về **7 nhóm**:

   | Nhóm | Câu hỏi |
   |---|---|
   | Động lực nội tại | A2–A8 |
   | Động lực bên ngoài | B6, B7, B8 |
   | Động lực điều chỉnh | B1, B3, B4 |
   | Lập kế hoạch, giám sát thực hiện | C1, C3, D1, D3, D4 |
   | Khả năng tự giám sát | B5, D2 |
   | Khả năng tự chủ, hợp tác | C2, E4 |
   | Trách nhiệm cá nhân | A10, F1, F3, F4 |

   Bảng này **áp dụng trực tiếp cho `pilot_khao_sat_AI_giao_vien.csv`** (đã xác
   minh qua N=42 và cấu trúc biến trùng khớp) — có thể dùng ngay các nhóm này khi
   chọn items ở Mục 4 (Cronbach's Alpha) của công cụ. Các biến G,H,I,J,K không
   xuất hiện trong bảng 7-nhóm cuối cùng này — rất có thể đã bị loại trong quá
   trình EFA do tải chéo (cross-loading) hoặc thuộc thang đo khác (kết quả học
   tập/biến phụ thuộc) không nằm trong phạm vi khung SDL này; hãy tự chạy lại
   Mục 5 công cụ semopy hoặc SPSS thật nếu cần xác nhận chi tiết hơn.

## 6. Thống kê mô tả, tần suất, biểu đồ — đối chiếu với KHAOSAT_HS_GV thật

Ảnh chụp màn hình gốc cho bảng tần suất biến `XL_PPDH` (xếp loại phương pháp dạy
học) chạy trên đúng `khao_sat_nang_luc_so_HS_GV.csv`:

| Giá trị | Frequency | Percent |
|---|---|---|
| 2.00 | 178 | 19.5% |
| 3.00 | 710 | 77.9% |
| 4.00 | 23 | 2.5% |
| **Total** | **911** | **100.0%** |

Số liệu này khớp 100% với `khao_sat_nang_luc_so_HS_GV.csv` trong `sample_data/`
— tự kiểm tra bằng `df['XL_PPDH'].value_counts()`. Nhận định gốc: không HS nào
đánh giá "không đồng ý" (không có mức 1); 80.4% đồng ý (trong đó chỉ 2.5% "hoàn
toàn đồng ý") — cho thấy đa phần hài lòng nhưng không tuyệt đối, có thể vì HS
chưa có "bộ tiêu chí chuẩn" để đánh giá PPDH của GV nên nhận xét theo cảm tính.

- Thống kê mô tả/tần suất: tương ứng Mục 2 (Thống kê mô tả) của công cụ SPSS-Lite.
- Crosstab: bảng chéo giữa 2 biến định danh/thứ bậc — SPSS-Lite hiện chưa có màn
  hình Crosstab riêng; có thể mô phỏng bằng cách nhóm dữ liệu và dùng biểu đồ Bar
  ở Mục 6.
- Boxplot: đọc trung vị (đường giữa hộp), khoảng 50% giữa (thân hộp), tứ phân vị
  25-75% (rìa hộp), giá trị cao/thấp nhất (râu), điểm dị biệt (mild outlier: hình
  tròn; extreme outlier: hình hoa thị) — có sẵn ở Mục 3 và Mục 6 của công cụ.
- Đồ thị cành-lá (stem-and-leaf): dùng để so sánh hình dạng phân phối (đối xứng/
  lệch trái/lệch phải) qua vị trí tương đối của Trung bình – Trung vị – Mode; nên
  vẽ bằng Excel như hướng dẫn gốc (SPSS-Lite chưa hỗ trợ loại biểu đồ này).

## Ánh xạ sang các mục của công cụ SPSS-Lite (trang web này)

| Bước trong hướng dẫn gốc | Mục tương ứng trong SPSS-Lite |
|---|---|
| Mã hoá biến, khai báo thang đo | Mục 1 — Variable View |
| Loại phiếu kém tin cậy, loại missing | Làm thủ công trước khi tải CSV lên (công cụ chưa tự động lọc) |
| Cronbach's Alpha theo nhóm | Mục 4 |
| Thống kê mô tả, tần suất | Mục 2 |
| Kiểm định giả thuyết (t-test/ANOVA) | Mục 3 (có tự động kiểm tra Shapiro/Levene) |
| EFA/SEM đầy đủ | Ngoài phạm vi công cụ web — dùng `semopy_sem_day_du.py` hoặc SPSS/AMOS/SmartPLS thật |
| Boxplot, biểu đồ | Mục 3 và Mục 6 |
