/* 2.4 线性代数在数据科学中的应用：词袋、两两比较、余弦、PageRank */
(function () {
  const vocab = ["知", "之", "为", "不", "温", "故", "而", "新", "学", "时", "习"];
  const docs = [
    { name: "知之为知之", v: [2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "不知为不知", v: [2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
    { name: "温故而知新", v: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0] },
    { name: "学而时习之", v: [0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1] },
  ];

  function bind(slide, render, wire) {
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    wire();
    render();
  }

  /* 词袋：文档–词矩阵，点一行看这一句的向量 */
  Deck.on("bow", (slide) => {
    const canvas = slide.querySelector("#bow-canvas");
    const read = slide.querySelector("#bow-read");
    const verdict = slide.querySelector("#bow-verdict");
    const L = 176, T = 72;
    function render() {
      const sel = Number(slide.dataset.row || 0);
      const d = docs[sel];
      const nz = d.v.filter((a) => a).length;
      read.innerHTML = `文档 ${sel + 1}<small>(${d.v.join(", ")})</small>`;
      if (verdict) {
        verdict.textContent = `「${d.name}」五个字，落在 ${nz} 个位置上，其余 ${vocab.length - nz} 个位置是 0。分量加起来是 5：每个字都被数了一次。`;
      }
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card;
      ctx.fillRect(0, 0, w, h);
      const cellW = (w - L - 16) / vocab.length, cellH = (h - T - 20) / docs.length;
      ctx.textAlign = "center";
      vocab.forEach((ch, j) => {
        ctx.fillStyle = Plot.C.muted;
        ctx.font = "18px 'Noto Sans SC', sans-serif";
        ctx.fillText(String(j), L + (j + 0.5) * cellW, 22);
        ctx.fillStyle = Plot.C.ink;
        ctx.font = "26px 'Noto Serif SC', serif";
        ctx.fillText(ch, L + (j + 0.5) * cellW, 56);
      });
      docs.forEach((doc, i) => {
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "right";
        ctx.fillStyle = i === sel ? Plot.C.burgundy : Plot.C.ink;
        ctx.fillText(doc.name, L - 10, T + (i + 0.6) * cellH);
        doc.v.forEach((val, j) => {
          const a = val === 0 ? 0.06 : 0.25 + 0.3 * val;
          ctx.fillStyle = i === sel ? `rgba(107,20,86,${a})` : `rgba(106,88,88,${a * 0.7})`;
          ctx.fillRect(L + j * cellW + 1, T + i * cellH + 2, cellW - 2, cellH - 4);
          ctx.fillStyle = val ? Plot.C.paper : Plot.C.muted;
          ctx.textAlign = "center";
          ctx.fillText(String(val), L + (j + 0.5) * cellW, T + (i + 0.62) * cellH);
        });
      });
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(2, T + sel * cellH + 1, w - 4, cellH - 2);
      ctx.textAlign = "left";
    }
    bind(slide, render, () => {
      canvas.onclick = (e) => {
        const r = canvas.getBoundingClientRect();
        const cellH = (r.height - T - 20) / docs.length;
        const i = Math.floor((e.clientY - r.top - T) / cellH);
        if (i < 0 || i > 3) return;
        slide.dataset.row = String(i);
        render();
      };
    });
  });

  function mag(u) { return Math.hypot(...u); }
  function dot(u, v) { return u.reduce((s, a, i) => s + a * v[i], 0); }

  /* 四个文档两两比较：余弦 / 欧氏 / 曼哈顿 */
  const METRIC = {
    cos: { name: "余弦相似度", f: (u, v) => dot(u, v) / (mag(u) * mag(v)), lo: 0, hi: 1, closer: (a, b) => a > b },
    euc: { name: "欧氏距离", f: (u, v) => Math.hypot(...u.map((a, i) => a - v[i])), lo: 0, hi: 4, closer: (a, b) => a < b },
    man: { name: "曼哈顿距离", f: (u, v) => u.reduce((s, a, i) => s + Math.abs(a - v[i]), 0), lo: 0, hi: 10, closer: (a, b) => a < b },
  };
  const SQRT = { 0: "0", 8: "2\\sqrt2", 10: "\\sqrt{10}", 14: "\\sqrt{14}" };
  const COS = { 5: "\\tfrac59", 2: "\\tfrac{2}{3\\sqrt5}", 1: "\\tfrac15", 0: "0" };

  Deck.on("docsim", (slide) => {
    const canvas = slide.querySelector("#docsim-canvas");
    const read = slide.querySelector("#docsim-read");
    const verdict = slide.querySelector("#docsim-verdict");
    const btns = [...slide.querySelectorAll("[data-metric]")];
    const L = 210, T = 64;
    function render() {
      const key = slide.dataset.metric || "cos";
      const m = METRIC[key];
      const i0 = Number(slide.dataset.ci || 0), j0 = Number(slide.dataset.cj || 1);
      const u = docs[i0].v, v = docs[j0].v;
      const val = m.f(u, v);
      if (key === "cos") {
        const dp = dot(u, v);
        const exact = i0 === j0 ? "1" : (COS[dp] || val.toFixed(3));
        Plot.tex(read, `$\\cos=${exact}\\approx ${val.toFixed(3)}$<small>$x\\cdot y=${dp}$，$\\|x\\|=\\sqrt{${dot(u, u)}}$，$\\|y\\|=\\sqrt{${dot(v, v)}}$</small>`);
      } else if (key === "euc") {
        const s2 = Math.round(val * val);
        Plot.tex(read, `$d=${SQRT[s2] || "\\sqrt{" + s2 + "}"}\\approx ${val.toFixed(3)}$<small>$\\sum (x_i-y_i)^2=${s2}$</small>`);
      } else {
        Plot.tex(read, `$d=${val}$<small>$\\sum |x_i-y_i|=${val}$，逐位相减取绝对值再相加</small>`);
      }
      const pairs = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([i, j, m.f(docs[i].v, docs[j].v)]);
      pairs.sort((a, b) => (m.closer(a[2], b[2]) ? -1 : m.closer(b[2], a[2]) ? 1 : 0));
      const best = pairs[0][2];
      const tops = pairs.filter((p) => Math.abs(p[2] - best) < 1e-9).map((p) => `${p[0] + 1}–${p[1] + 1}`);
      verdict.textContent = `按${m.name}，最像的是 ${tops.join("、")}。`
        + (key === "cos" ? "3–4 只有 0.2，排在 1–3 后面。" : key === "euc" ? "3–4 与 1–2 一样近：3、4 两句向量短，彼此离得近。" : "整数加减，算得最快。");
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card;
      ctx.fillRect(0, 0, w, h);
      const side = Math.min((w - L - 16) / 4, (h - T - 16) / 4);
      ctx.font = "22px 'Noto Serif SC', serif";
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = Plot.C.ink;
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(`${k + 1}  ${docs[k].name}`, L - 12, T + (k + 0.5) * side);
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(`文档 ${k + 1}`, L + (k + 0.5) * side, T - 16);
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const val = m.f(docs[i].v, docs[j].v);
          let t = (val - m.lo) / (m.hi - m.lo);
          if (key !== "cos") t = 1 - t;
          t = Math.max(0, Math.min(1, t));
          ctx.fillStyle = `rgba(107,20,86,${0.06 + 0.8 * t})`;
          ctx.fillRect(L + j * side + 2, T + i * side + 2, side - 4, side - 4);
          ctx.fillStyle = t > 0.5 ? Plot.C.paper : Plot.C.ink;
          ctx.font = "600 26px 'Noto Sans SC', sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          const s = key === "man" ? String(val) : val.toFixed(key === "cos" ? 3 : 2);
          ctx.fillText(s, L + (j + 0.5) * side, T + (i + 0.5) * side);
        }
      }
      ctx.strokeStyle = Plot.C.gold; ctx.lineWidth = 4;
      ctx.strokeRect(L + j0 * side + 2, T + i0 * side + 2, side - 4, side - 4);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = Plot.C.muted; ctx.font = "20px 'Noto Sans SC', sans-serif";
      ctx.fillText("颜色越深越像", 12, h - 14);
    }
    bind(slide, render, () => {
      btns.forEach((b) => {
        b.onclick = () => {
          slide.dataset.metric = b.dataset.metric;
          btns.forEach((x) => x.classList.toggle("on", x === b));
          render();
        };
      });
      canvas.onclick = (e) => {
        const r = canvas.getBoundingClientRect();
        const side = Math.min((r.width - L - 16) / 4, (r.height - T - 16) / 4);
        const j = Math.floor((e.clientX - r.left - L) / side), i = Math.floor((e.clientY - r.top - T) / side);
        if (i < 0 || i > 3 || j < 0 || j > 3) return;
        slide.dataset.ci = String(i); slide.dataset.cj = String(j);
        render();
      };
    });
  });

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

  /* PageRank：教材四页 A→B，B→C，C→A、C→D，D 无出链 */
  const names = ["A", "B", "C", "D"];
  const M = [
    [0, 0, 0.5, 0.25],
    [1, 0, 0, 0.25],
    [0, 1, 0, 0.25],
    [0, 0, 0.5, 0.25],
  ];
  const edges = [[0, 1], [1, 2], [2, 0], [2, 3]];
  function mulG(x, d) {
    const s = x.reduce((a, b) => a + b, 0);
    return M.map((row) => d * row.reduce((acc, a, j) => acc + a * x[j], 0) + ((1 - d) / 4) * s);
  }
  function diff(a, b) { return Math.max(...a.map((v, i) => Math.abs(v - b[i]))); }
  function fixed(d) {
    let x = [0.25, 0.25, 0.25, 0.25];
    for (let k = 0; k < 400; k++) x = mulG(x, d);
    return x;
  }
  function arrow(ctx, a, b, shrink) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const x1 = a[0] + ux * shrink, y1 = a[1] + uy * shrink;
    const x2 = b[0] - ux * shrink, y2 = b[1] - uy * shrink;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 14 * ux + 7 * uy, y2 - 14 * uy - 7 * ux);
    ctx.lineTo(x2 - 14 * ux - 7 * uy, y2 - 14 * uy + 7 * ux);
    ctx.closePath(); ctx.fill();
  }
  function graph(ctx, w, h, x) {
    ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
    const pos = [[w * 0.28, h * 0.28], [w * 0.72, h * 0.28], [w * 0.28, h * 0.72], [w * 0.72, h * 0.72]];
    const rad = (i) => (x ? 26 + 42 * x[i] : 40);
    ctx.strokeStyle = Plot.C.gold; ctx.fillStyle = Plot.C.gold; ctx.lineWidth = 2.4;
    edges.forEach(([i, j]) => arrow(ctx, pos[i], pos[j], Math.max(rad(i), rad(j)) + 6));
    names.forEach((name, i) => {
      const r = rad(i);
      ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], r, 0, Math.PI * 2);
      ctx.fillStyle = Plot.C.burgundy; ctx.fill();
      ctx.fillStyle = Plot.C.paper;
      ctx.font = `600 ${Math.round(x ? 24 + 12 * x[i] : 30)}px "Noto Serif SC", serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(name, pos[i][0], pos[i][1]);
      if (x) {
        ctx.fillStyle = Plot.C.muted;
        ctx.font = "24px 'Noto Sans SC', sans-serif";
        ctx.fillText(x[i].toFixed(3), pos[i][0], pos[i][1] + r + 22);
      }
    });
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    return pos;
  }

  if (window.FIGS) Object.assign(window.FIGS, {
    "24-web"(ctx, w, h) {
      const pos = graph(ctx, w, h, null);
      Plot.label(ctx, "D 没有出链", pos[3][0] - 70, pos[3][1] + 76, Plot.C.muted, 24);
    },
  });

  Deck.on("pagerank", (slide) => {
    const canvas = slide.querySelector("#pr-canvas");
    const iterEl = slide.querySelector("#pr-iter");
    const fixEl = slide.querySelector("#pr-fix");
    const dEl = slide.querySelector("#pr-d");
    const dVal = slide.querySelector("#pr-d-val");
    const verdict = slide.querySelector("#pr-verdict");
    const playBtn = slide.querySelector("#pr-play");
    if (slide.dataset.bound) { slide._redraw?.(); return; }
    slide.dataset.bound = "1";
    let x = [0.25, 0.25, 0.25, 0.25], k = 0, playing = false;
    const dOf = () => (dEl ? Number(dEl.value) : 1);
    function stop() { playing = false; playBtn.textContent = "连续播放"; }
    function render() {
      const d = dOf();
      iterEl.textContent = k;
      if (dVal) dVal.textContent = d.toFixed(2);
      if (fixEl) fixEl.textContent = "稳定值 (" + fixed(d).map((a) => a.toFixed(3)).join(", ") + ")";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w >= 80) {
        graph(ctx, w, h, x);
        Plot.label(ctx, "圆的大小 = 当前权重", 16, 30, Plot.C.muted, 22);
      }
      const dd = diff(mulG(x, d), x);
      verdict.className = "verdict " + (dd < 0.001 && k > 0 ? "good" : "");
      verdict.textContent = k === 0
        ? "从当前初值出发。点「迭代一次」，看权重怎样顺着链接流动。"
        : dd < 0.001
          ? "再迭代几乎不再变：已经走到 Mv = v 的那个向量。C 最大。"
          : `本步最大变化 ${dd.toFixed(4)}。被指得多的页渐渐变大。`;
    }
    function step() { x = mulG(x, dOf()); k += 1; render(); }
    slide.querySelector("#pr-step").onclick = () => { stop(); step(); };
    slide.querySelector("#pr-reset").onclick = () => { stop(); x = [0.25, 0.25, 0.25, 0.25]; k = 0; render(); };
    const rnd = slide.querySelector("#pr-rand");
    if (rnd) rnd.onclick = () => {
      stop();
      const r = names.map(() => 0.05 + Math.random());
      const s = r.reduce((a, b) => a + b, 0);
      x = r.map((a) => a / s); k = 0; render();
    };
    if (dEl) dEl.oninput = () => { k = 0; render(); };
    playBtn.onclick = () => {
      if (playing) { stop(); return; }
      playing = true;
      playBtn.textContent = "暂停";
      const tick = () => {
        if (!playing) return;
        step();
        if (diff(mulG(x, dOf()), x) < 0.001 || k >= 80) { stop(); return; }
        setTimeout(tick, 380);
      };
      tick();
    };
    slide._redraw = render;
    render();
  });
})();
