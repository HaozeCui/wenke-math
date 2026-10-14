/* 1.7 积分应用：切条方向、阻滞 */
(function () {
  Deck.on("region", (slide) => {
    const canvas = slide.querySelector("#region-canvas");
    const btns = [...slide.querySelectorAll("[data-cut]")];
    const verdict = slide.querySelector("#region-verdict");
    function render() {
      const mode = slide.dataset.cut || "y";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.5, xMax: 5, yMin: -2.5, yMax: 3, title: "x=y² 与 x=y+2" });
      Plot.curve(ctx, xOf, yOf, () => 0, 0, 0, 1);
      ctx.strokeStyle = Plot.C.burgundy; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const y = -2.2 + i * (4.4 / 80);
        const X = xOf(y * y), Y = yOf(y);
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.strokeStyle = Plot.C.gold;
      ctx.beginPath();
      ctx.moveTo(xOf(-0.2 + 2), yOf(-2.2));
      ctx.lineTo(xOf(2.2 + 2), yOf(2.2));
      ctx.stroke();
      if (mode === "y") {
        for (let k = 0; k < 7; k++) {
          const y = -1.2 + k * 0.4;
          ctx.strokeStyle = "rgba(176,122,40,0.85)";
          ctx.beginPath();
          ctx.moveTo(xOf(y * y), yOf(y));
          ctx.lineTo(xOf(y + 2), yOf(y));
          ctx.stroke();
        }
        verdict.textContent = "对 y：左 x=y² 到右 x=y+2，一个积分。";
      } else {
        ctx.strokeStyle = "rgba(107,20,86,0.7)";
        for (let k = 0; k < 4; k++) {
          const x = 0.2 + k * 0.2;
          const yTop = Math.sqrt(x), yBot = -Math.sqrt(x);
          ctx.beginPath(); ctx.moveTo(xOf(x), yOf(yBot)); ctx.lineTo(xOf(x), yOf(yTop)); ctx.stroke();
        }
        for (let k = 0; k < 5; k++) {
          const x = 1.1 + k * 0.25;
          ctx.beginPath(); ctx.moveTo(xOf(x), yOf(x - 2)); ctx.lineTo(xOf(x), yOf(Math.sqrt(x))); ctx.stroke();
        }
        verdict.textContent = "对 x：要在交点 x=1 切开，两个积分。先画图，再选变量。";
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    btns.forEach((b) => {
      b.onclick = () => {
        slide.dataset.cut = b.dataset.cut;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    render();
  });

  Deck.on("logistic", (slide) => {
    const canvas = slide.querySelector("#log-canvas");
    const rEl = slide.querySelector("#log-r");
    const rVal = slide.querySelector("#log-r-val");
    const read = slide.querySelector("#log-read");
    const K = 1;
    function step(r) {
      const n = 160, dt = 12 / n;
      const pts = [];
      let y = 0.05;
      for (let i = 0; i <= n; i++) {
        pts.push([i * dt, y]);
        y += r * y * (1 - y / K) * dt;
      }
      return pts;
    }
    function render() {
      const r = Number(rEl.value);
      rVal.textContent = r.toFixed(2);
      read.textContent = `增长越快，S 形越陡，但天花板仍是环境容量 K=1。`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: 12, yMin: 0, yMax: 1.15, xlabel: "t", ylabel: "y", title: "阻滞增长" });
      const pts = step(r).map(([t, y]) => [xOf(t), yOf(y)]);
      Plot.polyline(ctx, pts, { color: Plot.C.burgundy, width: 2.2 });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = Plot.C.gold;
      ctx.beginPath(); ctx.moveTo(xOf(0), yOf(1)); ctx.lineTo(xOf(12), yOf(1)); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    rEl.oninput = render;
    render();
  });
})();
