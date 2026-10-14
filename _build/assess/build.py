"""生成并编译十三讲的学生卷、教师卷。"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUT = ROOT / "试卷"
TEX = OUT / "_tex"
XELATEX = r"C:\Users\Wei\AppData\Local\Programs\MiKTeX\miktex\bin\x64\xelatex.exe"

sys.path.insert(0, str(HERE))

from core import self_test, validate  # noqa: E402
from emit import write_pair  # noqa: E402


def _load(codes: list[str]):
    out = {}
    for code in codes:
        mod = __import__("lec" + code)
        out[code] = mod.build
    return out


def compile_tex(tex_path: Path) -> None:
    cmd = [
        XELATEX,
        "-interaction=nonstopmode",
        "-halt-on-error",
        "--enable-installer",
        tex_path.name,
    ]
    proc = subprocess.run(cmd, cwd=tex_path.parent, capture_output=True)
    log = tex_path.with_suffix(".log")
    if proc.returncode != 0:
        tail = ""
        if log.exists():
            text = log.read_text(encoding="utf-8", errors="replace")
            tail = "\n".join(text.splitlines()[-40:])
        raise RuntimeError(f"编译失败 {tex_path.name}\n{tail}")


def overfull_count(tex_path: Path) -> int:
    log = tex_path.with_suffix(".log")
    if not log.exists():
        return 0
    text = log.read_text(encoding="utf-8", errors="replace")
    return text.count("Overfull")


def build_codes(codes: list[str], do_compile: bool = True) -> None:
    self_test()
    builders = _load(codes)
    OUT.mkdir(parents=True, exist_ok=True)
    TEX.mkdir(parents=True, exist_ok=True)
    for code in codes:
        paper = builders[code]()
        validate(paper)
        stu, tea = write_pair(paper, TEX)
        print(f"{code} 题库通过：{paper.filename}")
        if not do_compile:
            continue
        for tex, role in ((stu, "学生"), (tea, "教师")):
            compile_tex(tex)
            pdf = tex.with_suffix(".pdf")
            dest = OUT / f"{paper.filename}-{role}.pdf"
            shutil.copyfile(pdf, dest)
            n = overfull_count(tex)
            print(f"  {dest.name}  overfull={n}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args == ["all"]:
        codes = ["00", "11", "12", "13", "14", "15", "16", "17", "18", "21", "22", "23", "24"]
    else:
        codes = args
    build_codes(codes)
