#!/usr/bin/env python3
"""Sinh modules/<slug>/quiz.json từ build/banks/<slug>.txt.
Định dạng bank:
  ## Tên phần
  Q: câu hỏi
  + đáp án đúng
  - nhiễu 1
  - nhiễu 2
  - nhiễu 3
  E: giải thích (trích/diễn giải từ bài gốc)
  (dòng trống giữa các câu)
  T: câu tự luận
  M: gợi ý đáp án
Vị trí đáp án đúng được cân bằng theo chu kỳ A/B/C/D rồi hoán vị bằng random.Random(seed cố định theo slug),
nên kết quả tái lập được và không phụ thuộc thứ tự viết của người soạn."""
import json, random, sys, os, re, statistics
ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(ROOT)

def parse(path):
    mcq, essay, sec, cur = [], [], "Chung", None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if line.startswith("## "):
            sec = line[3:].strip(); continue
        if line.startswith("Q: "):
            if cur: mcq.append(cur)
            cur = {"q": line[3:].strip(), "sec": sec, "good": None, "bad": [], "e": ""}
        elif line.startswith("+ ") and cur is not None: cur["good"] = line[2:].strip()
        elif line.startswith("- ") and cur is not None: cur["bad"].append(line[2:].strip())
        elif line.startswith("E: ") and cur is not None: cur["e"] = line[3:].strip()
        elif line.startswith("T: "):
            if cur: mcq.append(cur); cur = None
            essay.append({"q": line[3:].strip(), "m": ""})
        elif line.startswith("M: ") and essay: essay[-1]["m"] = line[3:].strip()
    if cur: mcq.append(cur)
    return mcq, essay

# Đệm chữ TRUNG TÍNH (không tiết lộ đúng/sai) cho phương án ngắn, để độ dài không dự báo đáp án.
PADS = [
    " (theo cách trình bày của bài báo)", " trong điều kiện được mô tả ở phần phương pháp",
    " như ghi nhận trong phần kết quả", " trong phạm vi mẫu của nghiên cứu này",
    " ở giai đoạn đầu của quy trình", ", tính theo thang đo mà nghiên cứu áp dụng",
    " theo số liệu của bảng chính", " trong bối cảnh thí nghiệm nêu trên",
]

def pad_lengths(opts, ci, rng):
    """Chọn ngẫu nhiên đều 1 trong 4 phương án làm 'dài nhất'; đệm các phương án ngắn tới >=0,8 độ dài đúng."""
    L = len(opts[ci])
    designated = rng.randrange(4)
    pads = PADS[:]; rng.shuffle(pads)
    def grow(i, target):
        k = 0
        while len(opts[i]) < target and k < len(pads):
            opts[i] = opts[i].rstrip(".") + pads[k]; k += 1
    for i in range(4):
        if i == ci: continue
        if i == designated: grow(i, L + rng.randint(2, 9))
        else: grow(i, int(0.8 * L))
    return opts

def build(slug):
    src = os.path.join(ROOT, "banks", slug + ".txt")
    mcq, essay = parse(src)
    errs = []
    for i, q in enumerate(mcq):
        if not q["good"] or len(q["bad"]) != 3 or not q["e"]:
            errs.append(f"câu {i+1} lỗi định dạng: {q['q'][:50]}")
    if errs:
        print("\n".join(errs)); sys.exit(1)
    rng = random.Random("thesis-" + slug)
    n = len(mcq)
    pos = [i % 4 for i in range(n)]
    rng.shuffle(pos)
    out = []
    for q, p in zip(mcq, pos):
        bad = q["bad"][:]; rng.shuffle(bad)
        opts = bad[:p] + [q["good"]] + bad[p:]
        opts = pad_lengths(opts, p, rng)
        out.append({"q": q["q"], "sec": q["sec"], "o": opts, "c": p, "e": q["e"]})
    dst = os.path.join(BASE, "modules", slug, "quiz.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump({"mcq": out, "essay": essay}, open(dst, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    # audit
    cnt = [sum(1 for q in out if q["c"] == k) for k in range(4)]
    longest = sum(1 for q in out if len(q["o"][q["c"]]) == max(len(o) for o in q["o"]))
    shortest = sum(1 for q in out if len(q["o"][q["c"]]) == min(len(o) for o in q["o"]))
    exp = n / 4
    chi = sum((c - exp) ** 2 / exp for c in cnt)
    ratio = statistics.mean(len(q["o"][q["c"]]) / (sum(len(o) for k, o in enumerate(q["o"]) if k != q["c"]) / 3) for q in out)
    print(f"{slug}: {n} MCQ + {len(essay)} tự luận | vị trí A-D={cnt} chi2={chi:.2f} | đúng-dài-nhất={longest/n:.0%} đúng-ngắn-nhất={shortest/n:.0%} | độ dài đúng/nhiễu TB={ratio:.2f}")
    return longest / n

if __name__ == "__main__":
    slugs = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(os.path.join(ROOT, "banks")) if f.endswith(".txt"))
    for s in slugs: build(s)
