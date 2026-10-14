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

  Deck.on("strips", (slide) => {
    const canvas = slide.querySelector("#strips-canvas");
    const btns = [...slide.querySelectorAll("[data-strip]")];
    const verdict = slide.querySelector("#strips-verdict");
    function render() {
      const mode = slide.dataset.strip || "d";
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
      if (mode === "d") {
        for (let i = 1; i < n; i++) {
          const x = i / n;
          ctx.beginPath(); ctx.moveTo(xOf(x), yOf(0)); ctx.lineTo(xOf(x), yOf(1)); ctx.stroke();
        }
        verdict.textContent = "D 型：竖条。先对 y 积分（一条竖条从下到上），再对 x 累加。";
      } else {
        for (let i = 1; i < n; i++) {
          const y = i / n;
          ctx.beginPath(); ctx.moveTo(xOf(0), yOf(y)); ctx.lineTo(xOf(1), yOf(y)); ctx.stroke();
        }
        verdict.textContent = "X 型：横条。先对 x 积分，再对 y 累加。矩形上两种次序一样，曲边区域要先画图再选。";
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
})();
