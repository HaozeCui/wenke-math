/* 1.8 二元：路径极限、偏导截线、二重积分切条 */
(function () {
  function fxy(x, y) {
    const d = x * x + y * y;
    if (d < 1e-16) return NaN;
    return (x * x - y * y) / d;
  }

  function drawPaths(canvas, th1, th2, r) {
    const { ctx, w, h } = Deck.fitCanvas(canvas);
    if (w < 80 || h < 80) return;
    ctx.fillStyle = Plot.C.card;
    ctx.fillRect(0, 0, w, h);
    const m = 16;
    const side = Math.max(8, Math.floor(Math.min(w, h) - m * 2));
    const ox = Math.floor((w - side) / 2), oy = Math.floor((h - side) / 2);
    const R = 1.35;
    const toPx = (x, y) => [ox + ((x + R) / (2 * R)) * side, oy + ((R - y) / (2 * R)) * side];
    Plot.heatmap(ctx, ox, oy, side, fxy, R);
    const [zx, zy] = toPx(0, 0);
    ctx.strokeStyle = "rgba(36,22,22,0.25)";
    ctx.beginPath();
    ctx.moveTo(ox, zy); ctx.lineTo(ox + side, zy);
    ctx.moveTo(zx, oy); ctx.lineTo(zx, oy + side);
    ctx.stroke();
    function ray(th, stroke, label) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(zx, zy);
      const [px, py] = toPx(1.25 * Math.cos(th), 1.25 * Math.sin(th));
      ctx.lineTo(px, py);
      ctx.stroke();
      const [qx, qy] = toPx(r * Math.cos(th), r * Math.sin(th));
      Plot.disc(ctx, qx, qy, 6, stroke);
      Plot.label(ctx, label, qx + 8, qy - 8);
    }
    ray(th1, Plot.C.gold, "路径甲");
    ray(th2, Plot.C.burgundy, "路径乙");
    ctx.strokeStyle = "#d7c8b2";
    ctx.strokeRect(ox + 0.5, oy + 0.5, side - 1, side - 1);
  }

  Deck.on("paths", (slide) => {
    const canvas = slide.querySelector("#paths-canvas");
    const a1 = slide.querySelector("#th1");
    const a2 = slide.querySelector("#th2");
    const rEl = slide.querySelector("#rad");
    const v1 = slide.querySelector("#f1");
    const v2 = slide.querySelector("#f2");
    const l1 = slide.querySelector("#th1-val");
    const l2 = slide.querySelector("#th2-val");
    const lr = slide.querySelector("#rad-val");
    const verdict = slide.querySelector("#paths-verdict");
    function render() {
      const th1 = (Number(a1.value) * Math.PI) / 180;
      const th2 = (Number(a2.value) * Math.PI) / 180;
      const r = Number(rEl.value);
      l1.textContent = a1.value + "°";
      l2.textContent = a2.value + "°";
      lr.textContent = r.toFixed(2);
      const f1 = Math.cos(2 * th1), f2 = Math.cos(2 * th2);
      v1.textContent = f1.toFixed(3);
      v2.textContent = f2.toFixed(3);
      const differ = Math.abs(f1 - f2) > 0.15;
      verdict.className = "verdict " + (differ ? "bad" : "good");
      verdict.textContent = differ
        ? "两条射线得到两个不同的数，所以这个二重极限不存在。"
        : "这两条方向碰巧接近。把其中一条转到 0° 或 45°，差异会立刻出现。";
      drawPaths(canvas, th1, th2, r);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    [a1, a2, rEl].forEach((el) => { el.oninput = render; });
    render();
  });

  function parab(x, y) { return x * x + y * y; }

  Deck.on("slice", (slide) => {
    const canvas = slide.querySelector("#slice-canvas");
    const yEl = slide.querySelector("#slice-y");
    const yVal = slide.querySelector("#slice-y-val");
    const read = slide.querySelector("#slice-read");
    function render() {
      const c = Number(yEl.value);
      yVal.textContent = c.toFixed(2);
      read.textContent = `固定 y = ${c.toFixed(2)}，截线是 z = x² + ${(c * c).toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2.2, xMax: 2.2, yMin: -0.2, yMax: 5.2, xlabel: "x", ylabel: "z", title: "z = x² + y² 的截线" });
      Plot.curve(ctx, xOf, yOf, (x) => parab(x, 0), -2.2, 2.2, 80, { color: "rgba(107,20,86,0.25)", width: 1.5 });
      Plot.curve(ctx, xOf, yOf, (x) => parab(x, c), -2.2, 2.2, 80);
      const z = parab(0, c);
      Plot.disc(ctx, xOf(0), yOf(z), 5, Plot.C.gold);
      Plot.label(ctx, `y=${c.toFixed(2)}`, xOf(0.15), yOf(z) - 8);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    yEl.oninput = render;
    render();
  });

  /* X 型（竖条）与 Y 型（横条），名称按教材：X 型是 a≤x≤b、先对 y 积分 */
  Deck.on("strips", (slide) => {
    const canvas = slide.querySelector("#strips-canvas");
    const btns = [...slide.querySelectorAll("[data-strip]")];
    const verdict = slide.querySelector("#strips-verdict");
    function render() {
      const mode = slide.dataset.strip || "x";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.15, xMax: 1.15, yMin: -0.15, yMax: 1.15, xlabel: "x", ylabel: "y", title: "正方形 D" });
      ctx.fillStyle = "rgba(107,20,86,0.08)";
      ctx.fillRect(xOf(0), yOf(1), xOf(1) - xOf(0), yOf(0) - yOf(1));
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.strokeRect(xOf(0), yOf(1), xOf(1) - xOf(0), yOf(0) - yOf(1));
      const n = 8;
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 1.6;
      if (mode === "x") {
        for (let i = 1; i < n; i++) {
          const x = i / n;
          ctx.beginPath(); ctx.moveTo(xOf(x), yOf(0)); ctx.lineTo(xOf(x), yOf(1)); ctx.stroke();
        }
        verdict.textContent = "X 型：竖条。先对 y 积分（一条竖条从下到上），再把各条沿 x 累加。";
      } else {
        for (let i = 1; i < n; i++) {
          const y = i / n;
          ctx.beginPath(); ctx.moveTo(xOf(0), yOf(y)); ctx.lineTo(xOf(1), yOf(y)); ctx.stroke();
        }
        verdict.textContent = "Y 型：横条。先对 x 积分（一条横条从左到右），再沿 y 累加。矩形上两种次序一样，曲边区域要先画图再选。";
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    btns.forEach((b) => {
      b.onclick = () => {
        slide.dataset.strip = b.dataset.strip;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    render();
  });

  /* 等高线上取一点，读两个偏导：P = 50x + 30y − x² − y² − xy（例 1.8.11）。
     滑条以 1/3 为步长，驻点 (70/3, 10/3) 恰好能取到。 */
  const PR = (x, y) => 50 * x + 30 * y - x * x - y * y - x * y;
  const PX = (x, y) => 50 - 2 * x - y;
  const PY = (x, y) => 30 - x - 2 * y;
  const PMAX = 1900 / 3;

  function contourMap(ctx, A) {
    const { m, pw, ph } = A;
    const sw = 160, sh = 80;
    const off = document.createElement("canvas");
    off.width = sw; off.height = sh;
    const octx = off.getContext("2d");
    const img = octx.createImageData(sw, sh);
    for (let j = 0; j < sh; j++) {
      for (let i = 0; i < sw; i++) {
        const x = m.xMin + (i / (sw - 1)) * (m.xMax - m.xMin);
        const y = m.yMax - (j / (sh - 1)) * (m.yMax - m.yMin);
        const t = Math.max(0, Math.min(1, (PR(x, y) + 250) / (PMAX + 250)));
        const p = (j * sw + i) * 4;
        img.data[p] = 255 + (190 - 255) * t;
        img.data[p + 1] = 250 + (140 - 250) * t;
        img.data[p + 2] = 242 + (175 - 242) * t;
        img.data[p + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    ctx.drawImage(off, m.l, m.t, pw, ph);
    /* P = PMAX − (3/2)s² − (1/2)t²，s、t 是 (u±v)/√2，u = x − 70/3，v = y − 10/3：等高线是椭圆 */
    Plot.clip(ctx, A, () => {
      [600, 500, 400, 300, 200, 100, 0, -100, -200].forEach((c) => {
        const k = PMAX - c;
        const a = Math.sqrt((2 * k) / 3), b = Math.sqrt(2 * k);
        const pts = [];
        for (let i = 0; i <= 160; i++) {
          const ph2 = (i / 160) * 2 * Math.PI;
          const s = a * Math.cos(ph2), t = b * Math.sin(ph2);
          const u = (s + t) / Math.SQRT2, v = (s - t) / Math.SQRT2;
          pts.push([A.xOf(70 / 3 + u), A.yOf(10 / 3 + v)]);
        }
        Plot.polyline(ctx, pts, { color: c === 600 ? "rgba(107,20,86,0.75)" : "rgba(107,20,86,0.35)", width: c === 600 ? 1.8 : 1.2 });
      });
    });
  }

  function tangentSeg(ctx, A, x0, y0, slope, half) {
    Plot.clip(ctx, A, () => {
      ctx.strokeStyle = Plot.C.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(A.xOf(x0 - half), A.yOf(y0 - half * slope));
      ctx.lineTo(A.xOf(x0 + half), A.yOf(y0 + half * slope));
      ctx.stroke();
    });
  }

  Deck.on("pdmap", (slide) => {
    const canvas = slide.querySelector("#pdmap-canvas");
    const xEl = slide.querySelector("#pd-x");
    const yEl = slide.querySelector("#pd-y");
    const xVal = slide.querySelector("#pd-x-val");
    const yVal = slide.querySelector("#pd-y-val");
    const read = slide.querySelector("#pd-read");
    const verdict = slide.querySelector("#pd-verdict");
    let top = null;
    const fmt = (v) => (Math.abs(v) < 1e-9 ? "0" : v.toFixed(2));
    function render() {
      const x0 = Number(xEl.value) / 3, y0 = Number(yEl.value) / 3;
      xVal.textContent = x0.toFixed(2);
      yVal.textContent = y0.toFixed(2);
      const px = PX(x0, y0), py = PY(x0, y0), p = PR(x0, y0);
      Plot.tex(read, `$P=${p.toFixed(1)}$<small>$P_x=50-2x-y=${fmt(px)}$<br />$P_y=30-x-2y=${fmt(py)}$</small>`);
      const flatX = Math.abs(px) < 1e-9, flatY = Math.abs(py) < 1e-9;
      const word = (d, flat) => (flat ? "已经走平" : d > 0 ? "还在上升" : "已在下降");
      verdict.className = "verdict" + (flatX && flatY ? " good" : "");
      verdict.textContent = flatX && flatY
        ? "两个偏导同时为 0：两条截线都在最高处走平。这就是驻点 (70/3, 10/3)，P = 1900/3 ≈ 633.3。"
        : `沿 x 方向${word(px, flatX)}，沿 y 方向${word(py, flatY)}。往偏导为正的方向挪一点，利润会增加。`;

      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 160 || h < 300) return;
      const topH = Math.floor(h * 0.55);
      top = Plot.axes(ctx, w, topH, { xMin: 0, xMax: 40, yMin: 0, yMax: 20, grid: true, xlabel: "", ylabel: "y", title: "利润等高线：颜色越深，利润越高", b: 40, t: 34 });
      contourMap(ctx, top);
      Plot.dashed(ctx, top.xOf(0), top.yOf(y0), top.xOf(40), top.yOf(y0), Plot.C.gold, 2);
      Plot.dashed(ctx, top.xOf(x0), top.yOf(0), top.xOf(x0), top.yOf(20), Plot.C.teal, 2);
      Plot.disc(ctx, top.xOf(x0), top.yOf(y0), 8, Plot.C.burgundy, Plot.C.card);

      const bh = h - topH, half = Math.floor(w / 2);
      const yt = [[0, "0"], [300, "300"], [600, "600"]];
      ctx.save();
      ctx.translate(0, topH);
      const L = Plot.axes(ctx, half, bh, { xMin: 0, xMax: 40, yMin: -250, yMax: 720, grid: true, yticks: yt, xlabel: "x", ylabel: "P", title: "固定 y，沿 x 走", t: 34 });
      Plot.clip(ctx, L, () => Plot.curve(ctx, L.xOf, L.yOf, (x) => PR(x, y0), 0, 40, 120, { color: Plot.C.gold, width: 3 }));
      tangentSeg(ctx, L, x0, p, px, 5);
      Plot.disc(ctx, L.xOf(x0), L.yOf(p), 6, Plot.C.burgundy);
      ctx.restore();
      ctx.save();
      ctx.translate(half, topH);
      const R = Plot.axes(ctx, w - half, bh, { xMin: 0, xMax: 20, yMin: -250, yMax: 720, grid: true, yticks: yt, xlabel: "y", ylabel: "P", title: "固定 x，沿 y 走", t: 34 });
      Plot.clip(ctx, R, () => Plot.curve(ctx, R.xOf, R.yOf, (y) => PR(x0, y), 0, 20, 120, { color: Plot.C.teal, width: 3 }));
      tangentSeg(ctx, R, y0, p, py, 2.5);
      Plot.disc(ctx, R.xOf(y0), R.yOf(p), 6, Plot.C.burgundy);
      ctx.restore();
    }
    function pick(e) {
      if (!top) return false;
      const r = canvas.getBoundingClientRect();
      const X = e.clientX - r.left, Y = e.clientY - r.top;
      const { m, pw, ph } = top;
      if (X < m.l - 12 || X > m.l + pw + 12 || Y < m.t - 12 || Y > m.t + ph + 12) return false;
      const x = Math.max(0, Math.min(40, ((X - m.l) / pw) * 40));
      const y = Math.max(0, Math.min(20, (1 - (Y - m.t) / ph) * 20));
      xEl.value = Math.round(x * 3);
      yEl.value = Math.round(y * 3);
      render();
      return true;
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    xEl.oninput = render;
    yEl.oninput = render;
    let drag = false;
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", (e) => {
      if (pick(e)) { drag = true; canvas.setPointerCapture(e.pointerId); }
    });
    canvas.addEventListener("pointermove", (e) => { if (drag) pick(e); });
    canvas.addEventListener("pointerup", () => { drag = false; });
    canvas.addEventListener("pointercancel", () => { drag = false; });
    ["touchstart", "touchmove", "touchend"].forEach((ev) =>
      canvas.addEventListener(ev, (e) => e.stopPropagation(), { passive: true }));
    render();
  });

  if (window.FIGS) Object.assign(window.FIGS, {
    /* 找错 1：过原点的直线都得 0，抛物线 y = x² 得 1/2 */
    "18-lines"(ctx, w, h) {
      const A = Plot.axes(ctx, w, h, { xMin: -1.2, xMax: 1.2, yMin: -1.2, yMax: 1.2, grid: true, title: "趋向原点的几条路" });
      const { xOf, yOf } = A;
      Plot.clip(ctx, A, () => {
        [-2, -0.5, 0.5, 1, 2].forEach((k) => Plot.curve(ctx, xOf, yOf, (x) => k * x, -1.2, 1.2, 2, { color: "rgba(176,122,40,0.7)", width: 1.8 }));
        Plot.curve(ctx, xOf, yOf, (x) => x * x, -1.2, 1.2, 120, { color: Plot.C.burgundy, width: 3.2 });
      });
      Plot.disc(ctx, xOf(0), yOf(0), 6, Plot.C.card, Plot.C.ink);
      Plot.label(ctx, "直线 y = kx", xOf(0.28), yOf(-0.95), Plot.C.gold, 24);
      Plot.label(ctx, "y = x²", xOf(-1.12), yOf(1.02), Plot.C.burgundy, 24);
    },
    /* 找错 2：y = x² 与 y = x 之间，竖条从下边积到上边 */
    "18-lens"(ctx, w, h) {
      const A = Plot.axes(ctx, w, h, { xMin: -0.1, xMax: 1.15, yMin: -0.1, yMax: 1.15, grid: true, xticks: [[0, "0"], [0.5, "0.5"], [1, "1"]], yticks: [[0, "0"], [0.5, "0.5"], [1, "1"]] });
      const { xOf, yOf } = A;
      Plot.fillBetween(ctx, xOf, yOf, (x) => x, 0, 1, { g: (x) => x * x, color: "rgba(107,20,86,0.22)" });
      Plot.curve(ctx, xOf, yOf, (x) => x, 0, 1.1, 2, { color: Plot.C.burgundy, width: 2.4 });
      Plot.curve(ctx, xOf, yOf, (x) => x * x, 0, 1.06, 120, { color: Plot.C.teal, width: 2.4 });
      const s = 0.6, d = 0.025;
      ctx.fillStyle = "rgba(176,122,40,0.85)";
      ctx.fillRect(xOf(s - d), yOf(s), xOf(s + d) - xOf(s - d), yOf(s * s) - yOf(s));
      Plot.label(ctx, "上边 y = x", xOf(0.12), yOf(0.62), Plot.C.burgundy, 24);
      Plot.label(ctx, "下边 y = x²", xOf(0.62), yOf(0.18), Plot.C.teal, 24);
    },
  });
})();
