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
    # Bản vá nhiễu: banks/<slug>.patch, mỗi mục "@N" theo sau là 3 dòng "- nhiễu" thay cho nhiễu của câu N (đánh số từ 1).
    patch = path[:-4] + ".patch"
    if os.path.exists(patch):
        n = None; new = {}
        for raw in open(patch, encoding="utf-8"):
            line = raw.rstrip("\n")
            if line.startswith("@"): n = int(line[1:].split()[0]); new[n] = []
            elif line.startswith("- ") and n is not None: new[n].append(line[2:].strip())
        for k, v in new.items():
            assert len(v) == 3, f"patch @{k} phải có đúng 3 nhiễu"
            mcq[k - 1]["bad"] = v
    return mcq, essay

# Đệm chữ TRUNG TÍNH (không tiết lộ đúng/sai) cho phương án ngắn, để độ dài không dự báo đáp án.
PADS = [
    " (theo cách trình bày của bài báo)", " trong điều kiện được mô tả ở phần phương pháp",
    " như ghi nhận trong phần kết quả", " trong phạm vi mẫu của nghiên cứu này",
    " ở giai đoạn đầu của quy trình", ", tính theo thang đo mà nghiên cứu áp dụng",
    " theo số liệu của bảng chính", " trong bối cảnh thí nghiệm nêu trên",
    " (theo bài báo)", " ở nghiên cứu này", " trong bài gốc", " như đã nêu", " ở phần kết quả", " theo tác giả", " ở đây",
]

def pad_lengths(opts, ci, rng):
    """Chọn ngẫu nhiên đều 1 trong 4 phương án làm 'dài nhất'; đệm các phương án ngắn tới >=0,8 độ dài đúng."""
    L = len(opts[ci])
    designated = rng.randrange(4)
    short = rng.randrange(4)
    pads = PADS[:]; rng.shuffle(pads)
    def grow(i, target):
        left = pads[:]
        while len(opts[i]) < target:
            fit = [x for x in left if len(opts[i]) + len(x) <= target + 3]
            if not fit: break
            x = max(fit, key=len); left.remove(x)
            opts[i] = opts[i].rstrip(".") + x
    for i in range(4):
        if i == ci: continue
        if i == designated: grow(i, L + rng.randint(2, 9))
        elif i == short and short != designated: continue
        else: grow(i, int(0.95 * L))
    return opts

CUTS = [", ", "; ", " vì ", " nên ", " để ", " kể cả ", " dù "]

def trim_long(good, bad):
    """Cắt bớt mệnh đề phụ ở cuối nhiễu quá dài (>1,08 độ dài đúng) để độ dài không phải là dấu hiệu."""
    L = len(good); out = []
    for d in bad:
        if len(d) <= 1.08 * L: out.append(d); continue
        best = None
        for cut in CUTS:
            k = d.rfind(cut)
            while k > 0:
                cand = d[:k].rstrip(" ,;")
                if 0.8 * L <= len(cand) <= 1.08 * L and (best is None or len(cand) > len(best)): best = cand
                k = d.rfind(cut, 0, k)
        out.append(best if best else d)
    return out

def trim_good(good, bad):
    """Nếu đáp án đúng dài hơn hẳn mọi nhiễu, cắt ở ranh giới mệnh đề (; hoặc , hoặc ' và ') cho vừa độ dài nhiễu dài nhất.
    Phần bị cắt vẫn nằm đầy đủ trong giải thích (field E)."""
    m = max(len(d) for d in bad)
    if len(good) <= 1.12 * m: return good
    best = None
    for cut in ["; ", ", ", " và ", " nên ", " vì ", " and ", " so ", " because ", " but ", " which "]:
        k = good.find(cut)
        while k > 0:
            cand = good[:k].rstrip(" ,;")
            if 0.55 * m <= len(cand) <= 1.12 * m and (best is None or len(cand) > len(best)): best = cand
            k = good.find(cut, k + 1)
    return best or good

def build(slug):
    en = slug.endswith(":en")
    if en: slug = slug[:-3]
    src = os.path.join(ROOT, "banks", slug + (".en.txt" if en else ".txt"))
    mcq, essay = parse(src)
    errs = []
    for i, q in enumerate(mcq):
        if not q["good"] or len(q["bad"]) != 3 or not q["e"]:
            errs.append(f"câu {i+1} lỗi định dạng: {q['q'][:50]}")
    if errs:
        print("\n".join(errs)); sys.exit(1)
    for q in mcq:
        if not en: q["bad"] = trim_long(q["good"], q["bad"])
        if os.environ.get("TRIM", "1") == "1" and True: q["good"] = trim_good(q["good"], q["bad"])
    rng = random.Random("thesis-" + slug + ("-en" if en else ""))
    n = len(mcq)
    pos = [i % 4 for i in range(n)]
    rng.shuffle(pos)
    out = []
    for q, p in zip(mcq, pos):
        bad = q["bad"][:]; rng.shuffle(bad)
        opts = bad[:p] + [q["good"]] + bad[p:]
        if os.environ.get('PAD') == '1': opts = pad_lengths(opts, p, rng)
        out.append({"q": q["q"], "sec": q["sec"], "o": opts, "c": p, "e": q["e"]})
    dst = os.path.join(BASE, *(["en"] if en else []), "modules", slug, "quiz.json")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    json.dump({"mcq": out, "essay": essay}, open(dst, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    # audit
    cnt = [sum(1 for q in out if q["c"] == k) for k in range(4)]
    longest = sum(1 for q in out if len(q["o"][q["c"]]) == max(len(o) for o in q["o"]))
    shortest = sum(1 for q in out if len(q["o"][q["c"]]) == min(len(o) for o in q["o"]))
    big = sum(1 for q in out if len(q["o"][q["c"]]) > 1.10 * max(len(o) for k, o in enumerate(q["o"]) if k != q["c"]))
    exp = n / 4
    chi = sum((c - exp) ** 2 / exp for c in cnt)
    ratio = statistics.mean(len(q["o"][q["c"]]) / (sum(len(o) for k, o in enumerate(q["o"]) if k != q["c"]) / 3) for q in out)
    print(f"{slug}{':en' if en else ''}: {n} MCQ + {len(essay)} tự luận | vị trí A-D={cnt} chi2={chi:.2f} | đúng-dài-nhất={longest/n:.0%} đúng-ngắn-nhất={shortest/n:.0%} | độ dài đúng/nhiễu TB={ratio:.2f} | đúng dài hơn nhiễu >10%={big/n:.0%}")
    return longest / n

if __name__ == "__main__":
    slugs = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(os.path.join(ROOT, "banks")) if f.endswith(".txt") and ".en." not in f)
    for s in slugs: build(s)
