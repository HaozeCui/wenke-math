"""把一份试卷写成学生卷、教师卷的 XeLaTeX。"""
from __future__ import annotations

from pathlib import Path

from core import Paper

PREAMBLE = r"""
\documentclass[10pt,a4paper,fontset=windows]{ctexart}
\usepackage{amsmath,amssymb,mathtools}
\usepackage{geometry}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{multicol}
\geometry{a4paper,margin=1.45cm,headheight=20pt,top=1.85cm,bottom=1.45cm}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small 文科高等数学\quad __TITLE__}
\fancyhead[R]{\small __ROLE__\quad __PART__}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\setlist[enumerate]{leftmargin=1.7em,itemsep=0.55em,topsep=0.3em,parsep=0pt}
\setlist[itemize]{leftmargin=1.15em,itemsep=0.12em,topsep=0.15em,parsep=0pt}
\setlength{\columnsep}{0.7cm}
\emergencystretch=2em
\hbadness=10000
\newcommand{\examtitle}[1]{%
  \begin{center}
  {\LARGE __TITLE__}\\[0.25em]
  {\large #1}\\[0.2em]
  {\normalsize 文科高等数学\quad 南开大学数学科学学院}
  \end{center}
  \vspace{-0.4em}\noindent\rule{\textwidth}{0.5pt}\vspace{0.45em}
}
\begin{document}
""".lstrip()


def _choice(s: str) -> str:
    if any("\u4e00" <= ch <= "\u9fff" for ch in s) or r"\(" in s:
        return s
    return r"\(" + s + r"\)"


def _letter(i: int) -> str:
    return "ABCD"[i]


def render(paper: Paper, role: str) -> str:
    teacher = role == "teacher"
    role_name = "教师卷" if teacher else "学生卷"
    parts = [
        PREAMBLE.replace("__TITLE__", paper.title).replace("__ROLE__", role_name).replace("__PART__", "课堂测验")
    ]
    banner = "课堂测验与作业\\quad 教师卷（含答案，请勿发给学生）" if teacher else "课堂测验与作业\\quad 学生卷"
    parts.append(r"\examtitle{" + banner + "}\n")
    if teacher:
        parts.append(r"\noindent 教师卷仅供批改。选择题附一行解析，作业附过程与结果。\par\vspace{0.4em}" + "\n")
    parts.append(r"{\Large\bfseries 一、课堂测验}\par" + "\n")
    parts.append(r"\noindent 共 100 题，每题只有一个正确选项。\par\vspace{0.45em}" + "\n")
    if teacher:
        parts.append(_key(paper))
    if paper.quiz_columns == 2:
        parts.append("\\begin{multicols}{2}\n\\raggedcolumns\n\\raggedright\n")
    parts.append("\\begin{enumerate}[label=\\arabic*.]\n")
    for q in paper.mcqs:
        # 整题放进不可拆开的盒子，避免题干留在栏底、选项跑到下一栏。
        parts.append("\\item \\begin{minipage}[t]{\\linewidth}\n")
        parts.append(q.stem + "\\par\n")
        parts.append("\\begin{enumerate}[label=\\Alph*.,leftmargin=1.45em,itemsep=0.04em,topsep=0.08em]\n")
        for c in q.choices:
            parts.append("\\item " + _choice(c) + "\n")
        parts.append("\\end{enumerate}\n")
        if teacher:
            parts.append(
                r"{\small \textbf{答案 "
                + _letter(q.answer)
                + r".}\ "
                + q.explain
                + r"\par}"
                + "\n"
            )
        parts.append("\\end{minipage}\\par\\vspace{0.28em}\n")
    parts.append("\\end{enumerate}\n")
    if paper.quiz_columns == 2:
        parts.append("\\end{multicols}\n")
    parts.append("\\clearpage\n")
    parts.append(r"\fancyhead[R]{\small " + role_name + r"\quad 作业}" + "\n")
    parts.append(r"{\Large\bfseries 二、作业}\par" + "\n")
    if teacher:
        parts.append(r"\noindent 共 20 题。下面给出过程，批改时对照步骤，不要求学生字句相同。\par\vspace{0.4em}" + "\n")
    else:
        parts.append(r"\noindent 共 20 题。写出主要步骤；只写最后结果不得分。\par\vspace{0.4em}" + "\n")
    parts.append("\\begin{enumerate}[label=\\arabic*.]\n")
    for h in paper.hws:
        parts.append("\\item " + h.stem + "\n")
        if teacher:
            parts.append("\\begin{itemize}\n")
            for step in h.steps:
                parts.append("\\item " + step + "\n")
            parts.append("\\end{itemize}\n")
            parts.append(r"\noindent\textbf{结果}\enspace " + h.answer + r"\par\vspace{0.35em}" + "\n")
        else:
            parts.append(r"\par\vspace{" + h.space + "}\n")
    parts.append("\\end{enumerate}\n")
    parts.append(r"\end{document}" + "\n")
    return "".join(parts)


def _key(paper: Paper) -> str:
    lines = [r"\noindent\textbf{选择题答案速查}\par\vspace{0.25em}", r"\begin{center}\small"]
    rows = []
    for i in range(0, 100, 10):
        cells = [f"{i+j+1}.{_letter(paper.mcqs[i+j].answer)}" for j in range(10)]
        rows.append(" & ".join(cells) + r" \\")
    lines.append(r"\begin{tabular}{@{}*{10}{c}@{}}")
    lines.extend(rows)
    lines.append(r"\end{tabular}\end{center}\vspace{0.2em}")
    return "\n".join(lines) + "\n"


def write_pair(paper: Paper, tex_dir: Path) -> tuple[Path, Path]:
    tex_dir.mkdir(parents=True, exist_ok=True)
    stu = tex_dir / f"lec{paper.code}-student.tex"
    tea = tex_dir / f"lec{paper.code}-teacher.tex"
    stu.write_text(render(paper, "student"), encoding="utf-8")
    tea.write_text(render(paper, "teacher"), encoding="utf-8")
    return stu, tea
