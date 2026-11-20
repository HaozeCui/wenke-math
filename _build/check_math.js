// 离线检查讲义公式：node check_math.js 17.html [18.html ...]；不给参数则查全部。
// 按 KaTeX auto-render 的分隔符逐页提取公式，用 throwOnError 渲染，报出页标题与错误。
const fs = require("fs");
const path = require("path");
const katex = require("../vendor/katex/katex.min.js");

const LEC = path.join(__dirname, "..", "lectures");
const DELIMS = [
  ["$$", "$$", true],
  ["\\[", "\\]", true],
  ["\\(", "\\)", false],
  ["$", "$", false],
];

function decode(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

function scan(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    let hit = null;
    for (const [l, r, disp] of DELIMS) {
      if (text.startsWith(l, i)) { hit = [l, r, disp]; break; }
    }
    if (!hit) { i++; continue; }
    const [l, r, disp] = hit;
    const j = text.indexOf(r, i + l.length);
    if (j < 0) { out.push({ err: `未闭合的 ${l}`, src: text.slice(i, i + 60) }); break; }
    out.push({ tex: text.slice(i + l.length, j), disp });
    i = j + r.length;
  }
  return out;
}

let bad = 0;
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(LEC).filter((f) => f.endsWith(".html"));
for (const f of files) {
  const html = fs.readFileSync(path.join(LEC, f), "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  const parts = html.split(/<section\b/).slice(1);
  let n = 0;
  for (const p of parts) {
    const title = (p.match(/data-title="([^"]*)"/) || [, "?"])[1];
    const body = decode(p.replace(/^[^>]*>/, "").replace(/<\/?[a-zA-Z][^>]*>/g, " "));
    for (const m of scan(body)) {
      if (m.err) { console.log(`${f} [${title}] ${m.err}: ${m.src}`); bad++; continue; }
      n++;
      try {
        katex.renderToString(m.tex, { displayMode: m.disp, throwOnError: true, strict: "ignore" });
      } catch (e) {
        console.log(`${f} [${title}] ${e.message.split("\n")[0]}\n    ${m.tex.slice(0, 120)}`);
        bad++;
      }
    }
  }
  console.log(`${f}: ${n} 处公式`);
}
console.log("bad", bad);
process.exit(bad ? 1 : 0);
