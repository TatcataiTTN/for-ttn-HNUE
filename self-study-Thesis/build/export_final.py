#!/usr/bin/env python3
"""Xuất quiz.json (bản cuối, đã vá/cân bằng) ra dạng Q/+/-/E để dịch. Dùng: export_final.py <slug>"""
import json, sys, os
slug = sys.argv[1]
d = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "modules", slug, "quiz.json"), encoding="utf-8"))
sec = None
for q in d["mcq"]:
    if q["sec"] != sec: sec = q["sec"]; print("## " + sec)
    print("Q: " + q["q"]); print("+ " + q["o"][q["c"]])
    for i, o in enumerate(q["o"]):
        if i != q["c"]: print("- " + o)
    print("E: " + q["e"]); print()
for e in d["essay"]:
    print("T: " + e["q"]); print("M: " + e["m"]); print()
