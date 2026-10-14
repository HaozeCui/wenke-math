"""扫描讲义里未包进数学模式的 ^ 下标，以及可能未闭合的 $。"""
from __future__ import annotations

import re
from pathlib import Path

WEB = Path(__file__).resolve().parents[1]
MATH = re.compile(r"\$\$[\s\S]+?\$\$|\$[^$]+\$")
BARE = re.compile(r"(?<![\\$])\b[A-Za-z]\\^\{?-1\}?|(?<![\\$])\([A-Z]{1,3}\)\\^\{?-1\}")


def strip_math(s: str) -> str:
    return MATH.sub(" ", s)


def main() -> int:
    bad = 0
    for p in sorted((WEB / "lectures").glob("*.html")):
        t = p.read_text(encoding="utf-8")
        body = re.sub(r"<script[\s\S]+?</script>", " ", t)
        body = re.sub(r'data-notes="[^"]*"', " ", body)
        plain = strip_math(body)
        odds = []
        if plain.count("$") % 2:
            odds.append("unbalanced $")
        for m in re.finditer(r"(?<![A-Za-z\\])[A-Za-z]\\^\{-1\}", plain):
            odds.append(f"bare A^{-1}: {m.group(0)}")
        for m in re.finditer(r"\([AB]{1,2}\)\\^\{-1\}", plain):
            odds.append(f"bare (AB)^{-1}: {m.group(0)}")
        if "katex-error" in t:
            odds.append("prebaked katex-error")
        if odds:
            print(p.name, odds)
            bad += len(odds)
        else:
            print(p.name, "ok")
    print("issues", bad)
    return bad


if __name__ == "__main__":
    raise SystemExit(main())
