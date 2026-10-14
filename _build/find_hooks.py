from pathlib import Path
import re
t = Path(r"E:/所有课程/文科高等数学/web/lectures/24.html").read_text(encoding="utf-8")
secs = list(re.finditer(r"<section class=\"slide", t))
print("n", len(secs))
for i, m in enumerate(secs, 1):
    chunk = t[m.start() : m.start() + 220].replace("\n", " ")
    if "hook" in chunk or "kind" in chunk:
        print(i, chunk[:180])
