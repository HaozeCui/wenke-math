"""把各讲单选题导出为网页自测数据 web/js/quiz/<讲>.js。

按知识点轮流抽题，使每轮随机抽到的题覆盖面较均匀。用法：
    python export_web.py            # 全部讲
    python export_web.py 16 22      # 指定讲
"""
from __future__ import annotations

import importlib
import json
import sys
from collections import OrderedDict
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parents[1] / "js" / "quiz"
sys.path.insert(0, str(HERE))

CODES = ["00", "11", "12", "13", "14", "15", "16", "17", "18", "21", "22", "23", "24"]
PER_LECTURE = 40


def balanced(mcqs, limit: int):
    groups: OrderedDict[str, list] = OrderedDict()
    for q in mcqs:
        groups.setdefault(q.topic, []).append(q)
    out = []
    while len(out) < limit and any(groups.values()):
        for g in groups.values():
            if g and len(out) < limit:
                out.append(g.pop(0))
    return out


def export(code: str) -> int:
    paper = importlib.import_module(f"lec{code}").build()
    items = [
        {"stem": q.stem, "choices": q.choices, "answer": q.answer, "explain": q.explain, "topic": q.topic}
        for q in balanced(paper.mcqs, PER_LECTURE)
    ]
    OUT.mkdir(parents=True, exist_ok=True)
    data = json.dumps(items, ensure_ascii=False, indent=0)
    (OUT / f"{code}.js").write_text(
        f"window.QUIZ = window.QUIZ || {{}};\nwindow.QUIZ[{json.dumps(code)}] = {data};\n",
        encoding="utf-8",
    )
    return len(items)


def main(argv: list[str]) -> None:
    for code in argv or CODES:
        print(code, export(code))


if __name__ == "__main__":
    main(sys.argv[1:])
