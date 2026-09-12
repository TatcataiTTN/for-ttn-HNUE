# Quy trình chuẩn bị & làm sạch dữ liệu (trích từ "!Huong dan SPSS.docx")

Bản tóm tắt bằng chữ (không kèm ảnh chụp màn hình) của quy trình gốc trong thư mục
`Bài tập 12-9-2026/`, dùng làm tài liệu đối chiếu khi thao tác trên bộ dữ liệu thật
bằng công cụ SPSS-Lite này hoặc bằng SPSS thật.

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

## 4. Kiểm định độ tin cậy Cronbach's Alpha

Chạy Cronbach's Alpha cho **từng nhóm biến** (mỗi nhóm ứng với 1 khái niệm/thang
đo trong khung lý thuyết) — tương ứng Mục 4 của công cụ SPSS-Lite này. Lặp lại
cho tất cả các nhóm biến còn lại trong bảng hỏi.

## 5. Phân tích EFA (Exploratory Factor Analysis)

1. **Loại bỏ các biến kiểm định** dùng để lọc phiếu ở bước 2 (ví dụ: `a11`, `b8`
   trong bộ dữ liệu ví dụ của hướng dẫn gốc — hãy thay bằng đúng biến kiểm định
   của bảng hỏi bạn đang dùng).
2. **Loại trừ các nhóm chỉ còn 1 câu hỏi** sau khi chạy EFA (một nhóm chỉ có 1
   item thì không đủ điều kiện phân tích nhân tố).
3. Kết quả ví dụ trong hướng dẫn gốc rút gọn về **7 nhóm** với phân bổ:

   | Nhóm | Câu hỏi (ví dụ minh hoạ gốc) |
   |---|---|
   | Động lực nội tại | A2–A8 |
   | Động lực bên ngoài | B6, B7, B8 |
   | Động lực điều chỉnh | B1, B3, B4 |
   | Lập kế hoạch, giám sát thực hiện | C1, C3, D1, D3, D4 |
   | Khả năng tự giám sát | B5, D2 |
   | Khả năng tự chủ, hợp tác | C2, E4 |
   | Trách nhiệm cá nhân | A10, F1, F3, F4 |

   ⚠️ Bảng này là **ví dụ minh hoạ gốc** đi kèm hướng dẫn — với bộ dữ liệu Pilot
   thực tế của bạn (khảo sát GV về ứng dụng AI: PU/PEU/Concerns/Value/Attitude/
   Facilitating Conditions/Knowledge/Intention), bạn cần chạy lại EFA trên đúng
   codebook của mình để có nhóm biến chính xác — **không copy nguyên bảng này**.

## 6. Thống kê mô tả, Crosstab, biểu đồ

- Thống kê mô tả: tần suất (frequency), thống kê theo giá trị (mean/SD…) —
  tương ứng Mục 2 (Thống kê mô tả) của công cụ SPSS-Lite.
- Crosstab: bảng chéo giữa 2 biến định danh/thứ bậc (ví dụ Giới tính × Vị trí
  công tác) — SPSS-Lite hiện chưa có màn hình Crosstab riêng; có thể mô phỏng
  bằng cách nhóm dữ liệu và dùng biểu đồ Bar ở Mục 6.
- Biểu đồ: cành-lá (stem-and-leaf), boxplot — boxplot có sẵn ở Mục 3 và Mục 6
  của công cụ; biểu đồ cành-lá nên vẽ bằng Excel như hướng dẫn gốc.

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
