// ─── THÊM 4 NHÓM MCQ (I, J, K, L) — 40 câu ─────────────────────────────────
const QUIZ_GROUPS_EXT = [
  {
    id: "I", title: "Nhóm I: LLMs trong Dạy học Lập trình (ChatGPT, Copilot)",
    range: "Câu 81–90",
    questions: [
      {
        q: "Kazemitabaar et al. (2023) nghiên cứu điều gì về ChatGPT và lập trình CS1?",
        opts: ["ChatGPT có thể thay thế giáo viên dạy lập trình hoàn toàn","Sinh viên dùng ChatGPT để viết code mà không hiểu → suy giảm kỹ năng lập trình","ChatGPT giúp tăng điểm kiểm tra cuối kỳ trung bình 15%","ChatGPT không có tác dụng với người học lập trình"],
        answer: 1, explain: "Kazemitabaar (2023) phát hiện hiện tượng 'over-reliance': SV dùng ChatGPT viết code nhưng không hiểu → fail khi không có AI. Gọi là 'AI-assisted over-reliance'."
      },
      {
        q: "GitHub Copilot khác ChatGPT trong ngữ cảnh lập trình ở điểm nào?",
        opts: ["Copilot chỉ dùng cho Python, ChatGPT dùng cho mọi ngôn ngữ","Copilot tích hợp trực tiếp vào IDE (VS Code), đề xuất code theo context hiện tại; ChatGPT là chatbot độc lập","Copilot miễn phí hoàn toàn, ChatGPT tính phí","Copilot không hiểu được ngữ nghĩa code, chỉ autocomplete"],
        answer: 1, explain: "Copilot hoạt động như 'AI pair programmer' trong IDE, hiểu context codebase hiện tại. ChatGPT là conversational AI riêng biệt. Cả 2 đều dựa trên Codex/GPT."
      },
      {
        q: "Han et al. (2024) SLR về LLMs trong lập trình kết luận thách thức lớn nhất là:",
        opts: ["LLMs tạo code không biên dịch được (syntax error)","LLMs tạo code chạy đúng nhưng có logic lỗi tinh vi (plausible-but-wrong) khó phát hiện","LLMs quá chậm để dùng trong lớp học","LLMs chỉ hiệu quả với Python không phải C++"],
        answer: 1, explain: "Han (2024) nhấn mạnh 'plausible-but-wrong' code là nguy hiểm nhất: code pass syntax nhưng logic sai → SV copy mà không kiểm tra → bug khó debug."
      },
      {
        q: "Mô hình SP-TeachLLM (2025) gồm bao nhiêu module và module nào là trung tâm?",
        opts: ["3 module: Input → Process → Output","5 module: Context-Aware Prompting, Adaptive Scaffolding, Code Assessment, Ethics Checker, Student Model","7 module theo mô hình TPACK","4 module: Plan → Code → Test → Review"],
        answer: 1, explain: "SP-TeachLLM có 5 module. Trung tâm là Adaptive Scaffolding: cung cấp gợi ý (hints) thay vì giải thẳng, buộc SV tư duy độc lập."
      },
      {
        q: "Trong lớp lập trình với AI, 'productive struggle zone' có nghĩa là:",
        opts: ["Vùng khó quá, SV bỏ cuộc — cần can thiệp ngay","Vùng vừa đủ khó để SV học hiệu quả nhất — AI hỗ trợ đúng lúc đúng mức","Vùng dễ — AI làm hết, SV quan sát","Vùng không cần AI — SV tự làm hoàn toàn"],
        answer: 1, explain: "Productive struggle = zone of proximal development (Vygotsky): đủ thách thức để học nhưng không overwhelm. AI nên scaffold (đỡ) vừa đủ, không làm thay."
      },
      {
        q: "Khi SV dùng AI để viết code, đánh giá năng lực chính xác nhất là:",
        opts: ["Kiểm tra bài tập về nhà (take-home assignments)","Kiểm tra trong lớp không có AI + yêu cầu giải thích code miệng","Chấm điểm dự án GitHub có AI","Chỉ dùng multiple choice test"],
        answer: 1, explain: "Open-book + AI assignments không phân biệt được SV thực sự hiểu hay chỉ copy AI. Kiểm tra trực tiếp + viva (giải thích miệng) là gold standard."
      },
      {
        q: "Prompting kỹ năng nào quan trọng nhất cho SV lập trình khi dùng LLMs?",
        opts: ["Viết prompt dài nhất có thể để AI hiểu rõ","Decomposition: chia vấn đề phức tạp thành subproblem → prompt từng phần → assemble","Luôn hỏi bằng tiếng Anh để AI hiệu quả hơn","Dùng các template prompt cố định"],
        answer: 1, explain: "Decomposition (phân rã bài toán) là kỹ năng lập trình cốt lõi, và cũng là kỹ năng prompting tốt nhất. SV biết chia nhỏ vấn đề → prompt hiệu quả hơn."
      },
      {
        q: "LLM-generated code thường mắc lỗi bảo mật nào phổ biến nhất?",
        opts: ["Syntax errors (lỗi cú pháp)","SQL Injection, buffer overflow, hardcoded credentials — LLM học từ code công khai có lỗ hổng","Performance bottlenecks (code chậm)","Thiếu comment và documentation"],
        answer: 1, explain: "GitHub nghiên cứu (2023): 40% Copilot-generated code có lỗ hổng bảo mật. LLM học từ public code — bao gồm code có lỗi. Security review bắt buộc."
      },
      {
        q: "Lý do nào khiến giáo viên lập trình CẦN AI-TCK (AI Tool Content Knowledge)?",
        opts: ["Để tự viết được code AI","Để biết LLM nào phù hợp với bài toán nào trong lập trình, và giới hạn của từng tool","Để vượt qua kỳ thi chứng chỉ AI","Để giảm thời gian chuẩn bị bài dạy"],
        answer: 1, explain: "AI-TCK: biết khi nào dùng Copilot (IDE), khi nào dùng ChatGPT (concept), khi nào dùng Code Interpreter (data analysis), khi nào không dùng AI — và giới hạn mỗi tool trong ngữ cảnh CS."
      },
      {
        q: "ChatGPT-4o trong lớp học lập trình có thể KHÔNG phù hợp khi:",
        opts: ["Môn học yêu cầu SV phát triển algorithmic thinking từ đầu (CS1 introductory)","Môn học về web development nâng cao","Lớp học có nhiều SV với năng lực khác nhau","Giáo viên chưa từng lập trình"],
        answer: 0, explain: "CS1 introductory: mục tiêu là SV học tư duy thuật toán từ đầu. Dùng ChatGPT viết code bypass hoàn toàn quá trình học tư duy. Phản tác dụng."
      }
    ]
  },
  {
    id: "J", title: "Nhóm J: AI Ethics, Security & Chính sách Giáo dục",
    range: "Câu 91–100",
    questions: [
      {
        q: "Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân Việt Nam áp dụng cho AI trong giáo dục như thế nào?",
        opts: ["Chỉ áp dụng cho tổ chức nước ngoài, không áp dụng cho HNUE","Dữ liệu học sinh (điểm, hành vi học tập, sinh trắc học) là dữ liệu nhạy cảm — phải có consent, cơ chế xóa, không dùng cho mục đích khác","Dữ liệu giáo dục không thuộc phạm vi điều chỉnh","Chỉ áp dụng khi thu thập hơn 1000 bản ghi"],
        answer: 1, explain: "NĐ 13/2023: dữ liệu cá nhân SV (tên, điểm, hành vi, sinh trắc) cần consent rõ ràng, mục đích cụ thể, quyền xóa, không chuyển giao trái phép. Vi phạm: phạt 5–80 triệu VND."
      },
      {
        q: "Academic integrity khi dùng AI bị vi phạm khi nào?",
        opts: ["SV dùng AI để hiểu khái niệm khó","SV nộp AI-generated text/code như là sản phẩm của bản thân mà không khai báo","SV dùng Grammarly để sửa ngữ pháp","Giáo viên dùng ChatGPT soạn câu hỏi kiểm tra"],
        answer: 1, explain: "AI plagiarism: khai báo AI-generated content là của mình = vi phạm academic integrity. Hầu hết trường ĐH VN đang xây dựng chính sách. HNUE cần có guideline rõ."
      },
      {
        q: "Bias trong AI dạy học lập trình thể hiện qua:",
        opts: ["AI luôn cho điểm cao hơn điểm thực","AI thiên vị ngôn ngữ lập trình phổ biến (Python/JS), ít hiệu quả với Scratch, Pascal — bất lợi cho SV học ngôn ngữ ít phổ biến","AI không thể đánh giá code tiếng Việt","AI chỉ chấp nhận 1 phong cách code duy nhất"],
        answer: 1, explain: "Training data bias: LLMs học từ GitHub (chủ yếu Python/JS/Java). Code Scratch, Pascal, LOGO ít data → gợi ý kém hơn. SV Việt Nam học Pascal/Scratch bị bất lợi."
      },
      {
        q: "Nguyên tắc 'explainability' (giải thích được) trong AI giáo dục nghĩa là:",
        opts: ["AI phải giải thích bài tập cho học sinh","Quyết định của AI (điểm số, gợi ý, phân nhóm) phải được diễn giải ra logic để GV/SV hiểu và kiểm tra","AI phải dùng ngôn ngữ đơn giản","AI không được dùng mô hình phức tạp"],
        answer: 1, explain: "XAI (Explainable AI) trong giáo dục: GV cần hiểu TẠI SAO AI đề xuất nội dung X cho SV Y → mới can thiệp pedagogically. Black-box AI không phù hợp cho education."
      },
      {
        q: "Mimoudi (2025) đề xuất 4 điểm kiểm soát Ethics trong AI dạy học. Điểm nào xảy ra TRƯỚC khi triển khai?",
        opts: ["Monitoring (giám sát trong quá trình dùng)","Pre-deployment Ethics Review: đánh giá bias, consent, data governance TRƯỚC khi deploy","Post-use Evaluation (sau khi dùng)","Student Feedback Collection (thu phản hồi SV)"],
        answer: 1, explain: "Mimoudi nhấn mạnh 'Ethics by Design' — tích hợp từ lúc thiết kế, không phải 'gắn vào sau'. Điểm 1 (Pre-deployment) là quan trọng nhất."
      },
      {
        q: "Dữ liệu nào của học sinh được coi là nhạy cảm NHẤT theo quan điểm bảo mật?",
        opts: ["Tên đầy đủ và email trường","Điểm số + Hành vi học tập + Gương mặt (facial recognition) kết hợp với nhau","Số lượng lần đăng nhập LMS","Ngôn ngữ lập trình yêu thích"],
        answer: 1, explain: "Kết hợp PII (Personally Identifiable Information) + performance data + biometric = profiling cực kỳ nhạy cảm. Đây là dạng 'sensitive data combination' trong GDPR/NĐ 13."
      },
      {
        q: "Trong mô hình AI-TPACK-SE, 'S' (Security) bổ sung cho Ethics điều gì?",
        opts: ["Security là phần con của Ethics, không cần tách riêng","Ethics tập trung vào giá trị/công bằng; Security tập trung vào bảo vệ kỹ thuật (mã hóa, xác thực, lỗ hổng code AI)","Security chỉ dành cho GV bộ môn An toàn thông tin","Security = chống copy đáp án trong kỳ thi"],
        answer: 1, explain: "Ethics ≠ Security: Ethics = làm gì là đúng; Security = bảo vệ về mặt kỹ thuật. GV Tin học cần biết cả 2: không chỉ 'nên hay không' mà còn 'bảo vệ như thế nào'."
      },
      {
        q: "FERPA (Mỹ) và GDPR (EU) đều nhằm bảo vệ điều gì trong giáo dục?",
        opts: ["Quyền sở hữu trí tuệ của giáo viên","Quyền riêng tư của học sinh đối với hồ sơ giáo dục của mình","Tiêu chuẩn chất lượng giảng dạy","Phần mềm giáo dục được cấp phép hợp lệ"],
        answer: 1, explain: "FERPA (Mỹ, 1974): quyền SV kiểm soát hồ sơ học tập. GDPR (EU, 2018): right to be forgotten, consent, data minimization. NĐ 13/2023 VN tương đương GDPR."
      },
      {
        q: "Khi AI phát hiện SV có 'risk of dropout' sớm, hành động ethical nhất là:",
        opts: ["Tự động giảm điểm SV để 'kích thích' học","Thông báo cho GV → GV chủ động hỗ trợ; KHÔNG tự động hành động mà không có con người trong loop","Gửi cảnh báo tự động cho phụ huynh qua SMS","Chặn SV truy cập tài nguyên học tập"],
        answer: 1, explain: "'Human-in-the-loop': AI dự báo, GV quyết định hành động. Mọi quyết định ảnh hưởng trực tiếp đến SV phải qua con người — AI chỉ cung cấp thông tin, không ra quyết định."
      },
      {
        q: "Vấn đề 'hallucination' của LLMs nguy hiểm nhất trong bối cảnh dạy lập trình vì:",
        opts: ["LLM tạo code có syntax đẹp nhưng không chạy","LLM tự tin tạo code sai logic / giải thích sai khái niệm — SV tin tưởng không kiểm tra → học sai nền tảng","LLM mất kết nối khi nhiều người dùng","LLM không hiểu các ngôn ngữ lập trình cũ"],
        answer: 1, explain: "Hallucination trong CS: LLM giải thích 'quicksort có O(n) average' với sự tự tin cao → SV học sai. Critical thinking + cross-check với tài liệu chính thống là kỹ năng thiết yếu."
      }
    ]
  },
  {
    id: "K", title: "Nhóm K: Bối cảnh Việt Nam — HNUE, Sư phạm Tin học",
    range: "Câu 101–110",
    questions: [
      {
        q: "Thách thức đặc thù lớn nhất khi triển khai AI-TPACK tại Việt Nam so với quốc tế là:",
        opts: ["Sinh viên VN kém hơn SV quốc tế về IT","Digital divide (khoảng cách số): GV vùng nông thôn thiếu thiết bị + kết nối + training — khác với nghiên cứu quốc tế thường ở ĐH lớn thành phố","AI không hỗ trợ tiếng Việt","VN chưa có đại học dạy lập trình"],
        answer: 1, explain: "Hầu hết nghiên cứu AI-TPACK ở Mỹ/EU/China: môi trường ĐH lớn, infrastructure tốt. VN có khoảng cách lớn giữa TP.HCM/HN và tỉnh → kết quả không transfer trực tiếp."
      },
      {
        q: "HNUE (Trường ĐHSP Hà Nội) có vai trò đặc biệt gì trong hệ thống GD Việt Nam?",
        opts: ["Trường kỹ thuật đào tạo kỹ sư phần mềm","Trường sư phạm trọng điểm quốc gia — đào tạo GV cho toàn bộ hệ thống GD phổ thông Việt Nam","Trường chuyên về AI và Data Science","Trường đại học kinh doanh"],
        answer: 1, explain: "HNUE đào tạo GV tương lai → nghiên cứu AI-TPACK tại HNUE có tác động nhân rộng: 1 GV sư phạm ảnh hưởng đến hàng trăm GV phổ thông tương lai."
      },
      {
        q: "Chương trình GDPT 2018 môn Tin học tại VN yêu cầu điều gì liên quan đến AI?",
        opts: ["Học sinh phải học TensorFlow và PyTorch","Tích hợp tư duy máy tính (computational thinking) và AI literacy từ lớp 3; đưa AI/Machine Learning vào lớp 10–12","Tất cả SV phải học lập trình Python từ lớp 1","Loại bỏ hoàn toàn dạy lập trình thủ công"],
        answer: 1, explain: "GDPT 2018 (Bộ GD&ĐT): Tin học chia 2 mạch — ICT và CS (Computer Science). CS mới bao gồm computational thinking, tư duy lập trình, AI/data literacy từ THCS."
      },
      {
        q: "Lý do chọn thiết kế quasi-experimental (không ngẫu nhiên hóa) tại HNUE là:",
        opts: ["HNUE không có đủ sinh viên để ngẫu nhiên hóa","Phân chia lớp học tại VN theo danh sách hành chính — không thể ngẫu nhiên hóa từng SV; phải dùng lớp có sẵn","Ngẫu nhiên hóa là vi phạm đạo đức nghiên cứu","Quasi-experimental luôn tốt hơn RCT"],
        answer: 1, explain: "Tại VN: lớp học được phân theo khoa/năm/chuyên ngành — không thể xáo trộn. Quasi-exp (2 lớp nguyên vẹn) + ANCOVA là thiết kế phù hợp và phổ biến trong nghiên cứu sư phạm VN."
      },
      {
        q: "Phan & Gam (2026) — bài báo VN duy nhất trong corpus — có hạn chế nào so với các bài quốc tế?",
        opts: ["Không dùng tiếng Anh","Mô tả thuần túy (descriptive), thiếu can thiệp thực nghiệm và kiểm định thang đo tiêu chuẩn","Mẫu quá lớn, n > 1000","Chỉ nghiên cứu môn Toán, không phải Tin học"],
        answer: 1, explain: "Phan & Gam (2026): khảo sát nhận thức GV về AI, không có pre-post design, không CFA/SEM. Đây chính là khoảng trống mà KLTN này lấp đầy."
      },
      {
        q: "Thang đo Celik (2023) cần điều chỉnh nào khi dịch sang tiếng Việt và dùng tại HNUE?",
        opts: ["Không cần điều chỉnh gì — dịch thẳng là dùng được","Translation → Back-translation → Expert review (CVI) → Pilot (n≥30) → EFA → CFA với mẫu VN","Chỉ cần Google Translate và dùng ngay","Chỉ cần xin phép tác giả gốc"],
        answer: 1, explain: "Quy trình adaptation thang đo chuẩn: dịch → dịch ngược → chuyên gia → pilot → EFA → CFA trên mẫu mới. Bỏ qua bước nào → tính giá trị thang đo không đảm bảo."
      },
      {
        q: "Kết quả KLTN tại HNUE sẽ có đóng góp gì cụ thể nhất cho cộng đồng nghiên cứu VN?",
        opts: ["Chứng minh AI tốt hơn GV truyền thống","Bộ công cụ đo lường AI-TPACK-SE bằng tiếng Việt, đã được validate tại VN — lần đầu tiên","Tạo phần mềm AI dạy lập trình mới","Đào tạo lại 100% GV Tin học VN"],
        answer: 1, explain: "Đóng góp cụ thể: (1) thang đo AI-TPACK-SE tiếng Việt validated, (2) mô hình can thiệp PD cho HNUE, (3) bằng chứng thực nghiệm đầu tiên trong bối cảnh VN."
      },
      {
        q: "Khi triển khai AI trong dạy lập trình tại HNUE, rào cản về cơ sở hạ tầng cần khảo sát trước là:",
        opts: ["Màu sắc phòng học","Băng thông internet, số máy tính/người, chính sách dùng ChatGPT trong mạng trường, quyền truy cập GitHub","Chiều cao bàn ghế","Số tầng của tòa nhà"],
        answer: 1, explain: "Infrastructure audit: nhiều trường VN chặn ChatGPT/GitHub trên firewall trường. Cần kiểm tra trước khi thiết kế can thiệp — ảnh hưởng đến tính khả thi (feasibility)."
      },
      {
        q: "Học phần phù hợp nhất để thực nghiệm AI-TPACK-SE tại Khoa CNTT, HNUE là:",
        opts: ["Giải tích (Calculus)","Lập trình hướng đối tượng (OOP) hoặc Cấu trúc dữ liệu & Giải thuật — có bài tập coding, kiểm tra thực hành","Quản lý giáo dục","Tâm lý học đại cương"],
        answer: 1, explain: "OOP/CTDL: có pre-post test coding rõ ràng, bài tập có thể dùng AI tools, cỡ mẫu lớp phù hợp (30–50 SV/lớp). Phù hợp nhất với thiết kế quasi-exp."
      },
      {
        q: "Điểm mạnh nào của KLTN HNUE so với Tan (2025) — nghiên cứu chuẩn gần nhất?",
        opts: ["Cỡ mẫu lớn hơn Tan (N=125)","Tích hợp Security dimension (chưa ai có) + bối cảnh VN đặc thù + thang đo tiếng Việt — 3 điểm mới cùng lúc","Dùng phương pháp thống kê phức tạp hơn","Dùng AI tiên tiến hơn ChatGPT-4"],
        answer: 1, explain: "Novelty so với Tan (2025): (1) Security dimension mới, (2) Việt Nam/Đông Nam Á (Tan dùng Malaysia), (3) thang đo VN validated. Ba novelty đồng thời = đóng góp rõ ràng."
      }
    ]
  },
  {
    id: "L", title: "Nhóm L: Thiết kế Nghiên cứu Tổng hợp & Câu hỏi Khó",
    range: "Câu 111–120",
    questions: [
      {
        q: "Một nghiên cứu dùng CFA và báo cáo CFI=0.88, TLI=0.86, RMSEA=0.072. Quyết định:",
        opts: ["Chấp nhận mô hình — tất cả gần ngưỡng","Không chấp nhận — CFI và TLI chưa đạt 0.90, cần modification indices để cải thiện","Chấp nhận vì RMSEA < 0.08","Từ chối và thiết kế lại toàn bộ"],
        answer: 1, explain: "CFI=0.88 < 0.90 và TLI=0.86 < 0.90: chưa đạt. Xem modification indices (Lagrange multipliers) → thêm cross-loadings hoặc error covariances lý thuyết justified."
      },
      {
        q: "Nghiên cứu A: n=200, r=0.25, p=0.001. Nghiên cứu B: n=30, r=0.45, p=0.01. Kết luận:",
        opts: ["Nghiên cứu A tốt hơn vì p nhỏ hơn và mẫu lớn hơn","Nghiên cứu B tìm thấy quan hệ thực tiễn mạnh hơn (r=0.45 vs 0.25), dù p của A nhỏ hơn vì n lớn hơn","Hai nghiên cứu cho kết quả mâu thuẫn, không thể so sánh","Chỉ A mới đáng tin cậy vì n > 100"],
        answer: 1, explain: "r=0.45 > r=0.25: B tìm quan hệ mạnh hơn. A's p nhỏ hơn chỉ vì n lớn hơn (p phụ thuộc n). Effect size (r) là thước đo thực tiễn — B có giá trị thực tiễn lớn hơn."
      },
      {
        q: "Trong thực nghiệm sư phạm, 'treatment fidelity' (trung thành can thiệp) quan trọng vì:",
        opts: ["Đảm bảo GV dạy đúng số tiết quy định","Đảm bảo can thiệp được thực hiện đúng như thiết kế — nếu không, không biết thất bại do thiết kế hay do thực hiện","Đảm bảo SV hiểu đề bài","Đảm bảo điểm số công bằng"],
        answer: 1, explain: "Treatment fidelity = intervention validity. Thiếu nó: nếu TN không hiệu quả, không rõ 'thiết kế sai' hay 'GV không thực hiện đúng'. Đo bằng observation checklist."
      },
      {
        q: "Meta-analysis khác systematic review ở điểm nào?",
        opts: ["Meta-analysis chỉ dùng cho khoa học tự nhiên, SR dùng cho KHXH","Meta-analysis tổng hợp định lượng (tính effect size tổng hợp từ nhiều nghiên cứu); SR có thể thuần túy định tính","SR dùng ít bài hơn meta-analysis","Meta-analysis không cần PRISMA"],
        answer: 1, explain: "SR = tổng hợp có hệ thống (có thể định tính). Meta-analysis = SR + phân tích thống kê tổng hợp (pooled effect size, forest plot, funnel plot). Meta-analysis ⊂ SR."
      },
      {
        q: "Publication bias trong SLR về AI-TPACK có nghĩa là:",
        opts: ["Tạp chí không cho phép đăng về AI","Nghiên cứu kết quả tiêu cực (AI không hiệu quả) ít được đăng → corpus SLR nghiêng về kết quả tích cực → overestimate hiệu quả AI","Quá nhiều bài đăng cùng lúc","Bài báo VN không được tạp chí quốc tế chấp nhận"],
        answer: 1, explain: "Publication bias (file drawer problem): AI-TPACK hiệu quả → dễ đăng; không hiệu quả → không đăng. Funnel plot bất đối xứng là bằng chứng. Dùng Trim-and-fill correction."
      },
      {
        q: "Convergent validity trong CFA được kiểm tra bằng:",
        opts: ["Cronbach's Alpha > 0.70","AVE (Average Variance Extracted) ≥ 0.50 VÀ Composite Reliability (CR) ≥ 0.70","Factor loading > 0.30","χ²/df < 3"],
        answer: 1, explain: "Fornell & Larcker (1981): convergent validity = AVE ≥ 0.50 (mỗi nhân tố giải thích > 50% phương sai item) và CR ≥ 0.70 (như Cronbach's α nhưng tính từ factor loading)."
      },
      {
        q: "Discriminant validity trong SEM được kiểm tra bằng:",
        opts: ["Tất cả factor loading đều cao","√AVE của mỗi nhân tố > tương quan của nhân tố đó với nhân tố khác (Fornell-Larcker criterion)","p-value của tất cả đường dẫn < 0.05","ICC > 0.75"],
        answer: 1, explain: "Discriminant validity: các nhân tố đo khái niệm KHÁC NHAU. √AVE(nhân tố A) > r(A,B) nghĩa là A giải thích item của mình nhiều hơn là share với B."
      },
      {
        q: "Khi cỡ mẫu nhóm TN và ĐC khác nhau nhiều (n₁=45, n₂=20), phương pháp nào phù hợp?",
        opts: ["Loại bỏ ngẫu nhiên 25 người từ nhóm lớn để cân bằng","Dùng Welch's t-test (không giả định phương sai bằng nhau, không yêu cầu n₁=n₂), hoặc ANCOVA với covariate","Từ chối phân tích vì mẫu không cân bằng","Tăng n₂ bằng cách thêm dữ liệu giả"],
        answer: 1, explain: "Welch's t-test không yêu cầu n₁=n₂ hay phương sai bằng nhau. ANCOVA cũng ổn với unequal n. Không bao giờ loại dữ liệu thật hay tạo dữ liệu giả."
      },
      {
        q: "Một đề tài KLTN sau thực nghiệm có: t(58)=2.1, p=0.04, d=0.15. Kết luận đúng nhất:",
        opts: ["Kết quả xuất sắc — p<0.05 và có sự khác biệt đáng kể","Có ý nghĩa thống kê nhưng cỡ hiệu ứng rất nhỏ (d=0.15 < 0.20) — giá trị thực tiễn thấp, cần thảo luận","Can thiệp hoàn toàn thất bại","Phải chạy lại với n lớn hơn"],
        answer: 1, explain: "p<0.05 ✓ nhưng d=0.15 < 0.20 (small). Với N lớn, ngay cả khác biệt rất nhỏ cũng p<0.05. Thảo luận cả 2: 'Có ý nghĩa thống kê nhưng cỡ hiệu ứng nhỏ — cần can thiệp mạnh hơn.'"
      },
      {
        q: "Sequencing đúng khi viết phần Methodology (Phương pháp NC) của luận văn là:",
        opts: ["Kết quả → Phương pháp → Giả thuyết","Giả thuyết (từ RQ) → Thiết kế NC → Mẫu/Sampling → Công cụ đo lường → Thu thập dữ liệu → Phân tích → Đảm bảo độ giá trị","Phân tích → Công cụ → Mẫu → Thiết kế","Mẫu → Giả thuyết → Công cụ → Thiết kế"],
        answer: 1, explain: "Logic chuẩn: RQ → hypotheses → research design (quasi-exp) → sampling (purposive, N=?) → instruments (Celik 27 items) → data collection (pre/post Likert) → analysis (ANCOVA, Cohen's d) → validity threats."
      }
    ]
  }
];

// Merge into QUIZ_GROUPS (nếu đã load data.js trước)
if (typeof QUIZ_GROUPS !== 'undefined') {
  QUIZ_GROUPS_EXT.forEach(g => QUIZ_GROUPS.push(g));
}

// ─── TOP 20 RESEARCH GROUPS ──────────────────────────────────────────────────
const RESEARCH_GROUPS = [
  {
    rank: 1,
    name: "TPACK Research Group — Michigan State University (MSU)",
    country: "🇺🇸 Mỹ",
    key_people: "Punya Mishra, Matthew J. Koehler",
    focus: "TPACK framework gốc (2006), AI-TPACK extension, teacher knowledge",
    key_papers: ["Mishra & Koehler (2006) — TPACK original", "Koehler et al. (2013) — TPACK handbook"],
    impact: "TPACK được cite >20,000 lần — framework nền của toàn bộ nghiên cứu này",
    url: "https://mkoehler.educ.msu.edu/tpack/"
  },
  {
    rank: 2,
    name: "AI-TPACK Lab — Koç University / Sivas Cumhuriyet University (Turkey)",
    country: "🇹🇷 Thổ Nhĩ Kỳ",
    key_people: "Özcan Celik, Havva Yaman (Hava)",
    focus: "Intelligent-TPACK scale development, AI digital competency, teacher education",
    key_papers: ["Celik (2023) — Intelligent-TPACK 27 items, EFA+CFA+SEM N=647", "Hava (2025) — Digital competency vs AI-TPACK N=401"],
    impact: "Thang đo chuẩn nhất hiện nay; Hava (2025) → khoảng cách ICT ≠ AI-TPACK",
    url: "https://www.cbhe.org"
  },
  {
    rank: 3,
    name: "AI in CS Education — Carnegie Mellon University (CMU) / HCII",
    country: "🇺🇸 Mỹ",
    key_people: "Ken Koedinger, Majd Kazemitabaar, Marti Hearst",
    focus: "Intelligent tutoring, LLMs in CS1, Copilot studies, cognitive load",
    key_papers: ["Kazemitabaar et al. (2023) — ChatGPT CS1 N=69", "Macina et al. (2023) — AI tutoring scaffolding"],
    impact: "Nghiên cứu đầu tiên và nghiêm ngặt nhất về ChatGPT trong dạy lập trình",
    url: "https://www.hcii.cmu.edu"
  },
  {
    rank: 4,
    name: "Stanford Human-Centered AI (HAI) — Education Group",
    country: "🇺🇸 Mỹ",
    key_people: "John Mitchell, Percy Liang, Emma Brunskill",
    focus: "Foundation models for education, AI fairness, adaptive learning, policy",
    key_papers: ["Bommasani et al. (2021) — Foundation Models", "Nie et al. (2024) — LLM feedback in coding"],
    impact: "HAI reports định hình chính sách AI-in-education toàn cầu",
    url: "https://hai.stanford.edu"
  },
  {
    rank: 5,
    name: "UCL Knowledge Lab — AI in Education",
    country: "🇬🇧 Anh",
    key_people: "Rose Luckin, Wayne Holmes, Mutlu Cukurova",
    focus: "AI in education ethics, metacognition, 'intelligence unleashed' framework",
    key_papers: ["Luckin et al. (2016) — Intelligence Unleashed (AI+Education report)", "Holmes et al. (2023) — Ethics of AI in Education"],
    impact: "Đặt nền tảng cho AI Ethics in Education — ảnh hưởng đến UNESCO, OECD guidelines",
    url: "https://www.ucl.ac.uk/knowledge-lab"
  },
  {
    rank: 6,
    name: "Georgia Tech — Computing Education Research Lab",
    country: "🇺🇸 Mỹ",
    key_people: "Mark Guzdial, Barbara Ericson, Tamara Pearce",
    focus: "CS education pedagogy, Media Computation, contextualized learning, broadening participation",
    key_papers: ["Guzdial (2015) — Learner-Centered Design of Computing Education", "Ericson et al. (2022) — CS1 failure rates"],
    impact: "Contextualized learning giảm dropout CS1 từ 30% → 8%",
    url: "https://cerl.gatech.edu"
  },
  {
    rank: 7,
    name: "AI-TPACK Assessment Lab — Bar-Ilan University (Israel)",
    country: "🇮🇱 Israel",
    key_people: "Mirit Eyal, colleagues at School of Education",
    focus: "Performance-based AI-TPACK assessment, artifacts analysis, rubric development",
    key_papers: ["Eyal (2025) — Artifacts-based AI-TPACK assessment, CVR=0.86, ICC=0.84"],
    impact: "Lần đầu tiên dùng authentic artifacts thay self-report để đo AI-TPACK",
    url: "https://education.biu.ac.il"
  },
  {
    rank: 8,
    name: "AI Pedagogy Lab — National Institute of Education, Singapore (NIE/NTU)",
    country: "🇸🇬 Singapore",
    key_people: "Tan colleagues (Jiannong Tan et al.)",
    focus: "AI-TPACK PD interventions, quasi-experimental design, programming education",
    key_papers: ["Tan et al. (2025) — 6-month PD intervention, N=125, quasi-exp ANCOVA, d=0.35"],
    impact: "Khuôn mẫu thực nghiệm trực tiếp cho KLTN HNUE; chứng minh Celik scale trong PD",
    url: "https://www.nie.edu.sg"
  },
  {
    rank: 9,
    name: "AI Ethics in Education — Mohammed VI Polytechnic University (UM6P)",
    country: "🇲🇦 Morocco",
    key_people: "Adel Mimoudi, colleagues",
    focus: "Ethics-first AI pedagogy, bibliometric analysis, AIA-PCEK model",
    key_papers: ["Mimoudi (2025) — AIA-PCEK: AI as pedagogical agent (4 ethics checkpoints), N=50 papers bibliometric"],
    impact: "Tái khái niệm AI: không chỉ là tool mà là 'pedagogical agent' có agency",
    url: "https://www.um6p.ma"
  },
  {
    rank: 10,
    name: "AI-TPACK China Research Hub — Multiple Universities",
    country: "🇨🇳 Trung Quốc",
    key_people: "Ning et al. (2024), Beijing Normal University group",
    focus: "SEM validation AI-TPACK, 7-component model, large-scale surveys",
    key_papers: ["Ning et al. (2024) — AI-TPACK SEM N=366, AI-TPK→TPACK β=0.870 (Sustainability journal)"],
    impact: "7-component model; xác nhận AI-TPK là trọng tâm can thiệp",
    url: "https://www.bnu.edu.cn"
  },
  {
    rank: 11,
    name: "MIT CSAIL — Programming Languages & Code AI",
    country: "🇺🇸 Mỹ",
    key_people: "Armando Solar-Lezama, Josh Tenenbaum, Max Welling",
    focus: "Program synthesis, neurosymbolic AI, code generation models",
    key_papers: ["Liang et al. (2022) — Code generation survey", "Li et al. (2022) — AlphaCode"],
    impact: "Nền tảng kỹ thuật của Copilot/ChatGPT code generation",
    url: "https://csail.mit.edu"
  },
  {
    rank: 12,
    name: "University of Helsinki — CS Education & Programming Research",
    country: "🇫🇮 Phần Lan",
    key_people: "Arto Hellas, Juho Leinonen, Paul Denny",
    focus: "LLM in CS1, Copilot in intro programming, exam integrity with AI",
    key_papers: ["Leinonen et al. (2023) — ChatGPT CS1 exams N=599", "Denny et al. (2024) — Copilot for CS1"],
    impact: "Corpus nghiên cứu CS1+AI lớn nhất châu Âu; data-driven policy cho CS education",
    url: "https://cs.helsinki.fi"
  },
  {
    rank: 13,
    name: "Columbia University — Teachers College & Learning Analytics",
    country: "🇺🇸 Mỹ",
    key_people: "Ryan Baker, Neil Heffernan (WPI), colleagues",
    focus: "Learning analytics, educational data mining, AIED, student modeling",
    key_papers: ["Baker & Inventado (2014) — EDM review", "Heffernan (2014) — ASSISTments tutoring"],
    impact: "Learning analytics foundation; ASSISTments platform dùng bởi hàng triệu HS",
    url: "https://tc.columbia.edu"
  },
  {
    rank: 14,
    name: "National Taiwan Normal University — ICT & TPACK Lab",
    country: "🇹🇼 Đài Loan",
    key_people: "Chin-Chung Tsai, Gwo-Jen Hwang, Taiwanese researchers",
    focus: "TPACK measurement, ICT integration, flipped classroom, Asian CS education",
    key_papers: ["Multiple TPACK-Asia studies 2015–2024", "Hwang et al. (2023) — AI in K-12 Taiwan"],
    impact: "Dữ liệu TPACK châu Á phong phú nhất; context gần VN nhất về văn hóa",
    url: "https://www.ntnu.edu.tw"
  },
  {
    rank: 15,
    name: "Oxford Internet Institute — AI Policy & Education",
    country: "🇬🇧 Anh",
    key_people: "Luciano Floridi, Brent Mittelstadt",
    focus: "AI ethics policy, data governance, GDPR in education, responsible AI",
    key_papers: ["Floridi et al. (2018) — AI4People", "Mittelstadt et al. (2016) — Ethics of algorithms"],
    impact: "Định hình EU AI Act, GDPR application to education, NĐ 13/2023 VN tham khảo"],
    url: "https://www.oii.ox.ac.uk"
  },
  {
    rank: 16,
    name: "ETH Zürich — Computer Science Education & AI Tools",
    country: "🇨🇭 Thụy Sĩ",
    key_people: "Juraj Hromkovic, Bernhard Platzer",
    focus: "Algorithmic thinking, CS education K-12, AI tools for programming courses",
    key_papers: ["Multiple ETH CS education papers 2020–2025"],
    impact: "Pedagogical framework cho AI-augmented CS education ở châu Âu",
    url: "https://inf.ethz.ch"
  },
  {
    rank: 17,
    name: "Arizona State University (ASU) — Learning Engineering Lab",
    country: "🇺🇸 Mỹ",
    key_people: "Punya Mishra (MSU → ASU), various",
    focus: "Adaptive learning systems, AI-TPACK PD, scaling interventions",
    key_papers: ["Mishra et al. (2023–2025) — TPACK in AI era"],
    impact: "Scale-up PD interventions với AI — từ lab sang hàng nghìn GV",
    url: "https://education.asu.edu"
  },
  {
    rank: 18,
    name: "Universiti Malaya / UPM — SEA AI Education Research",
    country: "🇲🇾 Malaysia",
    key_people: "Multiple Malaysian researchers",
    focus: "AI in Malaysian/SEA higher education, quasi-experimental CS studies",
    key_papers: ["Tan et al. (2025) — NIE Singapore/Malaysia collaboration"],
    impact: "Nghiên cứu SEA gần nhất với VN về văn hóa giáo dục và infrastructure",
    url: "https://www.um.edu.my"
  },
  {
    rank: 19,
    name: "Google DeepMind & Google for Education Research",
    country: "🌐 Toàn cầu",
    key_people: "Sundar Pichai, research teams",
    focus: "AlphaCode, Gemini for education, code generation benchmarks",
    key_papers: ["Chen et al. (2021) — Codex/GitHub Copilot", "Li et al. (2022) — AlphaCode", "Google (2024) — Gemini for Learning"],
    impact: "Tạo ra các công cụ mà nghiên cứu AI-TPACK đang đánh giá (Copilot, Gemini)",
    url: "https://research.google"
  },
  {
    rank: 20,
    name: "VNU-HCM / HNUE — Vietnam Emerging AI Education Research",
    country: "🇻🇳 Việt Nam",
    key_people: "TS. Nguyễn Thị Thanh Huyền (HNUE), Phan & Gam (2026), various",
    focus: "AI-TPACK in VN context, GD phổ thông 2018 implementation, Sư phạm Tin học",
    key_papers: ["Phan & Gam (2026) — VN GV AI perception (descriptive)", "KLTN Trương Tuấn Nghĩa (2027) — AI-TPACK-SE HNUE (in progress)"],
    impact: "Đầu tiên: validation thang đo AI-TPACK-SE tiếng Việt + quasi-exp tại VN",
    url: "https://hnue.edu.vn"
  }
];

// ─── TRENDING RESEARCH TOPICS (Literature Review) ─────────────────────────
const TRENDING_TOPICS = [
  {
    id: 1,
    topic: "LLMs trong dạy học Lập trình (CS Education)",
    trend_level: "🔥🔥🔥 Cực nóng 2023–2026",
    description: "ChatGPT, GitHub Copilot, Code Llama thay đổi căn bản cách dạy và học lập trình. Debate: AI có giết chết CS1 không?",
    key_findings: [
      "Leinonen et al. (2023): ChatGPT đạt 65–88% điểm CS1 exams → cần redesign assessments",
      "Kazemitabaar (2023): SV dùng AI viết code mà không hiểu → fail khi thi không có AI",
      "Denny et al. (2024): Copilot tăng productivity 55% nhưng giảm algorithmic thinking",
      "Han (2024) SLR: plausible-but-wrong code là thách thức số 1"
    ],
    gap_for_vn: "Chưa có nghiên cứu nào về CS1 + LLMs tại VN với ngữ cảnh Pascal/Scratch",
    journals: ["ACM SIGCSE", "Computers & Education", "Journal of Computing in Higher Education"],
    search_string: '("ChatGPT" OR "GitHub Copilot" OR "LLM") AND ("programming education" OR "CS1" OR "computer science education")'
  },
  {
    id: 2,
    topic: "AI-TPACK Framework Development & Validation",
    trend_level: "🔥🔥🔥 Rất nóng 2022–2026",
    description: "Từ TPACK (2006) → AI-TPACK (2022+): phát triển, kiểm định, và ứng dụng trong đào tạo GV AI",
    key_findings: [
      "Celik (2023): Intelligent-TPACK 5 nhân tố, 27 item, KMO=0.955, CFA R²=0.69",
      "Ning (2024): 7-component SEM, AI-TPK→TPACK β=0.870",
      "Hava (2025): Digital competency ≠ AI-TPACK (r=0.37), cần đào tạo riêng",
      "Eyal (2025): Performance-based assessment artifacts > self-report"
    ],
    gap_for_vn: "Chưa có validation AI-TPACK tại Việt Nam; chưa có security dimension",
    journals: ["Computers & Education", "Teaching and Teacher Education", "Journal of Research on Technology in Education"],
    search_string: '("AI-TPACK" OR "Artificial Intelligence TPACK" OR "Intelligent-TPACK") AND ("teacher" OR "education")'
  },
  {
    id: 3,
    topic: "Professional Development (PD) Intervention cho GV sử dụng AI",
    trend_level: "🔥🔥 Nóng 2023–2026",
    description: "Chuyển từ lý thuyết sang thực hành: thiết kế và kiểm định can thiệp PD để nâng AI-TPACK cho GV đang đi dạy",
    key_findings: [
      "Tan (2025): 6-tháng PD intervention, quasi-exp N=125, d=0.35 (TN) vs d≈0 (ĐC)",
      "Metacognitive recalibration: GV giỏi hơn nhận ra giới hạn mình → điểm tự đánh giá giảm",
      "ADDIE model phổ biến nhất để thiết kế PD với AI",
      "Kết quả PD ngắn hạn (1-2 tuần) không sustain; 6+ tuần mới có hiệu quả"
    ],
    gap_for_vn: "Tan (2025) ở Singapore; chưa có PD intervention tại Việt Nam/HNUE",
    journals: ["Teaching and Teacher Education", "Computers in Human Behavior", "Asia Pacific Journal of Education"],
    search_string: '("professional development" OR "PD intervention") AND ("AI-TPACK" OR "AI integration") AND ("teacher education")'
  },
  {
    id: 4,
    topic: "AI Ethics & Responsible AI trong Giáo dục",
    trend_level: "🔥🔥🔥 Rất nóng — UNESCO, OECD, EU AI Act focus",
    description: "Từ technical AI sang AI ethics: bias, fairness, transparency, consent, privacy trong bối cảnh lớp học",
    key_findings: [
      "Mimoudi (2025): AIA-PCEK — 4 ethics checkpoints, AI như pedagogical agent có agency",
      "UNESCO (2021): Recommendation on Ethics of AI in Education",
      "EU AI Act (2024): education = 'high-risk AI application' — yêu cầu transparency, audit",
      "Holmes et al. (2023): 10 ethical principles cho AI in education"
    ],
    gap_for_vn: "NĐ 13/2023/NĐ-CP: legal framework VN về dữ liệu cá nhân chưa được nghiên cứu trong giáo dục",
    journals: ["AI & Society", "Ethics and Information Technology", "British Journal of Educational Technology"],
    search_string: '("AI ethics" OR "responsible AI") AND ("education" OR "learning") AND ("2022" OR "2023" OR "2024" OR "2025")'
  },
  {
    id: 5,
    topic: "Generative AI & Academic Integrity",
    trend_level: "🔥🔥🔥 Cực nóng sau 11/2022",
    description: "ChatGPT làm bùng nổ vấn đề gian lận học thuật: detect AI text/code, redesign assessments, policy responses",
    key_findings: [
      "Turnitin báo cáo 15M+ submissions/tuần có AI content (2024)",
      "AI detectors có accuracy chỉ 60–80% — quá thấp để làm bằng chứng kỷ luật",
      "Lý tưởng hơn: redesign assessments (oral exam, live coding, process portfolio)",
      "GV cần AI literacy để phân biệt AI-generated vs human work"
    ],
    gap_for_vn: "VN: hầu hết trường ĐH chưa có policy rõ ràng về ChatGPT trong nộp bài",
    journals: ["International Journal for Educational Integrity", "Computers & Education", "Assessment & Evaluation in HE"],
    search_string: '("academic integrity" OR "AI plagiarism" OR "ChatGPT" OR "generative AI") AND ("assessment" OR "higher education") AND ("2023" OR "2024" OR "2025")'
  },
  {
    id: 6,
    topic: "Adaptive Learning & Intelligent Tutoring Systems (ITS)",
    trend_level: "🔥🔥 Nóng — AI-powered ITS renaissance",
    description: "ITS thế hệ mới: LLM-powered adaptive systems thay thế rule-based tutors cũ",
    key_findings: [
      "Khanmigo (Khan Academy + GPT-4): Socratic tutoring, không cho đáp án thẳng",
      "Carnegie Learning MATHia: adaptive math tutoring, data từ 1M+ students",
      "Koedinger et al. (2023): AI tutors ≈ 2 sigma effect (như human tutors)",
      "Challenge: personalization vs. privacy — biết nhiều về SV → privacy risk"
    ],
    gap_for_vn: "ITS tiếng Việt cho lập trình: chưa tồn tại",
    journals: ["International Journal of Artificial Intelligence in Education", "Educational Technology Research"],
    search_string: '("intelligent tutoring" OR "adaptive learning" OR "ITS") AND ("programming" OR "computer science") AND ("LLM" OR "GPT" OR "AI")'
  },
  {
    id: 7,
    topic: "Code Review & Automated Assessment với AI",
    trend_level: "🔥🔥 Nóng 2023–2026",
    description: "AI tự động chấm code của SV: rubric-based, test-case-based, và LLM-based feedback",
    key_findings: [
      "Eyal (2025): ICC=0.84 khi dùng rubric AI-TPACK cho artifacts — feasible",
      "AutoGrader + LLM: feedback chất lượng tương đương GV human trong 30% thời gian",
      "CodeBERT, CodeT5: specialized models cho code understanding",
      "Formative feedback (gợi ý cải thiện) > summative feedback (chỉ điểm số)"
    ],
    gap_for_vn: "Chưa có automated code assessment cho bài tập lập trình tiếng Việt",
    journals: ["ACM SIGCSE Technical Symposium", "IEEE Transactions on Education"],
    search_string: '("automated assessment" OR "code review" OR "AI feedback") AND ("programming" OR "coding") AND ("student" OR "learner")'
  },
  {
    id: 8,
    topic: "Computational Thinking (CT) trong Kỷ nguyên AI",
    trend_level: "🔥🔥 Nóng — đang redefine CT với AI",
    description: "CT truyền thống (decomposition, pattern, abstraction, algorithm) cần update với AI literacy và AI-augmented problem solving",
    key_findings: [
      "Wing (2006) CT definition cần reframe: khi nào dùng AI vs khi nào code tay",
      "Brennan & Resnick (2012) CT với Scratch vẫn relevant nhưng cần AI extension",
      "'CT + AI literacy' = digital competency cho thế kỷ 21",
      "GDPT 2018 VN: CT là một trong 5 năng lực cốt lõi môn Tin học"
    ],
    gap_for_vn: "VN cần framework CT + AI literacy riêng cho bối cảnh văn hóa học thuật VN",
    journals: ["Computers & Education", "International Journal of Computer-Supported Collaborative Learning"],
    search_string: '("computational thinking" AND "artificial intelligence") AND ("teacher" OR "curriculum") AND ("2020" OR "2021" OR "2022" OR "2023" OR "2024" OR "2025")'
  }
];

// ─── WORKING PRINCIPLES (Nguyên tắc làm việc) ────────────────────────────────
const WORKING_PRINCIPLES = [
  { id: 1, cat: "📐 Thống kê", title: "Không dùng p-value đơn độc", body: "Luôn báo cáo cả p-value VÀ effect size (d, r, η², ω²). N lớn → p nhỏ dù d rất nhỏ. Tạp chí APA (2019) bắt buộc effect size." },
  { id: 2, cat: "📐 Thống kê", title: "Kiểm tra assumption TRƯỚC khi dùng test", body: "t-test: Shapiro-Wilk (normality) + Levene (homogeneity). ANCOVA: homogeneity of regression slopes. EFA: KMO ≥ 0.70 + Bartlett p < 0.05. Vi phạm → dùng non-parametric hoặc robust methods." },
  { id: 3, cat: "📐 Thống kê", title: "Bootstrap cho indirect effects", body: "Kiểm định indirect effects (mediation) trong SEM: LUÔN dùng Bootstrap (1000–5000 lần), KHÔNG dùng Sobel test (giả định phân phối chuẩn không thực tế). Sobel test yếu, underpower." },
  { id: 4, cat: "📐 Thống kê", title: "Báo cáo CI (Confidence Interval) luôn luôn", body: "95% CI cho mọi estimate: β ± CI, d ± CI, r ± CI. CI rộng → kết quả không chắc chắn. CI không chứa 0 → significant. Đây là tiêu chuẩn gold của APA 7th edition." },
  { id: 5, cat: "🔬 Thiết kế NC", title: "Xác định threats to internal validity", body: "Quasi-exp phải list: selection bias (ANCOVA xử lý), history effect, testing effect (dùng alternate forms), maturation, attrition. Thảo luận explicitly trong limitations." },
  { id: 6, cat: "🔬 Thiết kế NC", title: "Power analysis TRƯỚC khi thu thập", body: "Tính n cần thiết trước khi bắt đầu nghiên cứu. Underpowered study = waste of resources. Với d=0.35 (Tan 2025 benchmark), n ≥ 66/nhóm. Dùng G*Power phần mềm miễn phí." },
  { id: 7, cat: "🔬 Thiết kế NC", title: "Treatment fidelity = phải đo, không được assume", body: "Quan sát ít nhất 20% số buổi can thiệp với checklist. Tính fidelity score. Nếu GV không dạy đúng protocol → kết quả âm không thể interpret được." },
  { id: 8, cat: "🔬 Thiết kế NC", title: "Pilot study bắt buộc cho instrument mới", body: "n=30–50 pilot → α, item-total, EFA sơ bộ → chỉnh sửa item → main study. Không pilot = rủi ro thang đo sai không phát hiện được cho đến khi CFA fail với N=200+" },
  { id: 9, cat: "📝 Viết luận văn", title: "Mỗi claim cần evidence", body: "Mỗi câu khẳng định (đặc biệt 'nghiên cứu X cho thấy Y') PHẢI có citation cụ thể. Tránh generalizations như 'nhiều nghiên cứu cho thấy' mà không cite." },
  { id: 10, cat: "📝 Viết luận văn", title: "Gap → RQ → Hypothesis → Method: chuỗi logic chặt chẽ", body: "Mỗi RQ phải xuất phát từ gap cụ thể trong literature. Mỗi hypothesis từ RQ. Mỗi phương pháp từ hypothesis. Người đọc phải thấy chuỗi nhân quả rõ ràng." },
  { id: 11, cat: "📝 Viết luận văn", title: "Thảo luận limitations một cách trực tiếp", body: "Đừng giấu limitations. Đề cập: (1) quasi-exp không random → selection bias possible, (2) single-institution → external validity hạn chế, (3) self-report bias. Reviewer đánh giá cao sự trung thực." },
  { id: 12, cat: "📝 Viết luận văn", title: "APA 7th edition cho citations", body: "Author (Year): trong ngoặc → (Celik, 2023). Author et al. khi ≥ 3 authors từ lần cite đầu tiên. DOI bắt buộc. Journal name không viết tắt. HNUE có thể dùng format APA hoặc ISO 690." },
  { id: 13, cat: "🤖 AI Tools", title: "Xác minh AI-generated content với nguồn gốc", body: "Khi dùng ChatGPT để draft sections, PHẢI xác minh từng claim với paper gốc. AI hallucinate statistics, authors, năm. Never cite AI-generated content như fact mà không verify." },
  { id: 14, cat: "🤖 AI Tools", title: "Prompt engineering cho nghiên cứu học thuật", body: "Prompt tốt: 'Act as a research methodologist. I have [N=X, design, variables]. What ANCOVA assumptions should I test and how?' + 'Cite specific sources.' → output tốt hơn prompt chung." },
  { id: 15, cat: "🤖 AI Tools", title: "Khai báo AI tool trong Methodology", body: "Nhiều tạp chí 2024+ yêu cầu declare AI tool usage: 'ChatGPT-4 was used to improve English writing. All content was verified by the authors.' Không khai báo = vi phạm editorial policy." },
  { id: 16, cat: "📚 Literature Review", title: "PRISMA 2020 — 27 items phải báo cáo", body: "Dùng PRISMA 2020 checklist: 27 mục bắt buộc báo cáo. PRISMA flow diagram: Identification → Screening → Eligibility → Included. Đăng ký protocol trên PROSPERO trước khi bắt đầu." },
  { id: 17, cat: "📚 Literature Review", title: "Ít nhất 3 CSDL cho SLR", body: "Tối thiểu: Scopus + Web of Science + 1 chuyên ngành (IEEE Xplore/ERIC/ACM DL). Bổ sung: arXiv (preprints), Google Scholar (grey literature). Documenting tất cả search strings + dates." },
  { id: 18, cat: "📚 Literature Review", title: "Inter-rater reliability cho screening", body: "Ít nhất 2 người độc lập screen titles/abstracts. Tính Cohen's κ ≥ 0.70 (substantial agreement). Conflict → discuss → consensus. Document tỉ lệ agreement." },
  { id: 19, cat: "🎯 KLTN Cụ thể", title: "Timeline KLTN HNUE 2026–2027", body: "T9-10/2026: Literature review + thang đo. T11-12/2026: Pilot + CFA. T1-4/2027: Thực nghiệm (pre → 12 tuần → post). T5-6/2027: Phân tích + Viết. T7/2027: Nộp + Bảo vệ." },
  { id: 20, cat: "🎯 KLTN Cụ thể", title: "3 novelty của KLTN so với literature", body: "(1) Security dimension chưa có trong bất kỳ AI-TPACK paper nào. (2) Bối cảnh Việt Nam/HNUE — 13/13 bài quốc tế. (3) Thang đo AI-TPACK-SE tiếng Việt validated — lần đầu tiên." }
];
