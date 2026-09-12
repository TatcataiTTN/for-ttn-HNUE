# SPSS-Lite bằng Python

Công cụ web xử lý dữ liệu thực nghiệm sư phạm, xây dựng theo đúng yêu cầu trong
`../Nhu cầu xử lý cho tôi.md`: thay thế một phần SPSS/SmartPLS bằng thư viện
Python (pandas, scipy, statsmodels), chạy **hoàn toàn trong trình duyệt** qua
Pyodide (Python biên dịch WebAssembly) — không có backend, không server, dữ
liệu không rời khỏi máy người dùng.

🔗 Trang chạy thật: https://tatcataittn.github.io/for-ttn-HNUE/SPSS/

## Cấu trúc thư mục

```
SPSS-Python-Toolkit/
├── index.html              # Giao diện chính (8 mục, sidebar điều hướng)
├── css/style.css
├── js/app.js                # Toàn bộ logic UI + gọi hàm Python qua Pyodide
├── py/analysis.py           # Lõi thống kê (t-test, ANOVA, hồi quy, Cronbach's Alpha...)
├── vendor/plotly/           # Plotly.js vendored (không phụ thuộc CDN lúc chạy)
├── sample_data/
│   ├── pilot_khao_sat_AI_giao_vien.csv     # THẬT — từ "1. Pilot.sav" (183 phiếu)
│   ├── khao_sat_nang_luc_so_HS_GV.csv      # THẬT — từ "2. KHAOSAT_HS_GV.sav" (911 phiếu)
│   ├── thuc_nghiem_su_pham.csv             # THẬT — từ "3. THUCNGHIEM1.sav" (183 HS, nhóm TN/ĐC)
│   └── khao_sat_mau.csv                    # Dữ liệu minh hoạ tổng hợp (seed cố định)
└── templates/                # Tài nguyên tải về, chạy OFFLINE trên máy/Cloud thật
    ├── SPSS_auto_template.ipynb   # Notebook mẫu dùng với Papermill
    ├── run_pipeline.py            # Script gọi Papermill
    ├── crontab_macos_huong_dan.txt
    ├── weekly_pipeline.yml        # GitHub Actions thay thế cron
    ├── kiem_toan_du_lieu.py       # Pydantic + kiểm tra mức toàn bảng
    ├── gradio_app_mau.py          # Web-app self-service (cần server riêng)
    ├── semopy_sem_day_du.py       # SEM/Path Model đầy đủ (CFI/TLI/RMSEA)
    ├── quy_trinh_lam_sach_du_lieu_goc.md  # Tóm tắt quy trình từ "!Huong dan SPSS.docx"
    ├── generate_sample_data.py    # Script sinh sample_data/khao_sat_mau.csv
    └── requirements.txt
```

## Nguồn gốc 3 bộ dữ liệu thật

Chuyển trực tiếp từ file `.sav` trong `../Bài tập 12-9-2026/` bằng `pyreadstat`,
**không chỉnh sửa nội dung số liệu** (chỉ bỏ cột kỹ thuật `filter_$` của SPSS).
Xem `templates/quy_trinh_lam_sach_du_lieu_goc.md` để biết quy trình làm sạch gốc
(lọc phiếu kém tin cậy, loại missing, Cronbach's Alpha, EFA) trước khi các file
này được tạo thành `.sav`. Vài ô tên khoa trong `pilot_khao_sat_AI_giao_vien.csv`
hiển thị dấu `?` thay cho ký tự có dấu — đây là lỗi encoding có sẵn trong file
`.sav` gốc (dữ liệu gốc đã mất dấu từ trước), không phải lỗi phát sinh khi chuyển đổi.

## Vì sao một số phần chạy trong trình duyệt, một số phần chỉ để tải về?

Theo đúng phân tích 3 hướng kiến trúc trong file yêu cầu gốc:

| Tính năng | Chạy ở đâu | Lý do |
|---|---|---|
| Data/Variable View, thống kê mô tả, t-test/ANOVA có rẽ nhánh, Cronbach's Alpha, OLS/Logistic, mediation, biểu đồ Plotly | **Trình duyệt (Pyodide)** | Đây là các phép tính scipy/statsmodels thuần Python, không cần biên dịch native, phù hợp WebAssembly. Ưu tiên bảo mật dữ liệu tuyệt đối. |
| SEM đầy đủ (semopy + Graphviz), Papermill, cron, GitHub Actions, Gradio, Great Expectations | **Tải về, chạy offline** | Các công cụ này cần biên dịch native, một máy chủ Python thật luôn chạy, hoặc truy cập hệ điều hành (cron, ghi file) — không thể chạy trong một trang web tĩnh. |

## Cách thêm/sửa phân tích mới

1. Thêm hàm mới vào `py/analysis.py` (nhận tham số, trả `json.dumps(...)`).
2. Gọi hàm đó từ `js/app.js` bằng `callPy("ten_ham", ...tham_so)`.
3. Không cần build/bundler — mở `index.html` qua một static server bất kỳ để test
   (`python3 -m http.server 8000` trong thư mục này rồi mở `localhost:8000`).

## Cách thêm dữ liệu mẫu mới

Sửa `templates/generate_sample_data.py` (giữ `np.random.default_rng(seed=...)`
cố định để tái lập được), chạy lại, rồi copy file CSV output vào `sample_data/`.
