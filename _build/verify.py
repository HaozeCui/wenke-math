from pathlib import Path
import re

web = Path(__file__).resolve().parents[1]
lecs = sorted((web / "lectures").glob("*.html"))
need = {
    "00.html": ["simpson-canvas", "aw", "am", "bw", "bm"],
    "11.html": ["pw-canvas", "floor-canvas", "compose-canvas", "fee-canvas", "elem-canvas",
                "odd-canvas", "inv-canvas", 'data-quiz="11"', "data-sec-start", "quiz/11.js"],
    "12.html": ["seq-canvas", "lr-canvas", "sq-canvas", "phi-canvas",
                'data-quiz="12"', "data-sec-start", "quiz/12.js"],
    "13.html": ["secant-canvas", "corner-canvas", "ap-canvas", 'data-quiz="13"',
                "data-sec-start", "quiz/13.js"],
    "14.html": ["mono-canvas", "barrel-canvas", "m14-canvas", "vert-canvas", "hole-canvas", "cv-canvas",
                "sec2-canvas", "cusp-canvas", "box-canvas", 'data-quiz="14"', "data-sec-start", "quiz/14.js", "figs.js"],
    "15.html": ["family-canvas", "twin-canvas", "diffback-canvas", 'data-quiz="15"', "data-sec-start", "quiz/15.js"],
    "16.html": ["riemann-canvas", "signed-canvas", "riemann-play", "accum-canvas", "improper-canvas",
                "surplus-canvas", 'data-quiz="16"', 'data-fig="sinsym"', 'data-fig="lorenz"', 'data-fig="inv2"',
                "data-sec-start", "quiz/16.js", "figs.js"],
    "17.html": ["region-canvas", "log-canvas", "learn-canvas", "pop-canvas",
                'data-quiz="17"', "data-sec-start", "quiz/17.js", "figs.js"],
    "18.html": ["paths-canvas", "slice-canvas", "strips-canvas", "th1", "th2", "rad",
                "dom2-canvas", "pdmap-canvas", "trix-canvas",
                'data-quiz="18"', "data-sec-start", "quiz/18.js", "figs.js"],
    "21.html": ["sarrus-canvas", "det-area-canvas", 'data-quiz="21"', "data-sec-start",
                "quiz/21.js", "figs.js", 'data-fig="21-tri"'],
    "22.html": ["mm-canvas", "abba-canvas", "lin-canvas", 'data-quiz="22"', "data-sec-start",
                "quiz/22.js"],
    "23.html": ["planes-canvas", "io-canvas", 'data-quiz="23"', "data-sec-start",
                "quiz/23.js"],
    "24.html": ["bow-canvas", "cosine-canvas", "pr-canvas", "pr-play", "pr-step", "docsim-canvas",
                'data-quiz="24"', "data-sec-start", "quiz/24.js", "figs.js"],
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
