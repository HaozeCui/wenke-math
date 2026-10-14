from pathlib import Path
import re

web = Path(__file__).resolve().parents[1]
lecs = sorted((web / "lectures").glob("*.html"))
need = {
    "00.html": ["simpson-canvas", "aw", "am", "bw", "bm"],
    "11.html": ["pw-canvas", "floor-canvas", "compose-canvas"],
    "12.html": ["seq-canvas", "lr-canvas", "sq-canvas"],
    "13.html": ["secant-canvas", "corner-canvas"],
    "14.html": ["mono-canvas", "barrel-canvas"],
    "15.html": ["family-canvas"],
    "16.html": ["riemann-canvas", "signed-canvas", "riemann-play"],
    "17.html": ["region-canvas", "log-canvas"],
    "18.html": ["paths-canvas", "slice-canvas", "strips-canvas", "th1", "th2", "rad"],
    "21.html": ["sarrus-canvas"],
    "22.html": ["mm-canvas", "abba-canvas"],
    "23.html": ["planes-canvas", "io-canvas"],
    "24.html": ["bow-canvas", "cosine-canvas", "pr-canvas", "pr-play", "pr-step"],
}
bad = 0
for p in lecs:
    t = p.read_text(encoding="utf-8")
    if re.search(r"https?://", t):
        print("URL", p.name)
        bad += 1
    if "type=\"module\"" in t:
        print("module", p.name)
        bad += 1
    ans = t.count('data-kind="answer"')
    hooks = t.count("data-hook=")
    print(f"{p.name}: answers={ans} hooks={hooks}")
    if ans < 2:
        print("  too few answers")
        bad += 1
    for nid in need.get(p.name, []):
        if nid not in t:
            print("  MISSING", nid)
            bad += 1
hub = (web / "index.html").read_text(encoding="utf-8")
assert "lectures/16.html" in hub
assert "hub-q" in hub
assert "deck.js" not in hub
assert not (web / "js" / "riemann.js").exists()
print("labs", sorted(x.name for x in (web / "js" / "labs").glob("*.js")))
print("bad", bad)
raise SystemExit(bad)
