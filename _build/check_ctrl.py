from pathlib import Path
web = Path(__file__).resolve().parents[1] / "lectures"
n = 0
for p in sorted(web.glob("*.html")):
    t = p.read_text(encoding="utf-8")
    for i, ch in enumerate(t):
        if ord(ch) < 32 and ch not in "\n\r":
            print(p.name, hex(ord(ch)))
            n += 1
print("ctrl", n)
raise SystemExit(n)
