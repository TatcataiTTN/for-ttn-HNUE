# TASKS — Tự học Đề tài (self-study-Thesis)

Trạng thái: 🟢 xong · 🟡 đang làm · ⚪ chưa làm. Chế độ tiêu đề: Label Title. Ngôn ngữ: VI (gốc) + EN (cây en/, dịch dần).

## Quy ước
- Mỗi module: slide 5 phần, khái niệm + công thức, bối cảnh, ví dụ số thật từ bài gốc, bài tập tự chấm, máy tính tương tác, ngân hàng ≥100 câu trắc nghiệm (giải thích có nguồn) + tự luận, mục "Nối vào đề tài".
- Ngân hàng câu hỏi: `build/banks/<slug>.txt` (+ `.patch` cho nhiễu), sinh `modules/<slug>/quiz.json` bằng `python3 build/build_quiz.py`. Audit: vị trí A–D cân bằng; % đáp án đúng dài hơn nhiễu >10% phải ≲10%.
- Bản OCR/text các bài báo chỉ lưu cục bộ (`OCR_output/`, không push vì bản quyền).
- Số liệu tự tính kiểm chứng ở `data/verify/`. Test trình duyệt: `build/test/e2e.js <slug>`.

## Module
| # | Module | Trạng thái |
|---|---|---|
| 01 | Productive Failure | 🟢 107 MCQ + 11 TL |
| 02 | Cognitive Load Theory | 🟢 118 MCQ + 7 TL |
| 03 | Cognitive Apprenticeship & Scaffolding | 🟢 122 MCQ + 6 TL |
| 04 | Self-Regulated Learning | ⚪ |
| 05 | Metacognition | ⚪ |
| 06 | Self-Efficacy | ⚪ |
| 07 | Active Learning | ⚪ |
| 08 | Cognitive Offloading | ⚪ |
| 09 | Cognitive Augmentation | ⚪ |
| 10 | Appropriate Reliance & Calibrated Trust | ⚪ |
| 11 | TAM | ⚪ |
| 12 | UTAUT | ⚪ |
| 13 | Quasi-experiment & RCT | ⚪ |
| 14 | AI trong giáo dục có trách nhiệm | ⚪ |

## Còn thiếu / hạn chế đã biết
- Chưa có notebook `.ipynb` và sơ đồ `.drawio` (sơ đồ hiện vẽ inline SVG).
- Chưa có bản EN/ZH.
- Bốn bài chưa có trong thư mục nguồn: Panadero 2017, Martinez 2006, Lai 2011, Campbell & Stanley 1963.

## Bản tiếng Anh (en/)
Hạ tầng: `data-lang="en"`, `_shared/chrome.js|quiz.js|widgets.js` đã song ngữ; ngân hàng EN: `build/banks/<slug>.en.txt` → `python3 build/build_quiz.py <slug>:en`.
| Module | EN |
|---|---|
| 01 | 🟢 |
| 02 | 🟢 |
| 03–14 | ⚪ |
