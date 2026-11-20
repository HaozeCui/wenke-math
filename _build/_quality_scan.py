# -*- coding: utf-8 -*-
import re, json
from pathlib import Path
from collections import Counter

root = Path(__file__).resolve().parents[1]
lectures = sorted((root / "lectures").glob("*.html"))
quiz_dir = root / "js" / "quiz"
labs_dir = root / "js" / "labs"

KIND_RE = re.compile(r'data-kind="([^"]+)"')
ROLE_RE = re.compile(r'data-role="([^"]+)"')
SECTION_RE = re.compile(r"<section\b([^>]*)>", re.I)
CLASS_RE = re.compile(r'class="([^"]*)"')
HOOK_RE = re.compile(r'data-hook="([^"]*)"')
SEC_START_RE = re.compile(r'data-sec-start="([^"]*)"')
TITLE_RE = re.compile(r"<h[12][^>]*>(.*?)</h[12]>", re.S)
SCRIPT_SRC_RE = re.compile(r'<script[^>]+src="([^"]+)"')
RANGE_RE = re.compile(r'<input[^>]*type="range"', re.I)
CANVAS_RE = re.compile(r"<canvas\b", re.I)
SVG_RE = re.compile(r"<svg\b", re.I)
FRAGMENT_RE = re.compile(r'class="[^"]*\bfragment\b')
STEP_RE = re.compile(r'data-step=|\bstep-')
EQ_RE = re.compile(r'class="eq"|data-tex=|\\\\frac|\\\\int|\\\\lim|\\\\sum|\\\\det|\\\\begin')
EXAMPLE_RE = re.compile(r"例[：:\d一二三四五六七八九十]|例题|例子")
WARN_RE = re.compile(r"易错|注意|陷阱|常见错误|误区|别忘")
SUMMARY_RE = re.compile(r"小结|总结|本讲要点|回顾")
CALLOUT_RE = re.compile(r"callout|gold-rule|kicker|badge")
FIG_RE = re.compile(r'data-fig=|class="[^"]*\bfig\b|class="[^"]*\bpanel\b')
TEACHER_RE = re.compile(r"teacher-note|data-teacher|教师备注|notes-only", re.I)
ANSWER_RE = re.compile(r'data-kind="answer"')
QUIZ_BLOCK_RE = re.compile(r'data-quiz=|class="[^"]*\bquiz\b')
CN_RE = re.compile(r"[\u4e00-\u9fff]")
LAB_MARK_RE = re.compile(r'class="[^"]*\blab\b|data-lab=', re.I)
GRID_RE = re.compile(r'class="[^"]*\bgrid-[23]\b|class="[^"]*\bsplit\b')
CARD_RE = re.compile(r'class="[^"]*\bcard\b')
TIMER_RE = re.compile(r"课堂练|计时|data-timer|timer")
HUMANITIES_RE = re.compile(r"人文|历史|故事|悖论|投票|人口|碳-?14|PageRank|录取|贴现|黄金分割|列昂惕夫|舒芙蕾|圆桶|电价|词袋")


def strip_tags(html: str) -> str:
    text = re.sub(r"<script[\s\S]*?</script>", " ", html)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


rows = []
for p in lectures:
    html = p.read_text(encoding="utf-8")
    code = p.stem
    kinds = Counter(KIND_RE.findall(html))
    roles = Counter(ROLE_RE.findall(html))
    sections = SECTION_RE.findall(html)
    n_section = len(sections)
    extra = Counter()
    for attrs in sections:
        cm = CLASS_RE.search(attrs)
        if cm:
            for c in cm.group(1).split():
                if c != "slide":
                    extra[c] += 1
    hooks = HOOK_RE.findall(html)
    sec_starts = SEC_START_RE.findall(html)
    titles = [re.sub(r"<[^>]+>", "", t).strip() for t in TITLE_RE.findall(html)]
    scripts = SCRIPT_SRC_RE.findall(html)
    labs_js = [s for s in scripts if "/labs/" in s]
    quiz_js = [s for s in scripts if "/quiz/" in s]

    text = strip_tags(html)
    cn_chars = len(CN_RE.findall(text))

    qf = quiz_dir / f"{code}.js"
    quiz_bytes = qf.stat().st_size if qf.exists() else 0
    quiz_q_count = 0
    if qf.exists():
        qtxt = qf.read_text(encoding="utf-8")
        # common patterns: items arrays / objects with stem/prompt
        quiz_q_count = len(re.findall(r"\bstem\b|\bprompt\b|\bquestion\b", qtxt))
        if quiz_q_count == 0:
            quiz_q_count = len(re.findall(r"choices\s*:", qtxt))

    lab_files = sorted(list(labs_dir.glob(f"{code}-*.js")) + list(labs_dir.glob(f"{code}_*.js")))
    lab_bytes = sum(f.stat().st_size for f in lab_files)

    bp = root / "_build" / f"lec{code}.py"
    build_bytes = bp.stat().st_size if bp.exists() else 0

    rows.append(
        {
            "code": code,
            "n_section": n_section,
            "kinds": dict(kinds),
            "roles": dict(roles),
            "extra_classes": extra.most_common(10),
            "n_hooks": len(hooks),
            "hooks": hooks[:12],
            "n_sec_start": len(sec_starts),
            "sec_starts": sec_starts,
            "n_fragment": len(FRAGMENT_RE.findall(html)),
            "n_step": len(STEP_RE.findall(html)),
            "n_range": len(RANGE_RE.findall(html)),
            "n_canvas": len(CANVAS_RE.findall(html)),
            "n_svg": len(SVG_RE.findall(html)),
            "n_eq": len(EQ_RE.findall(html)),
            "n_example": len(EXAMPLE_RE.findall(html)),
            "n_warn": len(WARN_RE.findall(html)),
            "n_summary": len(SUMMARY_RE.findall(html)),
            "n_callout": len(CALLOUT_RE.findall(html)),
            "n_fig": len(FIG_RE.findall(html)),
            "n_teacher": len(TEACHER_RE.findall(html)),
            "n_answer": len(ANSWER_RE.findall(html)),
            "n_quiz_block": len(QUIZ_BLOCK_RE.findall(html)),
            "n_lab_mark": len(LAB_MARK_RE.findall(html)),
            "n_grid": len(GRID_RE.findall(html)),
            "n_card": len(CARD_RE.findall(html)),
            "n_timer": len(TIMER_RE.findall(html)),
            "n_humanities": len(HUMANITIES_RE.findall(html)),
            "cn_chars": cn_chars,
            "html_kb": round(len(html) / 1024, 1),
            "build_kb": round(build_bytes / 1024, 1),
            "quiz_kb": round(quiz_bytes / 1024, 1),
            "quiz_exists": qf.exists(),
            "quiz_q_count": quiz_q_count,
            "lab_files": [f.name for f in lab_files],
            "lab_kb": round(lab_bytes / 1024, 1),
            "labs_js": labs_js,
            "quiz_js": quiz_js,
            "titles_head": titles[:10],
            "titles_count": len(titles),
        }
    )

out = root / "_build" / "_quality_scan.json"
out.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")

# compact table
print("code\tsec\tcn\thtmlKB\tbuildKB\tquizKB\tlabKB\tcvs\trange\tans\thook\tsecStart\tex\twarn\thum\tqQs")
for r in rows:
    print(
        f"{r['code']}\t{r['n_section']}\t{r['cn_chars']}\t{r['html_kb']}\t{r['build_kb']}\t"
        f"{r['quiz_kb']}\t{r['lab_kb']}\t{r['n_canvas']}\t{r['n_range']}\t{r['n_answer']}\t"
        f"{r['n_hooks']}\t{r['n_sec_start']}\t{r['n_example']}\t{r['n_warn']}\t{r['n_humanities']}\t{r['quiz_q_count']}"
    )
print("JSON", out)
