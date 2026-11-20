# -*- coding: utf-8 -*-
import re, json
from pathlib import Path
from collections import Counter, defaultdict

root = Path(__file__).resolve().parents[1]
rows = json.loads((root / "_build" / "_quality_scan.json").read_text(encoding="utf-8"))

KIND_RE = re.compile(r'data-kind="([^"]+)"')
SECTION_RE = re.compile(r"<section\b([^>]*)>([\s\S]*?)</section>", re.I)
CLASS_RE = re.compile(r'class="([^"]*)"')
H_RE = re.compile(r"<h[12][^>]*>(.*?)</h[12]>", re.S)
P_RE = re.compile(r"<p\b[^>]*>(.*?)</p>", re.S)
CN_RE = re.compile(r"[\u4e00-\u9fff]")
RANGE_RE = re.compile(r'<input[^>]*type="range"', re.I)
CANVAS_RE = re.compile(r"<canvas\b", re.I)
ANSWER_RE = re.compile(r'data-kind="answer"')
HOOK_RE = re.compile(r"data-hook=")
FIG_RE = re.compile(r"data-fig=")
QUIZ_RE = re.compile(r"data-quiz=")


def plain(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", s).strip()


report = {}
for p in sorted((root / "lectures").glob("*.html")):
    html = p.read_text(encoding="utf-8")
    code = p.stem
    kinds = Counter(KIND_RE.findall(html))
    # per-section metrics
    sec_stats = []
    short = 0
    long = 0
    emptyish = 0
    interactive_secs = 0
    for attrs, body in SECTION_RE.findall(html):
        cm = CLASS_RE.search(attrs)
        classes = cm.group(1).split() if cm else []
        title = plain(H_RE.search(body).group(1)) if H_RE.search(body) else ""
        cn = len(CN_RE.findall(plain(body)))
        has_i = bool(RANGE_RE.search(body) or CANVAS_RE.search(body) or FIG_RE.search(body))
        kind_m = re.search(r'data-kind="([^"]+)"', attrs)
        kind = kind_m.group(1) if kind_m else ("?" if "slide" in classes else "-")
        if cn < 20:
            short += 1
        if cn > 120:
            long += 1
        if cn < 8 and not has_i:
            emptyish += 1
        if has_i:
            interactive_secs += 1
        sec_stats.append({"kind": kind, "cn": cn, "title": title[:40], "interactive": has_i})

    # density
    n = max(len(sec_stats), 1)
    cn_total = sum(s["cn"] for s in sec_stats)
    # lab source LOC / function count
    labs = list((root / "js" / "labs").glob(f"{code}-*.js"))
    lab_loc = 0
    lab_fn = 0
    lab_draw = 0
    for lf in labs:
        t = lf.read_text(encoding="utf-8")
        lab_loc += t.count("\n") + 1
        lab_fn += len(re.findall(r"\bfunction\b|\b=>\b", t))
        lab_draw += t.count("fillRect") + t.count("stroke") + t.count("beginPath") + t.count("arc(")

    quiz = root / "js" / "quiz" / f"{code}.js"
    quiz_items = 0
    quiz_has_explain = 0
    if quiz.exists():
        qt = quiz.read_text(encoding="utf-8")
        # try array length heuristics
        quiz_items = len(re.findall(r"\bstem\s*:", qt)) or len(re.findall(r"\bprompt\s*:", qt)) or len(
            re.findall(r"choices\s*:", qt)
        )
        quiz_has_explain = len(re.findall(r"explain|解析|rationale|why\s*:", qt, re.I))

    build = root / "_build" / f"lec{code}.py"
    build_loc = 0
    build_panels = 0
    build_todo = 0
    if build.exists():
        bt = build.read_text(encoding="utf-8")
        build_loc = bt.count("\n") + 1
        build_panels = bt.count("panel(") + bt.count("slide(") + bt.count("S(")
        build_todo = len(re.findall(r"TODO|FIXME|占位|临时|WIP", bt, re.I))

    report[code] = {
        "kinds": dict(kinds),
        "n_sec": len(sec_stats),
        "cn_total": cn_total,
        "cn_per_sec": round(cn_total / n, 1),
        "short_sec": short,
        "long_sec": long,
        "emptyish": emptyish,
        "interactive_secs": interactive_secs,
        "interactive_ratio": round(interactive_secs / n, 3),
        "lab_loc": lab_loc,
        "lab_fn": lab_fn,
        "lab_draw": lab_draw,
        "quiz_items": quiz_items,
        "quiz_explain": quiz_has_explain,
        "build_loc": build_loc,
        "build_panels": build_panels,
        "build_todo": build_todo,
        "titles": [s["title"] for s in sec_stats if s["title"]][:15],
        "kind_order_sample": [s["kind"] for s in sec_stats[:20]],
    }

print(json.dumps(report, ensure_ascii=False, indent=2))
(root / "_build" / "_quality_deep.json").write_text(
    json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
)

# summary ranking features
print("\nRANK by cn_per_sec")
for code, r in sorted(report.items(), key=lambda kv: -kv[1]["cn_per_sec"]):
    print(
        f"{code}: cn/sec={r['cn_per_sec']} short={r['short_sec']} long={r['long_sec']} "
        f"ix={r['interactive_secs']}/{r['n_sec']} labLOC={r['lab_loc']} "
        f"kinds={r['kinds']} quiz={r['quiz_items']} explain={r['quiz_explain']}"
    )
