/* 2.4 数据科学：词袋、余弦、PageRank */
(function () {
  const vocab = ["知", "之", "为", "不", "温", "故", "而", "新", "学", "时", "习"];
  const docs = [
    { name: "知之为知之", v: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "温故而知新", v: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0] },
    { name: "学而时习之", v: [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1] },
    { name: "不亦说乎", v: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] },
  ];

  Deck.on("bow", (slide) => {
    const canvas = slide.querySelector("#bow-canvas");
    const read = slide.querySelector("#bow-read");
    function render() {
      const sel = Number(slide.dataset.row || 0);
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card;
      ctx.fillRect(0, 0, w, h);
      const l = 176, t = 44, cellW = (w - l - 16) / vocab.length, cellH = (h - t - 28) / docs.length;
      vocab.forEach((ch, j) => {
        ctx.fillStyle = Plot.C.muted;
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "center";
        ctx.fillText(ch, l + (j + 0.5) * cellW, 22);
      });
      docs.forEach((d, i) => {
        ctx.textAlign = "right";
        ctx.fillStyle = i === sel ? Plot.C.burgundy : Plot.C.ink;
        ctx.fillText(d.name, l - 8, t + (i + 0.6) * cellH);
        d.v.forEach((val, j) => {
          const a = val === 0 ? 0.06 : 0.18 + 0.35 * val;
          ctx.fillStyle = `rgba(107,20,86,${a})`;
          ctx.fillRect(l + j * cellW + 1, t + i * cellH + 2, cellW - 2, cellH - 4);
          ctx.fillStyle = val ? Plot.C.paper : Plot.C.muted;
          ctx.textAlign = "center";
          ctx.fillText(String(val), l + (j + 0.5) * cellW, t + (i + 0.62) * cellH);
        });
      });
      read.textContent = docs[sel].name + "  =  (" + docs[sel].v.join(", ") + ")";
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    canvas.onclick = (e) => {
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      const t = 44, cellH = (r.height - t - 28) / docs.length;
      const i = Math.max(0, Math.min(3, Math.floor((y - t) / cellH)));
      slide.dataset.row = String(i);
      render();
    };
    render();
  });

  function mag(u) { return Math.hypot(...u); }
  function dot(u, v) { return u.reduce((s, a, i) => s + a * v[i], 0); }

  Deck.on("cosine", (slide) => {
    const canvas = slide.querySelector("#cosine-canvas");
    const aEl = slide.querySelector("#cos-a");
    const read = slide.querySelector("#cos-read");
    const verdict = slide.querySelector("#cos-verdict");
    function render() {
      const th = (Number(aEl.value) * Math.PI) / 180;
      const u = [2, 1], v = [Math.cos(th) * Math.sqrt(5), Math.sin(th) * Math.sqrt(5)];
      const c = dot(u, v) / (mag(u) * mag(v));
      slide.querySelector("#cos-a-val").textContent = aEl.value + "°";
      read.textContent = `cos = ${c.toFixed(3)}`;
      verdict.textContent = c > 0.85 ? "方向很靠近：长短不同也可以「像」。" : c > 0.2 ? "有夹角。余弦看方向，不看文章长短。" : "几乎垂直：共享的方向很少。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.4, xMax: 3.2, yMin: -0.4, yMax: 3.2, xlabel: "x1", ylabel: "x2" });
      ctx.strokeStyle = Plot.C.burgundy; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(xOf(0), yOf(0)); ctx.lineTo(xOf(u[0]), yOf(u[1])); ctx.stroke();
      ctx.strokeStyle = Plot.C.gold;
      ctx.beginPath(); ctx.moveTo(xOf(0), yOf(0)); ctx.lineTo(xOf(v[0]), yOf(v[1])); ctx.stroke();
      Plot.disc(ctx, xOf(u[0]), yOf(u[1]), 5, Plot.C.burgundy);
      Plot.disc(ctx, xOf(v[0]), yOf(v[1]), 5, Plot.C.gold);
      Plot.label(ctx, "u", xOf(u[0]) + 6, yOf(u[1]) - 6);
      Plot.label(ctx, "v", xOf(v[0]) + 6, yOf(v[1]) - 6);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    aEl.oninput = render;
    render();
  });

  const names = ["A", "B", "C", "D"];
  const P = [
    [0, 0, 0.5, 0.25],
    [1, 0, 0, 0.25],
    [0, 1, 0, 0.25],
    [0, 0, 0.5, 0.25],
  ];
  const edges = [[0, 1], [1, 2], [2, 0], [2, 3]];
  function mul(x) { return P.map((row) => row.reduce((s, a, j) => s + a * x[j], 0)); }
  function diff(a, b) { return Math.max(...a.map((v, i) => Math.abs(v - b[i]))); }
  function arrow(ctx, a, b, shrink) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L;
    const x1 = a[0] + ux * shrink, y1 = a[1] + uy * shrink;
    const x2 = b[0] - ux * shrink, y2 = b[1] - uy * shrink;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * ux + 5 * uy, y2 - 10 * uy - 5 * ux);
    ctx.lineTo(x2 - 10 * ux - 5 * uy, y2 - 10 * uy + 5 * ux);
    ctx.closePath(); ctx.fill();
  }
  function drawPR(canvas, x) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 80) return;
    ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
    const pos = [[w * 0.28, h * 0.28], [w * 0.72, h * 0.28], [w * 0.28, h * 0.72], [w * 0.72, h * 0.72]];
    ctx.strokeStyle = Plot.C.gold; ctx.fillStyle = Plot.C.gold; ctx.lineWidth = 2;
    edges.forEach(([i, j]) => arrow(ctx, pos[i], pos[j], 28));
    names.forEach((name, i) => {
      const r = 26 + 42 * x[i];
      ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], r, 0, Math.PI * 2);
      ctx.fillStyle = Plot.C.burgundy; ctx.fill();
      ctx.fillStyle = Plot.C.paper;
      ctx.font = `600 ${Math.round(24 + 12 * x[i])}px "Noto Serif SC", serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(name, pos[i][0], pos[i][1]);
      ctx.fillStyle = Plot.C.muted;
      ctx.font = "24px 'Noto Sans SC', sans-serif";
      ctx.fillText(x[i].toFixed(3), pos[i][0], pos[i][1] + r + 22);
    });
    ctx.textAlign = "left";
    Plot.label(ctx, "圆的大小 = 当前重要性", 16, 22, Plot.C.muted);
  }

  Deck.on("pagerank", (slide) => {
    const canvas = slide.querySelector("#pr-canvas");
    const bars = slide.querySelector("#pr-bars");
    const iterEl = slide.querySelector("#pr-iter");
    const verdict = slide.querySelector("#pr-verdict");
    if (slide.dataset.bound) { slide._redraw?.(); return; }
    slide.dataset.bound = "1";
    let x = [0.25, 0.25, 0.25, 0.25], k = 0, playing = false;
    function render() {
      iterEl.textContent = k;
      const max = Math.max(...x);
      bars.innerHTML = names.map((n, i) => {
        const ww = (x[i] / max) * 100;
        return `<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="width:1.2em;font-family:serif">${n}</span><div style="flex:1;height:10px;background:#e9dfcf"><div style="width:${ww}%;height:100%;background:#6b1456"></div></div><span style="width:4.2em;text-align:right;font-variant-numeric:tabular-nums">${x[i].toFixed(3)}</span></div>`;
      }).join("");
      drawPR(canvas, x);
      const d = diff(mul(x), x);
      verdict.className = "verdict " + (d < 0.002 && k > 0 ? "good" : "");
      verdict.textContent = k === 0
        ? "从「四页一样重要」出发。点一次迭代，看权重怎样顺着链接流动。"
        : d < 0.002
          ? "再迭代几乎不再变：这就是转移矩阵「方向不变」的那条向量。"
          : `本步最大变化 ${d.toFixed(4)}。被指得多的页会渐渐变大。`;
    }
    function step() { x = mul(x); k += 1; render(); }
    slide.querySelector("#pr-step").onclick = () => { playing = false; step(); };
    slide.querySelector("#pr-reset").onclick = () => { playing = false; x = [0.25, 0.25, 0.25, 0.25]; k = 0; render(); };
    slide.querySelector("#pr-play").onclick = () => {
      if (playing) { playing = false; return; }
      playing = true;
      const tick = () => {
        if (!playing) return;
        step();
        if (diff(mul(x), x) < 0.002) { playing = false; return; }
        setTimeout(tick, 420);
      };
      tick();
    };
    slide._redraw = render;
    render();
  });
})();
