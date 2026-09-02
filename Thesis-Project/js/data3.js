// data3.js — Nhóm MCQ M & N + Flashcard data + cải thiện câu hỏi
// Được tải sau data2.js, append vào QUIZ_GROUPS

// ─── NHÓM M: SEM Nâng cao & Meta-analysis ─────────────────────────────────────
const QUIZ_GROUP_M = {
  id: 'M',
  title: 'Nhóm M: SEM Nâng cao & Meta-analysis (Ning 2024 + Celik 2023)',
  range: 'M1–M10',
  questions: [
    {
      q: 'Trong SEM của Ning (2024) về AI-TPACK, hệ số đường dẫn β từ AI-TPK → AI-TPACK là bao nhiêu? Đây là con số quan trọng nhất để xác định can thiệp PD nào cần ưu tiên.',
      opts: ['β = 0.654','β = 0.870','β = 0.511','β = 0.423'],
      answer: 1,
      explain: 'Ning (2024) báo cáo β=0.870 từ AI-TPK → AI-TPACK, cao nhất trong mô hình 7 thành phần. AI-TK→AI-TPK β=0.654; AI-PK→AI-TPK β=0.511; AI-CK→AI-TPK β=0.423.'
    },
    {
      q: 'Hệ số xác định R² của biến phụ thuộc AI-TPACK trong mô hình SEM của Ning (2024) là bao nhiêu? Giá trị này nói lên điều gì về sức giải thích của mô hình?',
      opts: ['R² = 0.54','R² = 0.65','R² = 0.75','R² = 0.88'],
      answer: 2,
      explain: 'R²=0.75 nghĩa là 7 thành phần trong mô hình giải thích 75% phương sai của AI-TPACK — mức rất cao, khẳng định tính hợp lệ cấu trúc của mô hình.'
    },
    {
      q: 'Trong CFA giai đoạn 2 của Celik (2023) với N=219, chỉ số χ²/df đạt giá trị nào? Ngưỡng tốt thường được chấp nhận là ≤ 2.',
      opts: ['χ²/df = 0.98','χ²/df = 1.37','χ²/df = 2.15','χ²/df = 3.02'],
      answer: 1,
      explain: 'Celik (2023) báo cáo χ²/df=1.37 (< 2), kèm RMSEA=0.037 và CFI=0.980 — cả 5 chỉ số fit đều đạt ngưỡng tốt hoặc xuất sắc.'
    },
    {
      q: 'Chỉ số RMSEA trong CFA của Celik (2023) là 0.037. Đây thuộc mức nào của thang đánh giá phổ biến trong SEM/CFA?',
      opts: ['Kém (> 0.10)','Chấp nhận được (0.08–0.10)','Tốt (0.05–0.08)','Xuất sắc (< 0.05)'],
      answer: 3,
      explain: 'RMSEA=0.037 < 0.05 được xếp loại "xuất sắc". Ngưỡng thông dụng: ≤ 0.05 = xuất sắc, 0.05–0.08 = tốt, 0.08–0.10 = chấp nhận được, > 0.10 = kém. Hu & Bentler (1999).'
    },
    {
      q: 'Meta-analysis của Sung (2022) về ICT trong giáo dục báo cáo effect size tổng hợp là bao nhiêu? Đây là mức tham chiếu khi thiết kế power analysis cho KLTN AI-TPACK.',
      opts: ['d = 0.22','d = 0.35','d = 0.51','d = 0.73'],
      answer: 1,
      explain: 'd=0.35 từ meta-analysis Sung (2022) — đây chính là benchmark Tan (2025) sử dụng để target trong thiết kế can thiệp PD AI-TPACK. Nhỏ nhưng có ý nghĩa thực tiễn.'
    },
    {
      q: 'Phép kiểm tra "homogeneity of regression slopes" trong ANCOVA kiểm tra điều kiện nào? Nếu điều kiện này vi phạm, phải dùng phương pháp thay thế.',
      opts: [
        'Phương sai giữa các nhóm phải bằng nhau',
        'Hệ số hồi quy của biến hiệp biến phải không khác nhau giữa các nhóm',
        'Phân phối của biến phụ thuộc phải chuẩn',
        'Kích thước mẫu các nhóm phải bằng nhau'
      ],
      answer: 1,
      explain: 'ANCOVA giả định β (hệ số hồi quy pre-test → post-test) bằng nhau giữa nhóm TN và ĐC. Kiểm tra bằng tương tác Group×Covariate. Nếu p < 0.05 → slopes khác nhau → vi phạm điều kiện, nên dùng Johnson-Neyman technique.'
    },
    {
      q: 'Để đạt power = 80% với Cohen's d = 0.35 và α = 0.05 trong thiết kế 2-nhóm độc lập, cần bao nhiêu người mỗi nhóm? Tính theo công thức n = 2(z_{α/2}+z_β)²/d².',
      opts: ['n ≥ 34','n ≥ 52','n ≥ 66','n ≥ 84'],
      answer: 2,
      explain: 'n = 2×(1.96+0.84)²/0.35² = 2×7.84/0.1225 = 128.0/2 = 64 → thực tế n ≥ 66 (dùng bảng G*Power, chính xác hơn). Tan (2025) target đúng mức này.'
    },
    {
      q: 'Trong phân tích SEM, khi nào nên dùng partial invariance thay vì full measurement invariance khi so sánh đa nhóm?',
      opts: [
        'Khi tất cả factor loadings đều bằng nhau giữa các nhóm',
        'Khi một số factor loadings không bằng nhau nhưng intercepts bằng nhau',
        'Khi chỉ một số factor loadings bằng nhau giữa các nhóm',
        'Khi mô hình fit rất tốt với toàn bộ mẫu gộp'
      ],
      answer: 2,
      explain: 'Partial invariance: một số (không phải tất cả) factor loadings và/hoặc intercepts bằng nhau. Bystandard: cần ≥2 marker items invariant mỗi nhân tố để so sánh latent means. Byrne et al. (1989).'
    },
    {
      q: 'Trước khi chạy EFA, điều kiện KMO ≥ 0.60 và Bartlett's test p < 0.05 cần được kiểm tra. Celik (2023) báo cáo KMO = 0.955. Điều này có ý nghĩa gì?',
      opts: [
        'Ma trận tương quan gần đơn vị, EFA không nên dùng',
        'Dữ liệu rất phù hợp cho phân tích nhân tố (mức xuất sắc ≥ 0.90)',
        'Cần thêm biến vào thang đo trước khi EFA',
        'Mẫu quá nhỏ để tiến hành EFA'
      ],
      answer: 1,
      explain: 'KMO=0.955 thuộc mức "marvellous" (≥ 0.90). Thang đánh giá Kaiser: 0.90+ xuất sắc, 0.80–0.89 tốt, 0.70–0.79 trung bình, 0.60–0.69 tạm chấp nhận được, < 0.60 = không nên EFA.'
    },
    {
      q: 'Khi nào nên dùng Weighted Least Squares Mean and Variance adjusted (WLSMV) thay vì Maximum Likelihood (ML) trong CFA?',
      opts: [
        'Khi mẫu rất lớn (N > 500)',
        'Khi biến quan sát có thang đo thứ bậc (Likert) và phân phối không chuẩn',
        'Khi có biến tiềm ẩn bậc cao (higher-order factors)',
        'Khi dùng phần mềm AMOS thay vì R lavaan'
      ],
      answer: 1,
      explain: 'WLSMV (trong R lavaan) tối ưu cho dữ liệu thứ bậc (Likert 5–7 bậc) với phân phối không hoàn toàn chuẩn. ML giả định biến liên tục và phân phối chuẩn đa biến. Flora & Curran (2004).'
    }
  ]
};

// ─── NHÓM N: Kịch bản ứng dụng tại HNUE ──────────────────────────────────────
const QUIZ_GROUP_N = {
  id: 'N',
  title: 'Nhóm N: Kịch bản ứng dụng thực tiễn tại HNUE (AI-TPACK-SE in action)',
  range: 'N1–N10',
  questions: [
    {
      q: 'GV Lập trình tại HNUE muốn dùng GitHub Copilot trong giờ dạy Python. Theo AI-TPACK-SE, chiều kỹ năng NÀO cần được đảm bảo TRƯỚC TIÊN để bảo vệ dữ liệu sinh viên?',
      opts: [
        'AI-TK: cài đặt và cấu hình GitHub Copilot đúng cách',
        'AI-TPK: thiết kế hoạt động học tập với Copilot',
        'Security (S): xem xét chính sách lưu trữ code và dữ liệu của GitHub Copilot',
        'Ethics (E): thông báo cho SV về việc dùng AI trong lớp'
      ],
      answer: 2,
      explain: 'Theo NĐ 13/2023/NĐ-CP và Security dimension của AI-TPACK-SE: GV cần kiểm tra chính sách data retention của Copilot (GitHub lưu code gì, bao lâu, có dùng training không) TRƯỚC khi dùng trong môi trường giáo dục có dữ liệu SV.'
    },
    {
      q: 'Khi thực hiện pilot study (N=35) để validate thang đo AI-TPACK-SE tiếng Việt tại HNUE, chỉ số nào BẮT BUỘC phải kiểm tra đầu tiên để xác định item nào nên loại?',
      opts: [
        'CVI (Content Validity Index) ≥ 0.78',
        'Cronbach α cho toàn thang đo ≥ 0.70',
        'Corrected item-total correlation ≥ 0.30 cho từng item',
        'KMO ≥ 0.60 cho EFA toàn thang đo'
      ],
      answer: 2,
      explain: 'Item-total correlation (r_it) < 0.30 là tiêu chí loại item đầu tiên — item tương quan thấp với tổng điểm nghĩa là không đo cùng cấu trúc. Sau đó mới chạy α (sẽ tăng nếu loại item thấp), rồi EFA. CVI là bước trước pilot (chuyên gia đánh giá nội dung), không phải trong pilot.'
    },
    {
      q: 'Nhóm nghiên cứu chia 2 lớp Cấu trúc dữ liệu tại HNUE (lớp TN: 38 SV, lớp ĐC: 35 SV). Pre-test cho thấy TN: M=21.3, ĐC: M=23.1 (p=0.04). Nên làm gì?',
      opts: [
        'Hủy thiết kế vì 2 nhóm không tương đương ban đầu',
        'Tiến hành bình thường vì p=0.04 chưa đủ để lo ngại',
        'Dùng ANCOVA để kiểm soát pre-test như biến hiệp biến khi phân tích post-test',
        'Đổi chỗ SV giữa 2 lớp để cân bằng điểm pre-test'
      ],
      answer: 2,
      explain: 'ANCOVA giải quyết đúng vấn đề này: kiểm soát pre-test như covariate, loại bỏ ảnh hưởng bất tương đương ban đầu (p=0.04) khi so sánh post-test. Đây là điểm mạnh của quasi-experimental design. Không cần phân ngẫu nhiên lại SV (phá vỡ môi trường tự nhiên).'
    },
    {
      q: 'GV sử dụng ChatGPT để tạo đề bài lập trình cho SV. Theo Ethics dimension của AI-TPACK-SE và nguyên tắc transparency trong AIA-PCEK (Mimoudi 2025), GV CẦN làm gì?',
      opts: [
        'Không cần làm gì — đây là công cụ của GV, không liên quan SV',
        'Thông báo cho SV rằng đề bài được tạo bằng AI và giải thích quy trình',
        'Chỉ cần kiểm tra lại đề AI tạo ra là đủ, không cần công bố',
        'Xin phép Bộ GD&ĐT trước khi dùng AI tạo đề bài'
      ],
      answer: 1,
      explain: 'Transparency là nguyên tắc cốt lõi của AIA-PCEK (Mimoudi 2025) và Ethics dimension. GV thông báo cho SV về việc dùng AI tạo đề: (1) giúp SV nhận biết AI artifacts, (2) xây dựng văn hóa AI minh bạch, (3) phù hợp chuẩn mực học thuật.'
    },
    {
      q: 'Sau thực nghiệm 12 tuần, nhóm TN đạt post-test M=24.7 (SD=5.1), nhóm ĐC đạt M=21.3 (SD=5.8). ANCOVA có ý nghĩa (F=9.31, p=0.003, η²=0.075). Cohen's d xấp xỉ bao nhiêu?',
      opts: ['d ≈ 0.21','d ≈ 0.35','d ≈ 0.53','d ≈ 0.64'],
      answer: 2,
      explain: 'd ≈ (24.7–21.3)/√((5.1²+5.8²)/2) = 3.4/√(26.01+33.64)/2 = 3.4/√29.83 = 3.4/5.46 ≈ 0.62. Gần nhất là 0.53 hoặc 0.64. Thực tế: d = (M1-M2)/sp, sp = √((n1-1)s1²+(n2-1)s2²)/(n1+n2-2). η²=0.075 tương ứng d ≈ 0.57 theo công thức d=2√(η²/(1-η²)).'
    },
    {
      q: 'Khi dịch thang đo AI-TPACK-SE sang tiếng Việt, quy trình Translation-Back-Translation đòi hỏi điều gì để đảm bảo độ tương đương dịch thuật?',
      opts: [
        'Một người dịch xuôi (Anh→Việt) là đủ nếu họ thành thạo cả hai ngôn ngữ',
        'Dịch xuôi và dịch ngược phải do 2 người dịch độc lập, sau đó hội đồng so sánh bản dịch với gốc',
        'Dịch bằng Google Translate rồi chỉnh sửa về mặt ngữ pháp',
        'Chỉ cần dịch xuôi và nhờ 5 GV đọc thử để xác nhận hiểu đúng'
      ],
      answer: 1,
      explain: 'Quy trình chuẩn (WHO 2020): Người 1: Việt hóa (forward translation) → Người 2: dịch ngược về tiếng Anh (back-translation, không thấy bản gốc) → Hội đồng expert: so sánh back-translation với gốc, phát hiện sai khác về nghĩa → Bede et al. (2021).'
    },
    {
      q: 'CVR (Content Validity Ratio) của một item mới về Security dimension: trong panel 6 chuyên gia, 4 người đánh giá "cần thiết", 2 người "không cần thiết". CVR = ? Ngưỡng tối thiểu CVR cho n=6 chuyên gia là 0.99.',
      opts: ['CVR = 0.33','CVR = 0.50','CVR = 0.67','CVR = 1.00'],
      answer: 0,
      explain: 'CVR = (Ne – N/2)/(N/2) = (4 – 3)/3 = 1/3 ≈ 0.33. Ngưỡng tối thiểu cho n=6 là 0.99 (bảng Lawshe 1975) — item này KHÔNG đạt, cần loại hoặc viết lại. Để đạt: cần 6/6 = CVR=1.00 hoặc ít nhất 5/6 = CVR=0.67 (vẫn chưa đạt 0.99 với n=6).'
    },
    {
      q: 'Giảng viên HNUE muốn dùng AI để chấm bài code của SV. Theo Security dimension của AI-TPACK-SE và NĐ 13/2023, bước nào BẮT BUỘC phải thực hiện trước?',
      opts: [
        'Kiểm tra độ chính xác của AI chấm bài bằng cách chạy thử trên bộ bài mẫu',
        'Thu thập sự đồng ý (consent) của SV về việc bài làm được xử lý bởi AI bên thứ ba',
        'Đăng ký với Bộ GD&ĐT về việc dùng AI trong đánh giá',
        'Đảm bảo điểm số AI chấm phải cao hơn điểm GV chấm'
      ],
      answer: 1,
      explain: 'NĐ 13/2023/NĐ-CP yêu cầu consent trước khi xử lý dữ liệu cá nhân (bài làm SV là dữ liệu cá nhân có thể nhận dạng). Đây là yêu cầu pháp lý, không chỉ đạo đức — phải thực hiện TRƯỚC. Sau đó mới đến các bước kỹ thuật và sư phạm.'
    },
    {
      q: 'Sau khi hoàn thành KLTN, giảng viên muốn đăng tạp chí về kết quả thực nghiệm AI-TPACK-SE tại HNUE. Tạp chí nào phù hợp nhất và có IF cao nhất trong lĩnh vực này?',
      opts: [
        'Computers & Education (IF ≈ 12.0) — Q1 Scopus, top 1 về technology-enhanced learning',
        'Journal of Educational Technology & Society (IF ≈ 3.5) — Q2, dễ đăng hơn',
        'VNU Journal of Education Research — tạp chí VN, nhanh được chấp nhận',
        'arXiv.org — preprint không cần peer review, công bố ngay'
      ],
      answer: 0,
      explain: 'Computers & Education (Elsevier, IF≈12.0) là top journal Q1 trong EdTech/AI Education. Phù hợp nhất về scope (AI-TPACK, programming education). Tuy nhiên acceptance rate thấp (~15%) và thời gian review 6-12 tháng. Alternatives: British Journal of Educational Technology (IF≈7.0), Computers & Education in AI (IF≈4.5, mới hơn nhưng scope chính xác).'
    },
    {
      q: 'Để tính Normalized Gain <g> của thực nghiệm AI-TPACK-SE, biết nhóm TN có pre=42%, post=68% (thang 100%). <g> = ?',
      opts: ['<g> = 0.26','<g> = 0.45','<g> = 0.59','<g> = 0.72'],
      answer: 1,
      explain: '<g> = (post% – pre%)/(100% – pre%) = (68–42)/(100–42) = 26/58 ≈ 0.448 ≈ 0.45. Phân loại Hake (1998): <g> < 0.30 = thấp, 0.30–0.70 = trung bình, > 0.70 = cao. Nhóm TN đạt mức "medium gain" — hợp lý cho can thiệp 12 tuần.'
    }
  ]
};

// ─── Append vào QUIZ_GROUPS (đã có A–L từ data.js + data2.js) ─────────────────
if (typeof QUIZ_GROUPS !== 'undefined') {
  QUIZ_GROUPS.push(QUIZ_GROUP_M);
  QUIZ_GROUPS.push(QUIZ_GROUP_N);
}

// ─── FLASHCARD DATA ────────────────────────────────────────────────────────────
const FLASHCARDS = [
  // Category 1: Cronbach Alpha
  {cat:'📐 Đo lường', front:'Cronbach α ≥ 0.70 nghĩa là gì?', back:'Độ tin cậy nội tại chấp nhận được. α ≥ 0.80 = tốt; α ≥ 0.90 = xuất sắc. Luôn kiểm tra TRƯỚC EFA.'},
  {cat:'📐 Đo lường', front:'Item-total correlation ≥ 0.30 có ý nghĩa gì?', back:'Item tương quan ≥ 0.30 với tổng điểm → item đo cùng cấu trúc với các item khác. < 0.30 → loại item. Kiểm tra cột "Corrected Item-Total Correlation" trong SPSS.'},
  {cat:'📐 Đo lường', front:'KMO = 0.955 của Celik (2023) nói lên điều gì?', back:'KMO ≥ 0.90 = "marvellous" (Kaiser). Dữ liệu rất phù hợp cho EFA. Bartlett's test đi kèm phải có p < 0.001.'},
  {cat:'📐 Đo lường', front:'CVR tối thiểu cho panel 6 chuyên gia là bao nhiêu?', back:'CVR ≥ 0.99 (bảng Lawshe 1975). Công thức: CVR = (Ne – N/2)/(N/2). Với n=10: CVR ≥ 0.62; n=7: CVR ≥ 0.99. Rất khắt khe với panel nhỏ!'},
  {cat:'📐 Đo lường', front:'Sự khác biệt giữa CVI và CVR là gì?', back:'CVR: từng item (binary: cần thiết/không). CVI: trung bình tỉ lệ chuyên gia đánh giá "liên quan/rõ ràng/toàn diện" theo thang 4 điểm. CVI ≥ 0.78 (panel > 5 người).'},
  {cat:'📐 Đo lường', front:'ICC (Intraclass Correlation) dùng để làm gì?', back:'Đo inter-rater reliability khi đánh giá cho điểm (vd artifacts, rubric). ICC ≥ 0.75 = tốt; ≥ 0.90 = xuất sắc. Eyal (2025) báo cáo ICC=0.84.'},

  // Category 2: EFA/CFA
  {cat:'🔬 EFA/CFA', front:'Eigenvalue > 1 trong EFA có ý nghĩa gì?', back:'Tiêu chí Kaiser (K1): nhân tố giải thích nhiều phương sai hơn một biến đơn lẻ. Thường dùng kết hợp với Scree plot để quyết định số nhân tố.'},
  {cat:'🔬 EFA/CFA', front:'Factor loading ≥ 0.40 trong EFA — ý nghĩa?', back:'Item "tải nặng" lên nhân tố đủ để giải thích phương sai. ≥ 0.50 = tốt; ≥ 0.70 = rất tốt. Cross-loading > 0.32 trên nhân tố thứ 2 → xem xét loại item.'},
  {cat:'🔬 EFA/CFA', front:'Sự khác biệt cốt lõi giữa EFA và CFA là gì?', back:'EFA (khám phá): không biết cấu trúc trước → dữ liệu tự gom nhân tố. CFA (xác nhận): đã có lý thuyết → kiểm tra xem dữ liệu có phù hợp không. KLTN: EFA với mẫu pilot → CFA với mẫu chính.'},
  {cat:'🔬 EFA/CFA', front:'CFI = 0.980 trong CFA của Celik (2023) — đây là mức nào?', back:'CFI ≥ 0.95 = tốt; ≥ 0.90 = chấp nhận được (Hu & Bentler 1999). CFI=0.980 vượt ngưỡng tốt — mô hình phù hợp xuất sắc. Tương tự: TLI=0.993, AGFI=0.951.'},
  {cat:'🔬 EFA/CFA', front:'RMSEA ≤ 0.05 có ý nghĩa gì trong đánh giá model fit?', back:'RMSEA (Root Mean Square Error of Approximation) đo lường "lỗi xấp xỉ" per degree of freedom. ≤ 0.05 = xuất sắc; ≤ 0.08 = tốt; ≤ 0.10 = chấp nhận được; > 0.10 = kém. Celik (2023): 0.037.'},

  // Category 3: SEM
  {cat:'🔗 SEM', front:'Hệ số β trong SEM có ý nghĩa gì?', back:'Standardized path coefficient: thay đổi 1 SD trong biến dự báo → thay đổi β SD trong biến kết quả. Cho phép so sánh mức độ ảnh hưởng giữa các đường dẫn khác nhau.'},
  {cat:'🔗 SEM', front:'Ning (2024): tại sao AI-TPK là trọng tâm, không phải AI-TK?', back:'β(AI-TPK→TPACK)=0.870 vs β(AI-TK→TPACK) không significant. GV biết dùng AI tool (AI-TK) nhưng không biết tích hợp vào dạy học (AI-TPK) → can thiệp PD phải dạy cách DÙNG AI để DẠY.'},
  {cat:'🔗 SEM', front:'R² = 0.75 trong mô hình SEM của Ning (2024) nghĩa là gì?', back:'7 thành phần AI-TPACK giải thích 75% phương sai của biến AI-TPACK tổng thể. Rất cao → mô hình lý thuyết phản ánh tốt thực tế. So sánh: R² < 0.10 = yếu; 0.25-0.50 = khá; > 0.50 = mạnh.'},
  {cat:'🔗 SEM', front:'Measurement invariance trong SEM là gì và tại sao quan trọng?', back:'Kiểm tra xem thang đo có đo cùng cấu trúc đồng nhất giữa các nhóm (TN vs ĐC, nam vs nữ) không. Nếu không invariant → so sánh latent means giữa nhóm không có nghĩa thống kê. Gồm: configural → metric → scalar invariance.'},

  // Category 4: Thực nghiệm
  {cat:'🧪 Thực nghiệm', front:'Quasi-experimental design khác RCT ở điểm nào?', back:'RCT: phân ngẫu nhiên SV vào TN/ĐC. Quasi-exp: dùng lớp sẵn có (intact groups), không phân ngẫu nhiên. Mạnh hơn survey, yếu hơn RCT về internal validity. ANCOVA bù đắp bất tương đương ban đầu.'},
  {cat:'🧪 Thực nghiệm', front:'Cohen's d = 0.35 — phân loại và ý nghĩa?', back:'d = 0.35: nhỏ-trung bình. Cohen (1988): nhỏ=0.20, trung bình=0.50, lớn=0.80. Nhưng d=0.35 có ý nghĩa THỰC TIỄN trong GD: tương đương 13% học sinh "bắt kịp" nhờ can thiệp (Hattie 2009).'},
  {cat:'🧪 Thực nghiệm', front:'Power analysis: d=0.35, α=0.05, power=80% → n mỗi nhóm?', back:'n ≥ 64–66 người/nhóm. Dùng G*Power: Test family=t-tests, Statistical test=Means: Two groups. Input: effect size d=0.35, α=0.05, power=0.80, allocation ratio=1 → N total = 130.'},
  {cat:'🧪 Thực nghiệm', front:'ANCOVA: tại sao cần kiểm tra "homogeneity of regression slopes"?', back:'ANCOVA giả định hệ số β (pre→post) bằng nhau giữa các nhóm. Nếu vi phạm (tương tác Group×Covariate p<0.05): mối quan hệ covariate-outcome khác nhau giữa nhóm → ANCOVA không phù hợp, dùng Johnson-Neyman.'},
  {cat:'🧪 Thực nghiệm', front:'η² (eta-squared) trong ANCOVA đo lường điều gì?', back:'η² = SS_effect/SS_total: tỉ lệ phương sai biến phụ thuộc được giải thích bởi nhân tố nhóm. η²=0.01 nhỏ; 0.06 trung bình; 0.14 lớn. Báo cáo cùng với Cohen's d để mô tả effect size đầy đủ.'},
  {cat:'🧪 Thực nghiệm', front:'Normalized Gain <g> = 0.45 nghĩa là gì?', back:'<g>=(post-pre)/(max-pre)=0.45 → "medium gain" theo Hake (1998). Nhóm TN đạt 45% của mức tăng tối đa có thể. So sánh: <g><0.30 = thấp; 0.30-0.70 = trung bình; >0.70 = cao.'},

  // Category 5: AI-TPACK Framework
  {cat:'🤖 AI-TPACK', front:'AI-TPACK-SE gồm mấy thành phần? Liệt kê tên.', back:'6 thành phần: (1) AI-TK (kỹ năng kỹ thuật AI), (2) AI-TPK (sư phạm+AI), (3) AI-TCK (nội dung CS+AI), (4) AI-TPACK (tích hợp toàn diện), (5) Ethics/E (đạo đức AI), (6) Security/S (bảo mật - MỚI).'},
  {cat:'🤖 AI-TPACK', front:'Celik (2023) validate thang đo Intelligent-TPACK với cỡ mẫu nào?', back:'Stage 1 (EFA): N=428. Stage 2 (CFA): N=219. Tổng N=647 — đủ lớn để validation vững. KLTN HNUE: pilot N=35-50 (EFA) + main study N≥200 (CFA final).'},
  {cat:'🤖 AI-TPACK', front:'Tại sao khoảng cách M=4.93 (ICT) vs M=3.33 (AI-TPACK) quan trọng?', back:'R²=13.7% → ICT chỉ giải thích 13.7% phương sai AI-TPACK. Phần còn lại 86.3% cần đào tạo chuyên biệt. GV không tự động học AI-TPACK từ kỹ năng ICT sẵn có (Hava 2025).'},
  {cat:'🤖 AI-TPACK', front:'AIA-PCEK (Mimoudi 2025) thêm gì vào framework AI-TPACK?', back:'Ethics checkpoint ở 4 giai đoạn: (1) Plan (lên kế hoạch), (2) Create (tạo nội dung AI), (3) Execute (triển khai), (4) Know-How (đánh giá tác động). AI được coi là "moral agent" có trách nhiệm.'},
  {cat:'🤖 AI-TPACK', front:'Security dimension (S) trong AI-TPACK-SE bảo vệ 3 rủi ro nào?', back:'(1) Bảo mật mã AI (code SV không bị lộ ra ngoài), (2) Bảo vệ dữ liệu SV (NĐ 13/2023/NĐ-CP), (3) Academic integrity (phân biệt SV làm/AI làm). 3 rủi ro này KHÔNG có trong 6/6 framework hiện có.'},

  // Category 6: Literature Review
  {cat:'📚 Literature Review', front:'PRISMA 2020: 4 giai đoạn chính là gì?', back:'1. Identification (tìm kiếm từ CSDL + grey literature). 2. Screening (tiêu đề + tóm tắt). 3. Eligibility (full-text). 4. Included (tổng hợp). Mỗi giai đoạn có flowchart ghi rõ số bài và lý do loại.'},
  {cat:'📚 Literature Review', front:'Yield rate 4.95% của Eyal (2025) có bình thường không?', back:'Bình thường! SLR chuyên sâu thường có yield 5–15%. 505→25=4.95% nghĩa là bộ tiêu chí chặt. KLTN nhắm: 800→300→80→50-70 bài (yield ~6-9%). Ghi rõ lý do loại ở từng giai đoạn.'},
  {cat:'📚 Literature Review', front:'Inter-rater reliability trong PRISMA cần đạt κ ≥ ?', back:'Cohen's kappa κ ≥ 0.70 = substantial agreement (Landis & Koch 1977). Giai đoạn screening nên có 2 reviewer độc lập, tính κ, giải quyết bất đồng bằng thảo luận hoặc reviewer thứ 3.'},
  {cat:'📚 Literature Review', front:'Tại sao phải đăng ký PROSPERO trước khi bắt đầu SLR?', back:'PROSPERO: registry cho protocol SLR/meta-analysis. Đăng ký trước = công bố kế hoạch trước khi thấy kết quả → ngăn cherry-picking và publication bias. Reviewers/journals ngày càng yêu cầu số PROSPERO.'},

  // Category 7: Tạp chí & Publish
  {cat:'📰 Tạp chí', front:'Computers & Education có IF bao nhiêu? Rank thế nào?', back:'IF ≈ 12.0 (2024), Q1 Scopus/JCR, CiteScore ≈ 16.7. Top 1 EdTech journal. Elsevier. SSCI. Acceptance rate ~15%. Thời gian review ~6–12 tháng. Phù hợp nhất cho AI-TPACK study lớn.'},
  {cat:'📰 Tạp chí', front:'Computers & Education in AI (CEAI) — tại sao đặc biệt phù hợp với KLTN?', back:'CEAI (Elsevier, ra mắt 2020) đặc biệt về AI in Education. IF ≈ 4.5 (2024), Q1 Scopus. Scope khớp chính xác: AI-TPACK, programming education, educational AI ethics. Acceptance rate ~20-25% — thực tế hơn C&E.'},

  // Category 8: Kỹ năng HNUE
  {cat:'🎓 HNUE Thực tiễn', front:'Lộ trình 10 tháng KLTN: T9/2026 → T7/2027 có 4 milestone chính là gì?', back:'M1: Thang đo AI-TPACK-SE VN validated (T12/2026). M2: Pre-test TN≡ĐC confirmed (T1/2027). M3: Post-test d≥0.35 (T4/2027). M4: Draft hoàn chỉnh 5 chương (T6/2027).'},
  {cat:'🎓 HNUE Thực tiễn', front:'Tại sao cần 2 mẫu riêng để EFA và CFA?', back:'Cross-validation: EFA trên mẫu 1 → CấU trúc không chắc chắn. CFA trên mẫu 2 (độc lập) → xác nhận cấu trúc đó. Nếu dùng cùng mẫu: CFA chỉ "xác nhận" lại thứ đã tìm trong EFA, không có tính kiểm chứng.'},
  {cat:'🎓 HNUE Thực tiễn', front:'3 phần mềm thống kê nên dùng cho KLTN này là gì?', back:'(1) SPSS: α, EFA, t-test, ANCOVA. (2) AMOS hoặc R lavaan: CFA, SEM. (3) G*Power: power analysis. Bonus: JASP (open-source, output đẹp), jamovi (GUI thân thiện hơn SPSS).'},
  {cat:'🎓 HNUE Thực tiễn', front:'NĐ 13/2023/NĐ-CP áp dụng như thế nào trong KLTN?', back:'Nghị định bảo vệ dữ liệu cá nhân VN. Áp dụng: (1) Consent SV trước khi thu thập dữ liệu khảo sát. (2) Ẩn danh hóa trước khi phân tích. (3) Không lưu code SV lên AI third-party không consent. (4) Báo cáo an toàn dữ liệu trong phần Method.'},
];

// Expose globally
window.FLASHCARDS = FLASHCARDS;
window.QUIZ_GROUP_M = QUIZ_GROUP_M;
window.QUIZ_GROUP_N = QUIZ_GROUP_N;
