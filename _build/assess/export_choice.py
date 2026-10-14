"""把选择题导出为文本题库。公式用 $$...$$。"""
from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE))

from core import Paper  # noqa: E402

LETTERS = "ABCD"

TOPIC_NAME = {
    "domain": "定义域",
    "piecewise": "分段函数",
    "floor": "取整函数",
    "comp": "复合函数",
    "parity": "奇偶性",
    "period": "周期",
    "interval": "区间",
    "relation": "函数概念",
}


def dollars(s: str) -> str:
    return s.replace(r"\(", "$$").replace(r"\)", "$$")


def choice_text(s: str) -> str:
    s = dollars(s).strip()
    if "$" in s or any("\u4e00" <= ch <= "\u9fff" for ch in s):
        return s
    return f"$${s}$$"


def render_mcqs(paper: Paper, points: int = 1) -> str:
    blocks = []
    for q in paper.mcqs:
        stem = dollars(q.stem).strip().replace("设 当 ", "当 ")
        lines = [f"【单选题】{stem}（{points}分）"]
        for i, c in enumerate(q.choices):
            lines.append(f"{LETTERS[i]}.{choice_text(c)}")
        lines.append(f"正确答案：{LETTERS[q.answer]}")
        lines.append("答案解析：" + dollars(q.explain).strip())
        lines.append("难度：1")
        lines.append("知识点：" + TOPIC_NAME.get(q.topic, q.topic))
        lines.append("标签：" + paper.title)
        blocks.append("\n".join(lines))
    return "\n\n".join(blocks) + "\n"


def main() -> None:
    import lec11

    paper = lec11.build()
    out = ROOT / "试卷" / "11-函数-单选题.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    text = render_mcqs(paper)
    out.write_text(text, encoding="utf-8")
    print(out)
    print("questions", text.count("【单选题】"))


if __name__ == "__main__":
    main()
