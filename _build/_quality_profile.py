# -*- coding: utf-8 -*-
"""Per-lecture quality profile for web decks."""
import re
import json
from pathlib import Path
from collections import Counter

root = Path(__file__).resolve().parents[1]
chrome_fns = [
    "cover", "objectives", "bullets", "two_col", "cards3", "definition",
    "prompt", "answer", "lab", "culture", "summary", "homework",
    "formula_page", "derive", "mistake", "section", "route", "quiz",
    "table_page",
]

meta = {
    "00": {"title": "数学与人文", "hours": "计入1.1", "part": "序"},
    "11": {"title": "函数", "hours": "4", "part": "微积分"},
    "12": {"title": "极限", "hours": "8", "part": "微积分"},
    "13": {"title": "导数与微分", "hours": "6", "part": "微积分"},
    "14": {"title": "导数的应用", "hours": "6", "part": "微积分"},
    "15": {"title": "不定积分", "hours": "6", "part": "微积分"},
    "16": {"title": "定积分", "hours": "6", "part": "微积分"},
    "17": {"title": "积分应用", "hours": "2", "part": "微积分"},
    "18": {"title": "二元函数", "hours": "新增", "part": "微积分"},
    "21": {"title": "行列式", "hours": "3", "part": "线代"},
    "22": {"title": "矩阵", "hours": "7", "part": "线代"},
    "23": {"title": "线性方程组", "hours": "2", "part": "线代"},
    "24": {"title": "数据科学", "hours": "新增", "part": "线代"},
}

profiles = []
for code, info in meta.items():
    bp = root / "_build" / f"lec{code}.py"
    hp = root / "lectures" / f"{code}.html"
    lp = list((root / "js" / "labs").glob(f"{code}-*.js"))
    qp = root / "js" / "quiz" / f"{code}.js"
    bt = bp.read_text(encoding="utf-8") if bp.exists() else ""
    ht = hp.read_text(encoding="utf-8") if hp.exists() else ""
    lt = "\n".join(p.read_text(encoding="utf-8") for p in lp)
    qt = qp.read_text(encoding="utf-8") if qp.exists() else ""

    fn_counts = {fn: len(re.findall(rf"\b{fn}\s*\(", bt)) for fn in chrome_fns}
    topics = Counter(re.findall(r'"topic"\s*:\s*"([^"]+)"', qt))
    nq = len(re.findall(r'"stem"\s*:', qt))
    n_explain = len(re.findall(r'"explain"\s*:', qt))
    canvas_ids = re.findall(r'<canvas[^>]+id="([^"]+)"', ht)
    range_n = len(re.findall(r'type="range"', ht))
    n_sec = len(re.findall(r"<section\b", ht, re.I))
    n_ans = ht.count('data-kind="answer"')
    n_hook = len(re.findall(r"data-hook=", ht))
    n_sec_start = len(re.findall(r"data-sec-start=", ht))
    cn = len(re.findall(r"[\u4e00-\u9fff]", re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>", " ", ht)))
    # pedagogy markers in source
    culture_n = fn_counts.get("culture", 0)
    mistake_n = fn_counts.get("mistake", 0)
    derive_n = fn_counts.get("derive", 0)
    lab_n = fn_counts.get("lab", 0)
    prompt_n = fn_counts.get("prompt", 0)
    def_n = fn_counts.get("definition", 0)
    table_n = fn_counts.get("table_page", 0)
    formula_n = fn_counts.get("formula_page", 0)
    # short/title-only density heuristic from html sections
    short = 0
    for m in re.finditer(r"<section\b([^>]*)>([\s\S]*?)</section>", ht, re.I):
        body = re.sub(r"<[^>]+>", " ", m.group(2))
        c = len(re.findall(r"[\u4e00-\u9fff]", body))
        if c < 20:
            short += 1
    # lab richness
    lab_loc = lt.count("\n") + (1 if lt else 0)
    lab_draw = sum(lt.count(x) for x in ("beginPath", "stroke", "fillRect", "arc(", "fillText"))
    # scoring dimensions 0-5 rough
    # content depth: cn per planned hour-ish + derives/defs
    hours_map = {"计入1.1": 1, "4": 4, "8": 8, "6": 6, "2": 2, "3": 3, "7": 7, "新增": 3}
    hours = hours_map[info["hours"]]
    dens = cn / max(hours, 1)
    interact = range_n + len(canvas_ids)
    pedagogy = culture_n + mistake_n + prompt_n + n_ans
    structure = n_sec_start + (1 if fn_counts.get("route") else 0) + (1 if fn_counts.get("objectives") else 0) + (1 if fn_counts.get("summary") else 0)
    quiz_div = len(topics)

    profiles.append({
        "code": code,
        **info,
        "hours_num": hours,
        "n_sec": n_sec,
        "cn": cn,
        "cn_per_hour": round(dens),
        "cn_per_sec": round(cn / max(n_sec, 1), 1),
        "short_sec": short,
        "short_ratio": round(short / max(n_sec, 1), 3),
        "answers": n_ans,
        "hooks": n_hook,
        "sections": n_sec_start,
        "canvas": len(canvas_ids),
        "canvas_ids": canvas_ids,
        "ranges": range_n,
        "lab_n": lab_n,
        "lab_loc": lab_loc,
        "lab_draw": lab_draw,
        "culture": culture_n,
        "mistake": mistake_n,
        "derive": derive_n,
        "prompt": prompt_n,
        "definition": def_n,
        "table": table_n,
        "formula": formula_n,
        "quiz_n": nq,
        "quiz_topics": dict(topics),
        "quiz_topic_n": quiz_div,
        "fn_counts": {k: v for k, v in fn_counts.items() if v},
        "build_loc": bt.count("\n") + (1 if bt else 0),
        "html_kb": round(len(ht) / 1024, 1),
    })

# composite scores (relative, not absolute truth)
# normalize each dim to 0-100 by max
dims = ["cn_per_hour", "cn_per_sec", "answers", "hooks", "canvas", "ranges",
        "lab_loc", "culture", "mistake", "derive", "prompt", "quiz_topic_n"]
# invert short_ratio later
maxv = {d: max(p[d] for p in profiles) or 1 for d in dims}
max_short = max(p["short_ratio"] for p in profiles) or 1

for p in profiles:
    scores = {}
    for d in dims:
        scores[d] = round(100 * p[d] / maxv[d])
    scores["low_short"] = round(100 * (1 - p["short_ratio"] / max_short))
    # weighted overall
    w = {
        "cn_per_hour": 0.10,
        "cn_per_sec": 0.08,
        "answers": 0.10,
        "hooks": 0.08,
        "canvas": 0.10,
        "ranges": 0.08,
        "lab_loc": 0.10,
        "culture": 0.08,
        "mistake": 0.08,
        "derive": 0.06,
        "prompt": 0.06,
        "quiz_topic_n": 0.04,
        "low_short": 0.04,
    }
    overall = sum(scores[k] * w[k] for k in w)
    p["scores"] = scores
    p["overall"] = round(overall, 1)

profiles.sort(key=lambda x: -x["overall"])
out = root / "_build" / "_quality_profile.json"
out.write_text(json.dumps(profiles, ensure_ascii=False, indent=2), encoding="utf-8")

print("code\trank\tscore\tcn/h\tcn/s\tshort%\tcvs\trng\tlabLOC\tcult\tmist\tder\tprompt\tans\thook\ttopics")
for i, p in enumerate(profiles, 1):
    print(
        f"{p['code']}\t{i}\t{p['overall']}\t{p['cn_per_hour']}\t{p['cn_per_sec']}\t"
        f"{p['short_ratio']}\t{p['canvas']}\t{p['ranges']}\t{p['lab_loc']}\t"
        f"{p['culture']}\t{p['mistake']}\t{p['derive']}\t{p['prompt']}\t"
        f"{p['answers']}\t{p['hooks']}\t{p['quiz_topic_n']}"
    )
print("JSON", out)
