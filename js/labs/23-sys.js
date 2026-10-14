/* 2.3 方程组：三平面位置；投入产出箭头 */
(function () {
  Deck.on("planes", (slide) => {
    const canvas = slide.querySelector("#planes-canvas");
    const btns = [...slide.querySelectorAll("[data-plane]")];
    const verdict = slide.querySelector("#planes-verdict");
    function render() {
      const mode = slide.dataset.plane || "one";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      function line(x1, y1, x2, y2, color) {
        ctx.strokeStyle = color; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      const cx = w / 2, cy = h / 2;
      if (mode === "one") {
        line(40, cy + 40, w - 40, cy - 40, Plot.C.burgundy);
        line(40, cy - 50, w - 40, cy + 30, Plot.C.gold);
        line(cx - 20, 40, cx + 80, h - 40, Plot.C.teal);
        Plot.disc(ctx, cx + 8, cy - 4, 7, Plot.C.ink);
        verdict.textContent = "三条线交于一点：唯一解。三平面同理——交于一点。";
      } else if (mode === "none") {
        line(40, cy - 30, w - 40, cy - 30, Plot.C.burgundy);
        line(40, cy + 10, w - 40, cy + 10, Plot.C.gold);
        line(40, cy + 50, w - 40, cy + 50, Plot.C.teal);
        verdict.textContent = "三条平行线：没有公共点。对应增广矩阵出现 0 = 1。";
      } else {
        line(50, cy - 8, w - 50, cy - 8, Plot.C.burgundy);
        line(55, cy, w - 45, cy, Plot.C.gold);
        line(48, cy + 8, w - 52, cy + 8, Plot.C.teal);
        verdict.textContent = "三条重合：无穷多解。0 = 0 且未知数比有效方程多。";
      }
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    btns.forEach((b) => {
      b.onclick = () => {
        slide.dataset.plane = b.dataset.plane;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    render();
  });

  Deck.on("io", (slide) => {
    const canvas = slide.querySelector("#io-canvas");
    function render() {
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      ctx.fillStyle = Plot.C.card; ctx.fillRect(0, 0, w, h);
      const nodes = [
        [w * 0.22, h * 0.5, "农"],
        [w * 0.5, h * 0.28, "工"],
        [w * 0.78, h * 0.58, "服务"],
      ];
      ctx.strokeStyle = Plot.C.gold; ctx.fillStyle = Plot.C.gold; ctx.lineWidth = 2;
      function arrow(a, b) {
        const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
        const ux = dx / L, uy = dy / L;
        const x1 = a[0] + ux * 48, y1 = a[1] + uy * 48;
        const x2 = b[0] - ux * 48, y2 = b[1] - uy * 48;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      arrow(nodes[0], nodes[1]); arrow(nodes[1], nodes[2]); arrow(nodes[2], nodes[0]);
      arrow(nodes[1], nodes[0]);
      nodes.forEach(([x, y, lab]) => {
        ctx.beginPath(); ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.fillStyle = Plot.C.burgundy; ctx.fill();
        ctx.fillStyle = Plot.C.paper;
        ctx.font = "24px 'Noto Serif SC', serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lab, x, y);
      });
      Plot.label(ctx, "箭 = 消耗。投入产出把部门往来写成矩阵 (I−A)x = d。", 20, 28);
    }
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    render();
  });
})();
