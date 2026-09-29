#!/usr/bin/env python3
"""In các câu có đáp án đúng dài hơn nhiều so với nhiễu (để sửa tay). Dùng: lint_bank.py <slug> [--full]"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_quiz import parse, ROOT
slug = sys.argv[1]; full = "--full" in sys.argv
mcq, _ = parse(os.path.join(ROOT, "banks", slug + ".txt"))
bad = 0
for i, q in enumerate(mcq, 1):
    g = len(q["good"]); ds = [len(d) for d in q["bad"]]
    ok = max(ds) >= 0.9 * g
    if not ok:
        bad += 1
        print(f"@{i} good={g} bad={ds} | {q['q'][:70]}")
        if full:
            print("   +", q["good"])
            for d in q["bad"]: print("   -", d)
print(f"cần sửa: {bad}/{len(mcq)}")
