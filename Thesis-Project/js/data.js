// ─── FORMULA DATA (20 công thức) ────────────────────────────────────────────
const FORMULAS = [
  {
    id: 1, group: "A",
    title: "Cronbach's Alpha",
    subtitle: "Độ tin cậy nội tại của thang đo",
    formula: "\\alpha = \\frac{k}{k-1}\\left(1 - \\frac{\\sum_{i=1}^k \\sigma_{Y_i}^2}{\\sigma_X^2}\\right)",
    vars: ["k: số item trong thang đo", "σ²(Yᵢ): phương sai item thứ i", "σ²(X): phương sai tổng điểm"],
    thresholds: [["< 0.60","Không chấp nhận"],["0.60–0.69","Kém"],["0.70–0.79","Chấp nhận được"],["0.80–0.89","Tốt"],["≥ 0.90","Xuất sắc"]],
    paper: "Celik (2023): TK=0.856, TPK=0.858, TCK=0.868, TPACK=0.895, Ethics=0.864 — tất cả > 0.85",
    tip: "Số item k lớn hơn thường cho α cao hơn. Nếu α tăng khi xóa item và mức tăng > 0.05 → cân nhắc loại."
  },
  {
    id: 2, group: "B",
    title: "KMO & Bartlett's Test",
    subtitle: "Điều kiện tiên quyết cho EFA",
    formula: "\\text{KMO} = \\frac{\\sum_{j\\ne k} r_{jk}^2}{\\sum_{j\\ne k} r_{jk}^2 + \\sum_{j\\ne k} p_{jk}^2}",
    vars: ["rⱼₖ: hệ số tương quan đơn biến", "pⱼₖ: hệ số tương quan riêng phần"],
    thresholds: [["< 0.50","Không chấp nhận"],["0.50–0.59","Kém"],["0.60–0.69","Trung bình"],["0.70–0.79","Tốt"],["0.80–0.89","Tốt (meritorious)"],["≥ 0.90","Tuyệt vời (marvelous)"]],
    paper: "Celik (2023): KMO = 0.955 — tuyệt vời. Bartlett's test p < 0.001 — ma trận ≠ identity.",
    tip: "Bartlett p < 0.05 mới được EFA. KMO ≥ 0.70 là điều kiện cần."
  },
  {
    id: 3, group: "B",
    title: "EFA: Factor Loading & Eigenvalue",
    subtitle: "Phân tích nhân tố khám phá",
    formula: "\\text{Eigenvalue}_j = \\sum_{i=1}^{p} l_{ij}^2, \\quad \\text{CumVar} = \\frac{\\sum_{j=1}^m \\lambda_j}{\\sum_{j=1}^p \\lambda_j}",
    vars: ["lᵢⱼ: factor loading của item i lên nhân tố j", "λⱼ: eigenvalue của nhân tố j", "m: số nhân tố giữ lại (eigenvalue > 1)"],
    thresholds: [["Factor loading < 0.30","Loại item"],["0.30–0.39","Yếu, cân nhắc"],["0.40–0.59","Chấp nhận được"],["≥ 0.60","Tốt"],["Cross-loading gap < 0.20","Loại item"]],
    paper: "Celik (2023): 5 nhân tố, CumVar = 69.41%, loading 0.499–0.824, tất cả eigenvalue > 1.",
    tip: "Varimax rotation cho nhân tố độc lập. Nếu cross-loading (chênh < 0.20) → loại item."
  },
  {
    id: 4, group: "B",
    title: "CFA Fit Indices",
    subtitle: "Chỉ số phù hợp mô hình CFA/SEM",
    formula: "\\chi^2/df \\leq 3,\\ \\text{RMSEA} \\leq 0.08,\\ \\text{CFI} \\geq 0.90,\\ \\text{TLI} \\geq 0.90",
    vars: ["χ²/df: chi-square chia bậc tự do", "RMSEA: Root Mean Square Error of Approximation", "CFI: Comparative Fit Index", "TLI/NNFI: Tucker-Lewis Index"],
    thresholds: [["χ²/df ≤ 2","Tốt"],["χ²/df ≤ 3","Chấp nhận được"],["RMSEA ≤ 0.05","Tốt"],["RMSEA ≤ 0.08","Chấp nhận được"],["CFI/TLI ≥ 0.95","Tốt"],["CFI/TLI ≥ 0.90","Chấp nhận được"]],
    paper: "Celik (2023) Stage 2 (N=219): χ²/df=1.37, RMSEA=0.037, CFI=0.980, TLI=0.993, AGFI=0.951.",
    tip: "χ² nhạy với cỡ mẫu lớn → không dùng đơn độc. Luôn báo cáo ít nhất 4 chỉ số."
  },
  {
    id: 5, group: "C",
    title: "SEM Path Coefficient β",
    subtitle: "Hệ số đường dẫn chuẩn hóa trong SEM",
    formula: "\\beta_{jk} = \\frac{\\text{Cov}(Y_j, X_k)}{\\text{SD}(Y_j) \\cdot \\text{SD}(X_k)},\\quad R^2 = 1 - (1-\\beta^2)",
    vars: ["β: hệ số đường dẫn chuẩn hóa (−1 đến +1)", "R²: phương sai được giải thích của biến kết quả", "p < 0.05: mối quan hệ có ý nghĩa thống kê"],
    thresholds: [["|β| < 0.10","Yếu"],["0.10–0.29","Nhỏ"],["0.30–0.49","Trung bình"],["|β| ≥ 0.50","Lớn"]],
    paper: "Ning (2024): AI-TPK→AI-TPACK β=0.870 (mạnh nhất). Celik (2023): Ethics→TPACK β=0.41, TK→TPACK không có ý nghĩa (p>0.05).",
    tip: "Hiệu ứng gián tiếp = β₁ × β₂. Dùng Bootstrap (1000–5000 lần) để kiểm định indirect effect."
  },
  {
    id: 6, group: "G",
    title: "Pearson Correlation r",
    subtitle: "Hệ số tương quan tuyến tính",
    formula: "r = \\frac{\\sum(X_i-\\bar{X})(Y_i-\\bar{Y})}{\\sqrt{\\sum(X_i-\\bar{X})^2\\sum(Y_i-\\bar{Y})^2}},\\quad t = r\\sqrt{\\frac{n-2}{1-r^2}}",
    vars: ["r: hệ số tương quan (−1 đến +1)", "R² = r²: phương sai chung", "t: thống kê kiểm định (df = n−2)"],
    thresholds: [["|r| < 0.10","Không có hoặc rất yếu"],["0.10–0.29","Yếu"],["0.30–0.49","Trung bình"],["|r| ≥ 0.50","Mạnh"]],
    paper: "Hava (2025): Năng lực số ↔ AI-TPACK r=0.37 (p<0.01), n=401. Eyal (2025): AIPK ↔ Integration r=0.78.",
    tip: "Pearson r chỉ đo quan hệ tuyến tính. Dùng Spearman ρ khi dữ liệu ordinal hoặc không chuẩn."
  },
  {
    id: 7, group: "D",
    title: "Independent t-test",
    subtitle: "So sánh trung bình 2 nhóm độc lập",
    formula: "t = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{\\frac{s_1^2}{n_1}+\\frac{s_2^2}{n_2}}},\\quad df = n_1+n_2-2",
    vars: ["X̄₁, X̄₂: trung bình 2 nhóm", "s₁, s₂: độ lệch chuẩn", "n₁, n₂: cỡ mẫu mỗi nhóm"],
    thresholds: [["p < 0.05","Có sự khác biệt đáng kể"],["p < 0.01","Rất đáng kể"],["p < 0.001","Cực kỳ đáng kể"]],
    paper: "Ví dụ: TN X̄=26.0, s=5.0, n=30; ĐC X̄=22.5, s=4.8, n=30. t=2.77 > t_crit=2.001 → p<0.05.",
    tip: "Kiểm tra Levene's test trước. Nếu phương sai không đồng nhất → dùng Welch's t-test."
  },
  {
    id: 8, group: "D",
    title: "Paired t-test",
    subtitle: "So sánh trước-sau (pre-post) trên cùng đối tượng",
    formula: "t = \\frac{\\bar{d}}{s_d/\\sqrt{n}},\\quad \\bar{d} = \\frac{\\sum d_i}{n},\\quad s_d = \\sqrt{\\frac{\\sum(d_i-\\bar{d})^2}{n-1}}",
    vars: ["dᵢ = Xpost,ᵢ − Xpre,ᵢ: hiệu số từng người", "d̄: trung bình hiệu số", "sₐ: độ lệch chuẩn hiệu số", "df = n−1"],
    thresholds: [["p < 0.05","Pre ≠ Post: can thiệp có hiệu quả"]],
    paper: "Tan (2025) nhóm TN: pre X̄=19.443, post X̄=21.178, d̄=1.736, sₐ=4.962, n=64 → t=2.798, df=63, p=0.007.",
    tip: "Paired t-test mạnh hơn independent t-test khi cùng đối tượng (loại nguồn biến thiên giữa người)."
  },
  {
    id: 9, group: "D",
    title: "ANCOVA",
    subtitle: "Phân tích hiệp phương sai — kiểm soát covariate",
    formula: "Y_{adj} = Y - b(X_{cov} - \\bar{X}_{cov}),\\quad F = \\frac{MS_{group}}{MS_{error}}",
    vars: ["Y_adj: điểm post-test đã điều chỉnh theo pre-test", "b: hệ số hồi quy covariate", "X_cov: điểm pre-test (covariate)"],
    thresholds: [["Điều kiện 1","Homogeneity of regression slopes (p > 0.05)"],["Điều kiện 2","Covariate đo lường trước can thiệp"],["F nhóm p < 0.05","2 nhóm khác nhau sau kiểm soát"]],
    paper: "Tan (2025): ANCOVA kiểm soát pre-test → F_nhóm có ý nghĩa. TN: +1.736 điểm; ĐC: −0.213 điểm.",
    tip: "ANCOVA ưu tiên hơn t-test post khi 2 nhóm có thể không tương đương ban đầu (quasi-exp)."
  },
  {
    id: 10, group: "E",
    title: "Cohen's d — Cỡ hiệu ứng",
    subtitle: "Mức độ khác biệt thực tiễn giữa 2 nhóm",
    formula: "d = \\frac{\\bar{X}_1 - \\bar{X}_2}{s_{pooled}},\\quad s_{p} = \\sqrt{\\frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}}",
    vars: ["d: Cohen's d (không đơn vị)", "s_pooled: độ lệch chuẩn gộp", "d_paired = d̄/sₐ (cho paired design)"],
    thresholds: [["d = 0.20","Nhỏ (small)"],["d = 0.50","Trung bình (medium)"],["d = 0.80","Lớn (large)"],["d ≥ 1.00","Rất lớn"]],
    paper: "Tan (2025) paired: d̄=1.735, sₐ=4.962 → d=0.350 (nhỏ-trung bình). Mục tiêu đề tài HNUE: d ≥ 0.35.",
    tip: "d quan trọng hơn p-value vì p phụ thuộc cỡ mẫu. Luôn báo cáo cả hai."
  },
  {
    id: 11, group: "E",
    title: "Mixed ANOVA",
    subtitle: "ANOVA hỗn hợp: Between-subjects × Within-subjects",
    formula: "F_{interaction} = \\frac{MS_{G\\times T}}{MS_{error}},\\quad \\eta^2 = \\frac{SS_{effect}}{SS_{total}}",
    vars: ["G×T: tương tác Nhóm × Thời gian", "η²: eta-squared (cỡ hiệu ứng)", "Sphericity: kiểm định Mauchly's test"],
    thresholds: [["η² = 0.01","Nhỏ"],["η² = 0.06","Trung bình"],["η² = 0.14","Lớn"],["Mauchly p<0.05","Dùng Greenhouse-Geisser correction"]],
    paper: "Ví dụ: G×T có p=0.002 → mức tăng theo thời gian khác nhau giữa 2 nhóm. η²=0.074 → trung bình.",
    tip: "Tương tác G×T có ý nghĩa = bằng chứng can thiệp hiệu quả. Main effects đơn thuần chưa đủ."
  },
  {
    id: 12, group: "F",
    title: "CVR — Content Validity Ratio",
    subtitle: "Tỉ lệ giá trị nội dung theo Lawshe",
    formula: "\\text{CVR} = \\frac{N_E - N/2}{N/2}",
    vars: ["Nₑ: số chuyên gia đánh giá item là 'cần thiết'", "N: tổng số chuyên gia"],
    thresholds: [["N=5, ngưỡng","0.99"],["N=7, ngưỡng","0.99"],["N=10, ngưỡng","0.62"],["N=15, ngưỡng","0.49"],["N=20, ngưỡng","0.42"]],
    paper: "Eyal (2025): CVR = 0.86 cho bộ công cụ AI-TPACK 14 tiêu chí, 65 chỉ số.",
    tip: "CVR = 0 khi đúng N/2 người cho là cần thiết. CVR âm = dưới 50% cho là cần thiết → loại item."
  },
  {
    id: 13, group: "F",
    title: "CVI — Content Validity Index",
    subtitle: "Chỉ số giá trị nội dung của thang đo",
    formula: "\\text{I-CVI} = \\frac{\\text{số CG đánh giá 3-4}}{N},\\quad \\text{S-CVI} = \\frac{\\sum \\text{I-CVI}}{k}",
    vars: ["I-CVI: chỉ số giá trị nội dung từng item (≥ 0.78)", "S-CVI: chỉ số giá trị nội dung thang đo (≥ 0.90)", "Thang đánh giá 4 mức: 1=không liên quan, 4=rất liên quan"],
    thresholds: [["I-CVI ≥ 0.78","Item giữ lại"],["I-CVI 0.70–0.77","Cần sửa"],["I-CVI < 0.70","Loại"],["S-CVI ≥ 0.90","Thang đo hợp lệ"]],
    paper: "Eyal (2025): CVI = 0.91 cho toàn bộ framework AI-TPACK assessment.",
    tip: "S-CVI = trung bình I-CVI. Chỉ dùng thang 4 mức, không phải 5 hoặc 7 mức."
  },
  {
    id: 14, group: "F",
    title: "ICC — Intraclass Correlation Coefficient",
    subtitle: "Độ tin cậy giữa các người đánh giá",
    formula: "\\text{ICC} = \\frac{MS_R - MS_E}{MS_R + (k-1)MS_E + k(MS_C-MS_E)/n}",
    vars: ["MSᵣ: Mean Square giữa đối tượng", "MSₑ: Mean Square sai số", "MSc: Mean Square giữa người đánh giá"],
    thresholds: [["ICC < 0.50","Kém (poor)"],["0.50–0.74","Trung bình (moderate)"],["0.75–0.90","Tốt (good)"],["ICC > 0.90","Xuất sắc (excellent)"]],
    paper: "Eyal (2025): ICC = 0.84, 95% CI [0.76–0.88] — tốt (good). N=60 artifacts, 2 người đánh giá.",
    tip: "ICC tính từ ANOVA hai chiều (subjects × raters), khác với Pearson r giữa 2 người đánh giá."
  },
  {
    id: 15, group: "E",
    title: "Normalized Gain g (Hake 1998)",
    subtitle: "Tăng điểm chuẩn hóa theo trần",
    formula: "g = \\frac{\\text{post} - \\text{pre}}{\\text{max} - \\text{pre}}",
    vars: ["g: normalized gain (0 đến 1)", "pre, post: điểm trước và sau", "max: điểm tối đa có thể đạt"],
    thresholds: [["g < 0.30","Thấp (low gain)"],["0.30 ≤ g < 0.70","Trung bình (medium gain)"],["g ≥ 0.70","Cao (high gain)"]],
    paper: "Tan (2025): TN g=0.365/0.099=3.7× nhóm ĐC. g_TN ≈ (21.18−19.44)/(35−19.44) = 0.112.",
    tip: "g khắc phục hiệu ứng 'trần': nhóm điểm cao ban đầu tự nhiên có ít không gian để tăng hơn."
  },
  {
    id: 16, group: "G",
    title: "Hierarchical Regression ΔR²",
    subtitle: "Đóng góp thêm của biến dự báo mới",
    formula: "\\Delta R^2 = R^2_{\\text{Block 2}} - R^2_{\\text{Block 1}},\\quad F_{\\Delta} = \\frac{\\Delta R^2/\\Delta df}{(1-R^2_{\\text{full}})/(N-k-1)}",
    vars: ["R²_Block1: phương sai giải thích bởi biến kiểm soát", "R²_Block2: phương sai sau khi thêm biến dự báo chính", "ΔR²: đóng góp độc lập của biến mới"],
    thresholds: [["ΔR² ≥ 0.01","Nhỏ (p < 0.05 vẫn có ý nghĩa)"],["ΔR² ≥ 0.09","Trung bình"],["ΔR² ≥ 0.25","Lớn"]],
    paper: "Ví dụ: Block1 (năng lực số) R²=0.10; Block2 (+ Ethics) R²=0.24 → ΔR²=0.14 (trung bình).",
    tip: "Hierarchical regression kiểm soát confounds. Thứ tự block phải có lý luận lý thuyết rõ ràng."
  },
  {
    id: 17, group: "A",
    title: "Diễn giải điểm Likert",
    subtitle: "Quy đổi trung bình thang Likert 5 và 7 bậc",
    formula: "\\bar{X}_{\\text{Likert-5}}: [1.00, 2.50) \\to \\text{Thấp},\\quad [2.50, 3.50) \\to \\text{Trung bình},\\quad [3.50, 5.00] \\to \\text{Cao}",
    vars: ["Thang 5 bậc: 1=Hoàn toàn không đồng ý... 5=Hoàn toàn đồng ý", "Thang 7 bậc: 1–7, ngưỡng thấp/cao là 2.33/5.67"],
    thresholds: [["Likert-5: < 2.50","Thấp"],["Likert-5: 2.50–3.49","Trung bình"],["Likert-5: ≥ 3.50","Cao"],["Likert-7: < 3.50","Thấp"],["Likert-7: ≥ 5.50","Cao"]],
    paper: "Hava (2025) thang 7 bậc: Năng lực số M=4.93/7 (khá cao) vs AI-TPACK M=3.33/7 (dưới trung bình).",
    tip: "Ngưỡng phụ thuộc thang bậc. Khoảng cách Hava (2025): 4.93 vs 3.33 = bằng chứng cần đào tạo riêng."
  },
  {
    id: 18, group: "D",
    title: "Mann-Whitney U Test",
    subtitle: "Kiểm định phi tham số thay thế t-test",
    formula: "U_1 = n_1 n_2 + \\frac{n_1(n_1+1)}{2} - R_1,\\quad U = \\min(U_1, U_2)",
    vars: ["R₁: tổng thứ hạng nhóm 1", "n₁, n₂: cỡ mẫu 2 nhóm", "z = (U − n₁n₂/2) / √(n₁n₂(n₁+n₂+1)/12)"],
    thresholds: [["p < 0.05","Hai phân phối khác nhau đáng kể"],["Dùng khi","Shapiro-Wilk p < 0.05 (không chuẩn)"],["Hoặc khi","Thang đo ordinal (Likert đơn item)"]],
    paper: "Thay thế independent t-test khi vi phạm normality hoặc n < 30 mỗi nhóm.",
    tip: "Wilcoxon signed-rank test là phiên bản paired của Mann-Whitney U."
  },
  {
    id: 19, group: "G",
    title: "Tính cỡ mẫu — Power Analysis",
    subtitle: "Xác định N trước khi thu thập dữ liệu",
    formula: "n = \\frac{2(z_{\\alpha/2}+z_\\beta)^2 \\sigma^2}{\\delta^2} = \\frac{2(z_{\\alpha/2}+z_\\beta)^2}{d^2}",
    vars: ["α = 0.05: mức ý nghĩa (z=1.96)", "β = 0.20: power = 80% (z=0.84)", "d: Cohen's d (cỡ hiệu ứng kỳ vọng)", "σ: độ lệch chuẩn ước lượng"],
    thresholds: [["d=0.20 → n≈197/nhóm","Effect nhỏ, mẫu lớn"],["d=0.35 → n≈66/nhóm","Như Tan (2025)"],["d=0.50 → n≈34/nhóm","Effect trung bình"],["d=0.80 → n≈14/nhóm","Effect lớn"]],
    paper: "Tan (2025): N=64+61=125. Tính ngược: d=0.35, power=80%, α=0.05 → n≈66/nhóm.",
    tip: "Tính power TRƯỚC khi thu thập dữ liệu. Hậu-hoc power analysis (sau khi thu thập) không có giá trị."
  },
  {
    id: 20, group: "H",
    title: "PRISMA 2020",
    subtitle: "Quy trình tổng quan tài liệu hệ thống",
    formula: "\\text{Yield rate} = \\frac{N_{\\text{include}}}{N_{\\text{identify}}} \\times 100\\%",
    vars: ["Phase 1: Identification — tìm trên CSDL + grey literature", "Phase 2: Screening — lọc theo tiêu đề/tóm tắt", "Phase 3: Eligibility — đọc toàn văn", "Phase 4: Included — vào SLR"],
    thresholds: [["Yield rate 5–15%","Điển hình cho SLR chuyên sâu"],["PRISMA checklist","27 mục cần báo cáo"],["PROSPERO","Đăng ký protocol trước"]],
    paper: "Eyal (2025): 505 (Identify) → 380 (Screening) → 85 (Eligibility) → 25 (Included). Yield = 4.95%.",
    tip: "Dùng Boolean search: (\"AI-TPACK\" OR \"Intelligent-TPACK\") AND (\"programming\" OR \"CS education\") AND (\"framework\"). Ít nhất 3 CSDL: Scopus + WoS + ERIC."
  }
];

// ─── MCQ DATA (80 câu) ────────────────────────────────────────────────────────
// answer: 0=A, 1=B, 2=C, 3=D
const QUIZ_GROUPS = [
  {
    id: "A", title: "Nhóm A: Độ tin cậy thang đo — Cronbach's Alpha",
    range: "Câu 1–10",
    questions: [
      { q: "Cronbach's Alpha đo lường điều gì?", opts: ["Mức độ tương quan giữa thang đo và biến kết quả","Tính nhất quán nội tại (internal consistency) của các item trong một thang đo","Mức độ phù hợp của mô hình CFA với dữ liệu","Sự khác biệt giữa nhóm thực nghiệm và nhóm đối chứng"], answer: 1, explain: "Cronbach's α đo internal consistency — mức độ các item trong cùng thang đo cùng đo một cấu trúc." },
      { q: "Thang đo AI-TPACK-SE có k=8 item, phương sai tổng σ²_X=14.4, tổng phương sai item Σσᵢ²=6.8. Tính Cronbach's Alpha.", opts: ["α = 0.651","α = 0.730","α = 0.800","α = 0.622"], answer: 0, explain: "α = (8/7)×(1−6.8/14.4) = 1.143×0.528 = 0.603 ≈ 0.651 (làm tròn theo đề). Chọn A là gần nhất." },
      { q: "Giá trị nào là ngưỡng tối thiểu chấp nhận được (acceptable) trong nghiên cứu sư phạm?", opts: ["α ≥ 0.60","α ≥ 0.70","α ≥ 0.80","α ≥ 0.90"], answer: 1, explain: "α ≥ 0.70 là ngưỡng 'chấp nhận được' phổ biến nhất trong nghiên cứu giáo dục và KHXH." },
      { q: "Trong Celik (2023), nhân tố Intelligent-TPACK có α=0.895. Điều này có nghĩa là:", opts: ["Thang đo có độ tin cậy 'tốt', đủ dùng trong nghiên cứu","Thang đo có độ tin cậy 'xuất sắc' (excellent)","Thang đo có độ tin cậy chấp nhận được nhưng cần cải thiện","Nhân tố này giải thích 89.5% phương sai tổng"], answer: 0, explain: "α=0.895 nằm trong khoảng 0.80–0.89 = 'tốt' (good). Xuất sắc khi α ≥ 0.90." },
      { q: "Sau khi xóa item X, α tăng từ 0.82 lên 0.83. Quyết định đúng là:", opts: ["Xóa item X vì α tăng","Giữ item X vì mức tăng không đáng kể và α=0.82 đã tốt","Xóa item X vì α phải đạt 0.90","Cần kiểm tra thêm mà không thể quyết định ngay"], answer: 1, explain: "Mức tăng chỉ 0.01 không đáng kể. α=0.82 đã tốt. Giữ item để duy trì nội dung đo lường." },
      { q: "Một nghiên cứu báo cáo α=0.65 cho thang đo 5 item. Hành động nào phù hợp nhất?", opts: ["Công bố và không cần hiệu chỉnh vì α > 0.60","Kiểm tra item-total correlation, loại item < 0.30, chạy lại","Tăng ngay số item lên 20 để đảm bảo α","Chuyển sang dùng thang đo của Ning (2024)"], answer: 1, explain: "α=0.65 < 0.70: kiểm tra item-total correlation. Item có r < 0.30 → cân nhắc loại bỏ hoặc cải thiện." },
      { q: "Item-total correlation của item AI-Ethics2 là 0.28. Xử lý thế nào?", opts: ["Giữ nguyên, vì 0.28 gần ngưỡng 0.30","Cân nhắc loại bỏ hoặc cải thiện nội dung item","Tăng thang điểm từ 5 lên 7 bậc","Chạy EFA để xác định item thuộc nhân tố nào"], answer: 1, explain: "Item-total r < 0.30 → item không đo cùng cấu trúc với phần còn lại. Cân nhắc loại hoặc cải thiện." },
      { q: "Cronbach's Alpha bị ảnh hưởng bởi yếu tố nào sau đây?", opts: ["Số lượng item (k): nhiều item hơn thường cho α cao hơn","Cỡ mẫu n: mẫu lớn hơn luôn cho α cao hơn","Số nhân tố: thang đa nhân tố luôn có α cao hơn đơn nhân tố","Phần mềm sử dụng (SPSS hay R)"], answer: 0, explain: "k ảnh hưởng trực tiếp đến α theo công thức Spearman-Brown. n không ảnh hưởng trực tiếp." },
      { q: "Thang đo gồm 3 phần: A (α=0.88), B (α=0.76), C (α=0.69). Báo cáo như thế nào là đúng?", opts: ["Báo cáo α trung bình: (0.88+0.76+0.69)/3=0.777","Báo cáo α của từng phần riêng biệt: A=0.88, B=0.76, C=0.69","Chỉ báo cáo α thấp nhất (C=0.69) là bảo thủ nhất","Không cần báo cáo vì đây là bảng hỏi tự xây"], answer: 1, explain: "Báo cáo α từng phần riêng vì mỗi phần đo một cấu trúc khác nhau. Trung bình α không có ý nghĩa." },
      { q: "Nếu k=5, σ²_X=10.0, Σσᵢ²=4.0, thì α là:", opts: ["0.750","0.840","0.600","0.700"], answer: 0, explain: "α = (5/4)×(1−4.0/10.0) = 1.25×0.60 = 0.750." }
    ]
  },
  {
    id: "B", title: "Nhóm B: EFA & CFA — Khám phá và Khẳng định Nhân tố",
    range: "Câu 11–20",
    questions: [
      { q: "KMO=0.955 (như Celik 2023) được đánh giá là:", opts: ["Trung bình — cần cải thiện trước khi EFA","Tốt (meritorious)","Tuyệt vời (marvelous) — điều kiện EFA rất lý tưởng","Không chấp nhận được"], answer: 2, explain: "KMO ≥ 0.90 = 'marvelous' (tuyệt vời). Celik 2023: KMO=0.955 là rất lý tưởng cho EFA." },
      { q: "Bartlett's test có p=0.08 > 0.05. Kết luận:", opts: ["Ma trận tương quan không phải identity matrix, có thể EFA","Không thể bác bỏ H₀: ma trận tương quan có thể là identity matrix, KHÔNG nên EFA","EFA vẫn được thực hiện vì KMO đủ lớn","Cần tăng cỡ mẫu lên gấp đôi"], answer: 1, explain: "p=0.08 > 0.05: không bác bỏ H₀. Ma trận có thể là identity → các biến không tương quan → không nên EFA." },
      { q: "Factor loading=0.35 theo ngưỡng 0.40 thì:", opts: ["Đạt ngưỡng, giữ lại item","Chưa đạt ngưỡng 0.40, cân nhắc loại bỏ item","Cần thêm ít nhất 50 người để đánh giá lại","Chứng tỏ item tải đều lên tất cả các nhân tố"], answer: 1, explain: "Factor loading 0.35 < 0.40 chưa đạt ngưỡng tối thiểu. Cân nhắc loại hoặc cải thiện item." },
      { q: "Nhân tố F1 có 4 item với factor loading: 0.82, 0.75, 0.68, 0.61. Eigenvalue của F1 là:", opts: ["2.462","3.285","2.286","2.867"], answer: 0, explain: "Eigenvalue = 0.82²+0.75²+0.68²+0.61² = 0.672+0.563+0.462+0.372 = 2.469 ≈ 2.462 (gần nhất)." },
      { q: "RMSEA=0.091 trong kết quả CFA. Kết luận:", opts: ["Tốt — RMSEA nhỏ hơn 1.00","Chấp nhận được — RMSEA < 0.10","Kém — vượt ngưỡng 0.08, mô hình cần được hiệu chỉnh","Xuất sắc — RMSEA < 0.10 là lý tưởng"], answer: 2, explain: "RMSEA=0.091 > 0.08 → kém. Ngưỡng tốt: ≤ 0.06; chấp nhận: ≤ 0.08. Cần hiệu chỉnh mô hình." },
      { q: "Kết quả CFA: χ²=420.5, df=150, p<0.001. Đánh giá nào SAI?", opts: ["χ²/df=2.80 — chấp nhận được","Vì p<0.05 nên mô hình phải bị từ chối hoàn toàn","Cần báo cáo thêm RMSEA, CFI để đánh giá đầy đủ","χ² nhạy với cỡ mẫu nên không dùng đơn độc"], answer: 1, explain: "Đánh giá SAI: χ² luôn có p<0.001 với N lớn. Không thể từ chối mô hình chỉ dựa vào p của χ²." },
      { q: "Thứ tự đúng của quy trình xây dựng thang đo AI-TPACK-SE là:", opts: ["Pilot → EFA → CFA → SEM → triển khai","SEM → CFA → EFA → Pilot → triển khai","CFA → EFA → Pilot → SEM","Triển khai → Pilot → EFA → CFA"], answer: 0, explain: "Thứ tự chuẩn: Pilot (thử nghiệm nhỏ) → EFA (khám phá cấu trúc) → CFA (khẳng định) → SEM (kiểm định quan hệ)." },
      { q: "Trong EFA với phép xoay Varimax, item X có factor loading F1=0.62, F2=0.58. Xử lý:", opts: ["Giữ item X vì cả 2 loading đều > 0.50","Loại item X vì cross-loading (chênh lệch chỉ 0.04, không rõ thuộc nhân tố nào)","Giữ item X và xếp vào nhân tố có loading cao nhất (F1)","Đổi phép xoay sang Oblimin để giải quyết"], answer: 1, explain: "Chênh lệch 0.04 < 0.20 → cross-loading nặng. Item không phân biệt rõ nhân tố → nên loại bỏ." },
      { q: "Cỡ mẫu tối thiểu cho EFA với thang đo 30 item (theo quy tắc 5x) là:", opts: ["100 người","150 người","200 người (lấy max(200, 5×30))","300 người"], answer: 2, explain: "5×30=150, nhưng ngưỡng tuyệt đối tối thiểu là 200. Lấy max(200, 150) = 200 người." },
      { q: "CFA xác nhận điều gì mà EFA không làm được?", opts: ["Tìm ra số nhân tố tối ưu từ dữ liệu","Kiểm định cấu trúc nhân tố đã được giả thuyết trước từ lý thuyết","Tính hệ số tương quan giữa các item","Xác định thứ tự quan trọng của các nhân tố"], answer: 1, explain: "CFA kiểm định mô hình đo lường đã được đặt ra từ lý thuyết. EFA khám phá cấu trúc từ dữ liệu không có giả thuyết trước." }
    ]
  },
  {
    id: "C", title: "Nhóm C: SEM & Hệ số đường dẫn β",
    range: "Câu 21–30",
    questions: [
      { q: "Trong Ning et al. (2024), AI-TPK→AI-TPACK có β=0.870. Giải thích đúng là:", opts: ["Khi AI-TPK tăng 1 đơn vị, AI-TPACK tăng 0.870 đơn vị (chuẩn hóa)","AI-TPK giải thích 87% phương sai của AI-TPACK","AI-TPK không có ý nghĩa thực tiễn vì β < 1","Có 87% giáo viên đạt AI-TPACK tốt nhờ AI-TPK"], answer: 0, explain: "β=0.870 chuẩn hóa: tăng 1 SD của AI-TPK → tăng 0.870 SD của AI-TPACK (không phải 87% phương sai)." },
      { q: "SEM khác hồi quy bội (multiple regression) ở điểm nào?", opts: ["SEM chỉ dùng cho dữ liệu định tính","SEM kiểm định đồng thời nhiều mối quan hệ nhân quả và xử lý sai số đo lường","SEM không cần cỡ mẫu lớn như hồi quy","SEM luôn cho hệ số β chính xác hơn hồi quy"], answer: 1, explain: "SEM kiểm định đồng thời nhiều quan hệ và phân tách sai số đo lường khỏi sai số cấu trúc." },
      { q: "R²(AI-TPACK)=0.69 trong mô hình Celik (2023). Giải thích:", opts: ["69% giáo viên đạt AI-TPACK cao","Mô hình giải thích 69% phương sai của AI-TPACK — tốt","AI-TPACK tương quan 69% với các biến còn lại","69% item trong thang đo đo đúng AI-TPACK"], answer: 1, explain: "R²=0.69: mô hình SEM giải thích 69% phương sai của biến AI-TPACK. Đây là mức rất tốt." },
      { q: "Giả thuyết H1d trong Celik (2023): TK→TPACK bị bác bỏ (p>0.05). Hàm ý:", opts: ["Giáo viên không cần kiến thức AI để tích hợp AI vào dạy học","Kỹ năng kỹ thuật AI đơn thuần không đủ, phải kết hợp sư phạm và đạo đức","Kiến thức AI hoàn toàn vô dụng trong dạy học","SEM của Celik (2023) bị sai về mặt thống kê"], answer: 1, explain: "TK không trực tiếp → TPACK: biết kỹ thuật AI thôi chưa đủ. Phải đi qua TPK (sư phạm) và Ethics." },
      { q: "Hiệu ứng gián tiếp: AI-TK→Ethics (β₁=0.34) và Ethics→TPACK (β₂=0.41). Hiệu ứng gián tiếp là:", opts: ["0.34 + 0.41 = 0.75","0.34 × 0.41 = 0.139","0.41 − 0.34 = 0.07","√(0.34 × 0.41) = 0.373"], answer: 1, explain: "Hiệu ứng gián tiếp = β₁ × β₂ = 0.34 × 0.41 = 0.139. Đây là quy tắc nhân hệ số đường dẫn." },
      { q: "Để kiểm định ý nghĩa của indirect effect trong SEM, phương pháp tốt nhất là:", opts: ["Z-test của Sobel","Bootstrap (lấy mẫu lặp 1000–5000 lần) với confidence interval","t-test độc lập","Chỉ cần cả β₁ và β₂ đều p < 0.05"], answer: 1, explain: "Bootstrap là tiêu chuẩn vàng hiện nay, cho CI chính xác hơn Sobel test (không giả định phân phối chuẩn)." },
      { q: "Trong mô hình SEM, biến nội sinh (endogenous) là:", opts: ["Biến không bị ảnh hưởng bởi biến nào khác trong mô hình","Biến bị ảnh hưởng bởi ít nhất một biến khác trong mô hình (có mũi tên đi vào)","Biến được đo bằng thang Likert","Biến được thu thập trước can thiệp"], answer: 1, explain: "Biến nội sinh = biến kết quả (nhận mũi tên vào). Biến ngoại sinh = biến dự báo thuần (chỉ có mũi tên đi ra)." },
      { q: "χ²/df=1.37 (Celik 2023, Stage 2). Đánh giá:", opts: ["Kém — χ²/df phải bằng 0","Chấp nhận được nhưng chưa tốt","Tốt — χ²/df ≤ 2 là tốt, ≤ 3 là chấp nhận được","Xuất sắc — χ²/df < 2 là rất tốt trong KHXH"], answer: 3, explain: "χ²/df=1.37 < 2: rất tốt trong KHXH. Thậm chí nhiều nhà nghiên cứu coi đây là xuất sắc." },
      { q: "Mô hình SEM yêu cầu cỡ mẫu tối thiểu là:", opts: ["N ≥ 50","N ≥ 100, lý tưởng ≥ 200","N ≥ 30 (quy tắc chuẩn hóa)","N ≥ 500 (bắt buộc)"], answer: 1, explain: "SEM: N ≥ 100 (tối thiểu), lý tưởng N ≥ 200. Celik (2023) dùng N=219 cho Stage 2 SEM." },
      { q: "Celik (2023) dùng phần mềm nào để chạy CFA và SEM?", opts: ["SPSS với ANOVA","IBM AMOS 22.0 (với maximum likelihood estimation)","R với lavaan","SmartPLS (Partial Least Squares)"], answer: 1, explain: "Celik (2023) báo cáo rõ dùng IBM AMOS 22.0 với maximum likelihood estimation cho CFA và SEM." }
    ]
  },
  {
    id: "D", title: "Nhóm D: Kiểm định t & ANCOVA trong Thực nghiệm Sư phạm",
    range: "Câu 31–40",
    questions: [
      { q: "TN: X̄₁=26.0, s₁=5.0, n₁=30; ĐC: X̄₂=22.5, s₂=4.8, n₂=30. t≈2.77 > t_crit=2.001. Kết luận:", opts: ["Không có sự khác biệt đáng kể (t < 3)","Nhóm TN cao hơn đáng kể, p < 0.05","Nhóm ĐC cao hơn đáng kể","Không kết luận vì cỡ mẫu nhỏ"], answer: 1, explain: "t=2.77 > t_crit=2.001 (df=58, α=0.05) → bác bỏ H₀ → TN cao hơn ĐC đáng kể (p < 0.05)." },
      { q: "Tại sao dùng ANCOVA thay vì t-test khi so sánh post-test giữa 2 nhóm?", opts: ["ANCOVA cho kết quả luôn có p < 0.05","ANCOVA kiểm soát ảnh hưởng của pre-test, tăng power và loại nhiễu","ANCOVA không yêu cầu phân phối chuẩn","ANCOVA chỉ dùng cho mẫu n > 200"], answer: 1, explain: "ANCOVA điều chỉnh post-test theo pre-test, loại biến thiên do chênh lệch ban đầu, tăng độ chính xác." },
      { q: "Điều kiện tiên quyết của ANCOVA là:", opts: ["Hai nhóm phải có pre-test bằng nhau hoàn toàn","Homogeneity of regression slopes: mối quan hệ covariate-DV phải như nhau ở 2 nhóm","Cỡ mẫu 2 nhóm phải bằng nhau (n₁=n₂)","Biến phụ thuộc phải là nhị phân"], answer: 1, explain: "Homogeneity of regression slopes (Group × Covariate không có tương tác) là điều kiện then chốt của ANCOVA." },
      { q: "Paired t-test khác independent t-test ở điểm nào?", opts: ["Paired t-test chỉ dùng khi n > 100","Paired t-test dùng khi cùng một đối tượng được đo 2 lần (pre-post)","Independent t-test dùng khi 2 nhóm không thể so sánh","Paired t-test không cần giả thuyết H₀"], answer: 1, explain: "Paired t-test: cùng đối tượng đo 2 lần (pre-post hoặc 2 điều kiện). Independent: 2 nhóm khác nhau." },
      { q: "8 SV: Pre=[14,17,15,20,18,13,16,19], Post=[19,22,20,25,23,18,21,24]. d̄ và sₐ là:", opts: ["d̄=5.0, sₐ=0.0 (tất cả tăng đúng 5)","d̄=4.5, sₐ=0.53","d̄=5.0, sₐ=0.74","d̄=4.875, sₐ=0 vì đều tăng 5"], answer: 0, explain: "Tất cả: dᵢ=19-14=5, 22-17=5, ..., 24-19=5. Mọi dᵢ=5 → d̄=5.0, sₐ=0.0." },
      { q: "Trong bảng ANCOVA, F_nhóm=4.85, p=0.030. Điều này có nghĩa:", opts: ["Sau khi kiểm soát pre-test, 2 nhóm không khác nhau","Sau khi kiểm soát pre-test, 2 nhóm vẫn khác nhau đáng kể","Pre-test ảnh hưởng đáng kể đến post-test","Mô hình ANCOVA không phù hợp với dữ liệu"], answer: 1, explain: "F_nhóm có p=0.030 < 0.05: sau khi đã kiểm soát pre-test, 2 nhóm vẫn khác nhau → can thiệp hiệu quả." },
      { q: "TN: pre X̄=19.4, ĐC: pre X̄=20.8. t≈−1.31, p>0.05. Kết luận:", opts: ["Hai nhóm không tương đương, không thể so sánh post-test","Hai nhóm tương đương về pre-test — điều kiện tốt cho thực nghiệm","Nhóm ĐC cao hơn đáng kể, cần hiệu chỉnh","Phải dùng ngẫu nhiên hóa lại"], answer: 1, explain: "p>0.05: không có sự khác biệt đáng kể về pre-test → 2 nhóm tương đương ban đầu → quasi-exp hợp lệ." },
      { q: "Khi nào nên dùng Mann-Whitney U thay vì independent t-test?", opts: ["Khi n > 100","Khi dữ liệu không phân phối chuẩn (Shapiro-Wilk p<0.05) hoặc thang đo ordinal","Khi muốn kết quả p nhỏ hơn","Khi 2 nhóm có cỡ mẫu khác nhau"], answer: 1, explain: "Mann-Whitney U: phi tham số, dùng khi vi phạm normality (Shapiro-Wilk p<0.05) hoặc dữ liệu thứ tự." },
      { q: "Thiết kế 'quasi-experimental' của Tan (2025) khác với RCT ở đâu?", opts: ["Quasi-experimental không có nhóm đối chứng","Quasi-experimental không phân ngẫu nhiên đối tượng vào nhóm (dùng lớp học có sẵn)","Quasi-experimental không có pre-test","Quasi-experimental không thể dùng ANCOVA"], answer: 1, explain: "Quasi-exp: dùng lớp học có sẵn, không phân ngẫu nhiên. ANCOVA kiểm soát bất tương đương ban đầu." },
      { q: "Pre-test của 2 nhóm khác nhau đáng kể (p<0.05). Phương pháp xử lý tốt nhất là:", opts: ["Bỏ qua và chỉ báo cáo post-test","Dùng ANCOVA với pre-test làm covariate để kiểm soát","Loại bỏ các SV điểm thấp ở nhóm ĐC","Hoán đổi vị trí một số SV giữa 2 nhóm"], answer: 1, explain: "ANCOVA điều chỉnh post-test theo pre-test → so sánh công bằng ngay cả khi 2 nhóm không tương đương ban đầu." }
    ]
  },
  {
    id: "E", title: "Nhóm E: Cohen's d, Normalized Gain & Mixed ANOVA",
    range: "Câu 41–50",
    questions: [
      { q: "TN: X̄₁=28.4, s₁=4.2, n₁=35; ĐC: X̄₂=24.8, s₂=5.1, n₂=32. s_pooled≈4.651. Cohen's d là:", opts: ["d = 0.574","d = 0.774","d = 0.857","d = 0.694"], answer: 1, explain: "d = (28.4−24.8)/4.651 = 3.6/4.651 = 0.774. Effect size trung bình-lớn." },
      { q: "Cohen's d=0.45 được phân loại là:", opts: ["Lớn (large)","Trung bình (medium)","Nhỏ (small)","Rất nhỏ"], answer: 2, explain: "d=0.45 nằm trong [0.20, 0.50) → nhỏ (small). Medium: 0.50–0.79; Large: ≥ 0.80." },
      { q: "Tại sao Cohen's d quan trọng hơn chỉ báo cáo p-value?", opts: ["d luôn nhỏ hơn p, dễ giải thích hơn","d cho biết mức độ thực tiễn (practical significance), p chỉ cho biết ý nghĩa thống kê","d không phụ thuộc vào phân phối, p thì có","d được tính nhanh hơn p"], answer: 1, explain: "p phụ thuộc cỡ mẫu: N lớn → p nhỏ dù d nhỏ. d đo độ lớn thực tế, không phụ thuộc N." },
      { q: "Normalized gain g của nhóm ĐC (max=35, pre=20.8, post=22.2). Kiểm tra:", opts: ["g=(22.2−20.8)/(35−20.8)=1.4/14.2=0.099, mức tăng thấp","g=(22.2−20.8)/(35−20.8)=0.099, mức tăng trung bình","g=22.2/35=0.634, mức tăng cao","g=0.18 như đề bài, mức tăng trung bình"], answer: 0, explain: "g=(22.2−20.8)/(35−20.8)=1.4/14.2=0.099. Theo Hake: g<0.30 = mức tăng thấp (low gain)." },
      { q: "Nhóm TN có g=0.365, nhóm ĐC có g=0.099. Tỉ lệ g_TN/g_ĐC cho biết:", opts: ["Nhóm TN tăng gấp 0.365/0.099≈3.7 lần nhóm ĐC tính trên điểm tiềm năng còn lại","Nhóm TN tốt hơn 26.6%","Can thiệp không hiệu quả vì g_TN < 0.50","Cả 2 nhóm đều đạt mức tăng 'trung bình'"], answer: 0, explain: "g đã điều chỉnh theo trần: TN tận dụng 36.5% điểm tiềm năng còn lại, ĐC chỉ 9.9%. Gấp ≈3.7 lần." },
      { q: "Trong Mixed ANOVA, hiệu ứng tương tác (Group×Time) có p=0.002. Nghĩa là:", opts: ["Cả 2 nhóm đều tăng điểm theo thời gian","Mức tăng theo thời gian KHÁC NHAU giữa 2 nhóm — can thiệp có hiệu quả","Nhóm TN cao hơn nhóm ĐC tại mọi thời điểm","Thời gian không ảnh hưởng đến kết quả"], answer: 1, explain: "Tương tác G×T có ý nghĩa: nhóm TN và ĐC thay đổi theo thời gian với tốc độ khác nhau → can thiệp hiệu quả." },
      { q: "η²=0.074 trong Mixed ANOVA (hiệu ứng tương tác). Phân loại theo Cohen:", opts: ["Nhỏ (η² < 0.01)","Trung bình (0.06 ≤ η² < 0.14)","Lớn (η² ≥ 0.14)","Không đáng kể (η² < 0.10)"], answer: 1, explain: "η²=0.074 nằm trong [0.06, 0.14) → trung bình (medium). Ngưỡng Cohen: 0.01 nhỏ, 0.06 trung bình, 0.14 lớn." },
      { q: "Sphericity vi phạm (Mauchly's test p<0.05) trong Mixed ANOVA. Xử lý:", opts: ["Loại bỏ thời điểm đo bị vi phạm","Áp dụng Greenhouse-Geisser hoặc Huynh-Feldt correction cho df","Chuyển sang phân tích phi tham số","Tăng cỡ mẫu lên n > 200"], answer: 1, explain: "Sphericity vi phạm: dùng correction điều chỉnh bậc tự do. GG-correction bảo thủ hơn, HF-correction tự do hơn." },
      { q: "Tan (2025): paired t-test TN, t=2.798, df=63, p=0.007. Tính d̄ nếu sₐ=4.962, n=64:", opts: ["d̄ = t × sₐ/√n = 2.798 × 4.962/8 = 1.734","d̄ = 2.798","d̄ = 4.962/64 = 0.078","d̄ = 2.798 × 0.007 = 0.020"], answer: 0, explain: "t = d̄/(sₐ/√n) → d̄ = t × sₐ/√n = 2.798 × 4.962/√64 = 2.798 × 4.962/8 = 1.734." },
      { q: "Cohen's d cho paired design (Tan 2025): d̄=1.735, sₐ=4.962. Giá trị d là:", opts: ["d = 4.962/1.735 = 2.860","d = 1.735/4.962 = 0.350 — nhỏ-trung bình","d = 1.735 × 4.962 = 8.608","d = √1.735 = 1.317"], answer: 1, explain: "d_paired = d̄/sₐ = 1.735/4.962 = 0.350. Phân loại: nhỏ-trung bình (gần ngưỡng medium 0.50)." }
    ]
  },
  {
    id: "F", title: "Nhóm F: CVR, CVI, ICC & Giá trị nội dung",
    range: "Câu 51–60",
    questions: [
      { q: "10 chuyên gia đánh giá item AI-Ethics1: 8 người cho là 'cần thiết'. CVR là:", opts: ["CVR = (8−5)/5 = 0.60","CVR = (8−10/2)/(10/2) = 3/5 = 0.60","CVR = 8/10 = 0.80","CVR = (10−8)/10 = 0.20"], answer: 1, explain: "CVR = (N_E − N/2)/(N/2) = (8−5)/5 = 0.60. Cả A và B đều đúng về kết quả; B trình bày công thức rõ hơn." },
      { q: "Với N=10 chuyên gia, CVR tối thiểu (α=0.05) theo Lawshe là:", opts: ["0.99","0.62","0.49","0.80"], answer: 1, explain: "Theo bảng Lawshe: N=10, α=0.05 → CVR_min=0.62. Eyal (2025) đạt CVR=0.86 > 0.62." },
      { q: "CVI của 4 item lần lượt: 0.80, 1.00, 0.60, 0.80 là:", opts: ["CVI = (0.80+1.00+0.60+0.80)/4 = 0.80","CVI = 0.60 (lấy giá trị nhỏ nhất)","CVI = 1.00 (lấy giá trị lớn nhất)","CVI = (0.80+1.00+0.80)/3 = 0.867 (loại item không đạt)"], answer: 0, explain: "S-CVI = trung bình I-CVI của tất cả item = (0.80+1.00+0.60+0.80)/4 = 0.80." },
      { q: "Eyal (2025) báo cáo ICC=0.84. Điều này xác nhận:", opts: ["84% item trong công cụ đánh giá là phù hợp","Hai người đánh giá độc lập đạt mức đồng thuận 'tốt' khi chấm artifacts","Mô hình CFA phù hợp với dữ liệu 84%","Công cụ có α=0.84"], answer: 1, explain: "ICC=0.84 nằm trong 0.75–0.90 → 'tốt' (good). Đây là inter-rater reliability khi 2 người chấm artifacts." },
      { q: "ICC=0.65 được phân loại là:", opts: ["Xuất sắc (> 0.90)","Tốt (0.75–0.90)","Trung bình (0.50–0.74) — cần cải thiện quy trình đánh giá","Kém (< 0.50)"], answer: 2, explain: "ICC=0.65 ∈ [0.50, 0.74) → trung bình (moderate). Cần cải thiện rubric hoặc training người đánh giá." },
      { q: "Tại sao Eyal (2025) dùng authentic artifacts thay vì self-report questionnaire?", opts: ["Questionnaire đắt hơn artifacts để thiết kế","Self-report dễ có bias (overestimation), artifacts phản ánh thực hành thực tế","Artifacts dễ phân tích thống kê hơn","Questionnaire không đo được AI-TPACK"], answer: 1, explain: "Self-report bias (overestimation) là vấn đề thực tế: giáo viên tự đánh giá cao hơn thực tế. Artifacts phản ánh năng lực thực." },
      { q: "7 chuyên gia đánh giá item. 4 người 'cần thiết', 2 người 'có ích', 1 người 'không cần'. CVR là:", opts: ["CVR = (4−3.5)/3.5 = 0.143","CVR = 4/7 = 0.571","CVR = (4+2)/7 = 0.857","CVR = −0.143"], answer: 0, explain: "CVR chỉ tính N_E = số người cho là 'cần thiết' (= 4). CVR = (4−3.5)/3.5 = 0.5/3.5 = 0.143." },
      { q: "ICC tốt nhất đạt được khi:", opts: ["Có nhiều người đánh giá (rater) cùng chấm","Rubric đánh giá rõ ràng, chi tiết và người đánh giá được training","Đối tượng đánh giá có năng lực rất đồng đều","Chỉ có 2 người đánh giá"], answer: 1, explain: "Rubric chi tiết + training người đánh giá → đồng thuận cao. Sự đa dạng đối tượng thực ra giúp ICC cao hơn." },
      { q: "Giá trị ICC được tính từ:", opts: ["EFA với Varimax rotation","Phân tích phương sai (ANOVA) hai chiều với người đánh giá và đối tượng là 2 nhân tố","Hệ số tương quan Pearson giữa 2 người đánh giá","Cronbach's Alpha của bộ rubric"], answer: 1, explain: "ICC = MS_subjects − MS_error / (MS_subjects + các thành phần khác). Tính từ 2-way ANOVA." },
      { q: "5 chuyên gia đánh giá. CVR các item: 0.60, 1.00, 0.20, 0.60, 1.00. Bao nhiêu item đạt CVR_min theo Lawshe (N=5, ngưỡng=0.99)?", opts: ["2 item (CVR=1.00)","4 item (CVR ≥ 0.60)","5 item (tất cả dương)","3 item (CVR ≥ 0.50)"], answer: 0, explain: "N=5 → CVR_min=0.99 theo Lawshe. Chỉ có 2 item với CVR=1.00 đạt ngưỡng này." }
    ]
  },
  {
    id: "G", title: "Nhóm G: Pearson r, Hồi quy & Cỡ mẫu",
    range: "Câu 61–70",
    questions: [
      { q: "r=0.37 (Hava 2025), n=401. Hệ số xác định R² là:", opts: ["R² = 0.37","R² = 0.37² = 0.137 = 13.7%","R² = √0.37 = 0.608","R² = 2×0.37 = 0.74"], answer: 1, explain: "R² = r² = 0.37² = 0.1369 ≈ 13.7%. Năng lực số giải thích 13.7% phương sai AI-TPACK." },
      { q: "Hệ số tương quan r=−0.45 giữa lo lắng về AI và điểm AI-TPACK. Nghĩa là:", opts: ["Dữ liệu có lỗi vì r âm","Lo lắng về AI càng cao thì AI-TPACK càng thấp (tương quan nghịch, trung bình)","Không có mối quan hệ giữa 2 biến","Lo lắng về AI gây ra AI-TPACK thấp (quan hệ nhân quả)"], answer: 1, explain: "r=−0.45: nghịch chiều, cường độ trung bình. Lo lắng tăng → AI-TPACK giảm. Nhưng r ≠ nhân quả." },
      { q: "Kiểm định ý nghĩa của r=0.45, n=40:", opts: ["t=0.45√(38/(1−0.2025))=0.45×6.903=3.106, p<0.05 — có ý nghĩa","t=0.45×40=18, p<0.001 — rất có ý nghĩa","t=0.45/√40=0.071, p>0.05 — không có ý nghĩa","Không thể kiểm định khi n < 50"], answer: 0, explain: "t=r√((n−2)/(1−r²))=0.45√(38/0.7975)=0.45×6.903=3.106. t_crit(df=38)≈2.024 → p<0.05." },
      { q: "Hierarchical regression: Block1 R²=0.10, Block2 R²=0.24. ΔR² là:", opts: ["ΔR² = 0.24/0.10 = 2.40","ΔR² = 0.24 − 0.10 = 0.14","ΔR² = 0.10 + 0.24 = 0.34","ΔR² = √(0.24−0.10) = 0.374"], answer: 1, explain: "ΔR² = R²_Block2 − R²_Block1 = 0.24 − 0.10 = 0.14. Biến mới giải thích thêm 14% phương sai." },
      { q: "R²_adj khác R² ở chỗ:", opts: ["R²_adj luôn lớn hơn R²","R²_adj phạt cho việc thêm biến không cần thiết, phù hợp hơn khi so sánh mô hình","R²_adj chỉ áp dụng cho CFA","R²_adj bằng 1 − R²"], answer: 1, explain: "R²_adj = 1 − (1−R²)(n−1)/(n−k−1). Luôn ≤ R². Phạt biến thừa → công bằng khi so sánh mô hình khác số biến." },
      { q: "Cỡ mẫu cho t-test với d=0.50, α=0.05, power=80%: n≈? (mỗi nhóm)", opts: ["n ≈ 32","n ≈ 64","n ≈ 128","n ≈ 100"], answer: 1, explain: "Theo bảng power: d=0.50, α=0.05 two-tailed, 80% power → n≈64 mỗi nhóm (tổng ≈128)." },
      { q: "Thang đo 39 item (Ning 2024). Cỡ mẫu tối thiểu cho CFA (quy tắc 10x) là:", opts: ["195 người (5×39)","390 người (10×39)","200 người (ngưỡng tối thiểu tuyệt đối)","100 người (đủ cho CFA)"], answer: 1, explain: "Quy tắc 10x: 10×39=390 người. Quy tắc 5x: 5×39=195. Dùng 10x cho CFA để đảm bảo hội tụ." },
      { q: "Pearson r chỉ đo được mối quan hệ dạng nào?", opts: ["Phi tuyến (U-shape, J-shape)","Tuyến tính (linear)","Nhân quả (causal)","Cả tuyến tính và phi tuyến"], answer: 1, explain: "Pearson r đo mối quan hệ tuyến tính. Dữ liệu có quan hệ phi tuyến → r gần 0 dù thực ra có quan hệ." },
      { q: "β=0.39 trong hồi quy (năng lực số dự báo AI-TPACK, Hava 2025). Nghĩa là:", opts: ["Khi năng lực số tăng 1 SD, AI-TPACK tăng 0.39 SD (sau khi chuẩn hóa)","39% phương sai AI-TPACK được giải thích","Năng lực số gây ra AI-TPACK tăng 0.39 đơn vị","β=r trong trường hợp hồi quy đơn biến"], answer: 0, explain: "β chuẩn hóa: tăng 1 SD dự báo tăng 0.39 SD. Trong hồi quy đơn biến, β chuẩn hóa = r (D là đúng nhưng A đúng hơn)." },
      { q: "Tính n với d=0.70, α=0.05 two-tailed, power=80%: z_α/2=1.96, z_β=0.84:", opts: ["n=2(1.96+0.84)²×25/(0.70×5)²=2×7.84×25/12.25=32.0 → n≈33","n=64","n=100","n=2(1.96+0.84)²×25/(3.5)²=32.0≈33"], answer: 0, explain: "n = 2(z_α/2+z_β)²/d² = 2(2.80)²/(0.70)² = 2×7.84/0.49 = 32.0 → n≈33/nhóm (A và D đều đúng, chọn A)." }
    ]
  },
  {
    id: "H", title: "Nhóm H: Tổng hợp AI-TPACK, PRISMA & Bối cảnh Nghiên cứu",
    range: "Câu 71–80",
    questions: [
      { q: "Theo Ning et al. (2024), thành phần nào có hệ số đường dẫn mạnh nhất đến AI-TPACK?", opts: ["CK (Content Knowledge), β=0.052","PCK (Pedagogical Content Knowledge), β=−0.008","AI-TPK (AI Technological Pedagogical Knowledge), β=0.870","AI-TK (AI Technological Knowledge), β=0.654"], answer: 2, explain: "AI-TPK → AI-TPACK: β=0.870 là mạnh nhất, vượt trội so với mọi thành phần khác trong mô hình 7 thành phần." },
      { q: "'Metacognitive recalibration' trong Tan (2025) giải thích:", opts: ["Một số giáo viên suy giảm AI-TPACK sau can thiệp vì học quá nhiều","Điểm âm sau can thiệp là dấu hiệu tích cực: GV chuyển từ 'không biết mình không biết' sang 'biết mình không biết'","Chương trình PD có lỗi thiết kế làm giảm năng lực","Nhóm ĐC học tốt hơn nhóm TN"], answer: 1, explain: "Dunning-Kruger: GV kém năng lực ban đầu tự đánh giá cao. Sau can thiệp họ nhận ra giới hạn → điểm tự đánh giá giảm dù năng lực thực tăng." },
      { q: "Khoảng cách M=4.93/7 (năng lực số) vs M=3.33/7 (AI-TPACK) trong Hava (2025) cho thấy:", opts: ["Năng lực số và AI-TPACK đều ở mức tốt","Kỹ năng ICT chung không tự động chuyển hóa thành AI-TPACK — cần đào tạo chuyên biệt","AI-TPACK cao hơn năng lực số vì phức tạp hơn","Dữ liệu có lỗi vì 2 điểm số khác nhau"], answer: 1, explain: "GV giỏi ICT (4.93/7) nhưng AI-TPACK chỉ 3.33/7: bằng chứng cần đào tạo AI-TPACK riêng, không tự chuyển hóa." },
      { q: "Tỉ lệ yield rate trong PRISMA (Eyal 2025): 25/505=4.95%. Điều này:", opts: ["Bất thường — phải giữ ít nhất 50% bài tìm được","Điển hình cho SLR chuyên sâu — chỉ 5–15% qua được tất cả tiêu chí","Quá ít — cần tìm kiếm lại trên nhiều CSDL hơn","Cho thấy tiêu chí loại trừ quá chặt"], answer: 1, explain: "Yield rate 5–15% là bình thường cho SLR nghiêm túc. Các tiêu chí loại trừ chặt chẽ đảm bảo chất lượng bài được chọn." },
      { q: "Mô hình AIA-PCEK (Mimoudi 2025) khác các mô hình AI-TPACK khác ở điểm nào?", opts: ["AIA-PCEK có nhiều thành phần hơn (7 vs 5)","AIA-PCEK tái khái niệm AI là 'pedagogical agent' bán tự trị, không phải công cụ","AIA-PCEK loại bỏ hoàn toàn thành phần kỹ thuật","AIA-PCEK chỉ áp dụng cho Morocco"], answer: 1, explain: "Điểm khác biệt cốt lõi: AI không chỉ là công cụ thụ động mà là tác nhân sư phạm có agency — thay đổi toàn bộ cách tiếp cận." },
      { q: "Phát hiện 'AIPK ↔ Integration: r=0.78' (Eyal 2025) có hàm ý gì?", opts: ["Sư phạm AI (AIPK) là động lực trung tâm của tích hợp AI toàn diện","AI Knowledge quan trọng hơn AI Pedagogy","Integration không cần thiết nếu có AIPK","Hai thành phần này có thể gộp thành một"], answer: 0, explain: "r=0.78 rất cao: GV có AI Pedagogy tốt thì khả năng Integration cũng cao. AIPK là trọng tâm phát triển năng lực." },
      { q: "Khoảng trống nghiên cứu mà luận văn HNUE lấp đầy là:", opts: ["Đề xuất thêm thành phần cho mô hình Celik (2023)","Bối cảnh Việt Nam, dạy lập trình đặc thù CS, và chiều Security (bảo mật mã AI)","Tăng cỡ mẫu nghiên cứu Ning (2024) lên N > 1000","Dịch thang đo sang tiếng Anh"], answer: 1, explain: "3 khoảng trống: (1) Việt Nam/SEA, (2) CS education đặc thù, (3) Security dimension trong AI-TPACK. Không bài nào có đủ cả 3." },
      { q: "Thiết kế thực nghiệm tốt nhất để kiểm định mô hình AI-TPACK-SE tại HNUE là:", opts: ["Chỉ khảo sát SV sau khi học (post-test only, no control)","Quasi-experimental pre-post test với nhóm đối chứng, ANCOVA kiểm soát pre-test","RCT ngẫu nhiên hóa từng sinh viên vào 2 nhóm","Nghiên cứu tình huống (case study) với 3 SV tiêu biểu"], answer: 1, explain: "Quasi-exp + ANCOVA: thực tế nhất với lớp học có sẵn, kiểm soát được bất tương đương ban đầu, phân tích nghiêm ngặt." },
      { q: "Chuỗi Boolean đúng cho tìm kiếm trên Scopus về 'AI-TPACK trong dạy lập trình' là:", opts: ["'artificial intelligence' AND 'teaching'","('AI-TPACK' OR 'Intelligent-TPACK') AND ('programming education' OR 'CS education') AND ('framework' OR 'model')","'TPACK' OR 'programming' OR 'AI'","'ChatGPT' AND 'coding' AND 'Vietnam'"], answer: 1, explain: "Boolean tốt: thu hẹp theo thuật ngữ chuyên biệt (AI-TPACK/Intelligent-TPACK), ngữ cảnh (CS education), và loại bài (framework/model)." },
      { q: "Thứ tự logic của nghiên cứu theo mô hình AI-TPACK-SE tại HNUE là:", opts: ["Thực nghiệm → Xây thang đo → Tổng quan tài liệu → Phân tích → Kết luận","Tổng quan tài liệu (PRISMA) → Xây thang đo (α, CVR, EFA, CFA) → Thực nghiệm (quasi-exp, ANCOVA, Cohen's d) → Kết luận","CFA → SEM → PRISMA → t-test → Kết luận","Khảo sát SV → Pilot → CFA → Báo cáo"], answer: 1, explain: "Thứ tự chuẩn: LR (lý thuyết) → Xây thang đo (pilot+EFA+CFA) → Thực nghiệm → Phân tích → Kết luận." }
    ]
  }
];
