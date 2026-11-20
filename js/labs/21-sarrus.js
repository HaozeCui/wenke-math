/* 2.1 行列式：二阶有向面积 + 萨吕斯法则 + 课堂练配图 */
(function () {
  const C = Plot.C;
  const par = (n) => (n < 0 ? `(${n})` : `${n}`);

  function arrow(ctx, x0, y0, x1, y1, color, width) {
    const ang = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 - Math.cos(ang) * Math.min(14, L * 0.4), y1 - Math.sin(ang) * Math.min(14, L * 0.4));
    ctx.stroke();
    if (L < 4) return;
    const hl = Math.min(18, L * 0.5);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - hl * Math.cos(ang - 0.4), y1 - hl * Math.sin(ang - 0.4));
    ctx.lineTo(x1 - hl * Math.cos(ang + 0.4), y1 - hl * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  /* 实验 1：两列向量 u=(a,c)、v=(b,d) 张成的平行四边形，D=ad−bc 是它的有向面积 */
  const R = 5;
  Deck.on("det-area", (slide) => {
    const canvas = slide.querySelector("#det-area-canvas");
    const read = slide.querySelector("#det-area-read");
    const verdict = slide.querySelector("#det-area-verdict");
    const st = slide._detArea || (slide._detArea = { u: [3, 1], v: [1, 2], drag: null, view: null });

    function render() {
      const [a, c] = st.u, [b, d] = st.v;
      const D = a * d - b * c;
      Plot.tex(read, `$D=\\begin{vmatrix}${a}&${b}\\\\${c}&${d}\\end{vmatrix}=${par(a)}\\cdot${par(d)}-${par(b)}\\cdot${par(c)}=${D}$`
        + `<small>$u=(${a},${c})$，$v=(${b},${d})$　面积 $|D|=${Math.abs(D)}$</small>`);
      verdict.className = "verdict" + (D === 0 ? " good" : "");
      verdict.textContent = D === 0
        ? "两向量共线：平行四边形压扁成一条线段，D = 0。"
        : D > 0
          ? "从 u 逆时针转到 v：D 为正，数值就是面积。"
          : "从 u 顺时针转到 v：D 为负，绝对值仍是面积。点「交换 u、v」看符号翻转。";

      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 80) return;
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const s = Math.min(w, h) / (2 * R + 1.4), ox = w / 2, oy = h / 2;
      st.view = { s, ox, oy };
      const P = (p) => [ox + p[0] * s, oy - p[1] * s];

      ctx.lineWidth = 1;
      for (let i = -R; i <= R; i++) {
        ctx.strokeStyle = i === 0 ? "rgba(36,22,22,0.35)" : "rgba(36,22,22,0.08)";
        ctx.beginPath();
        ctx.moveTo(ox + i * s, oy - R * s); ctx.lineTo(ox + i * s, oy + R * s);
        ctx.moveTo(ox - R * s, oy - i * s); ctx.lineTo(ox + R * s, oy - i * s);
        ctx.stroke();
      }
      ctx.fillStyle = C.muted;
      ctx.font = "20px 'Noto Serif SC', serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [-4, -2, 2, 4].forEach((i) => ctx.fillText(String(i).replace("-", "−"), ox + i * s, oy + 4));
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [-4, -2, 2, 4].forEach((i) => ctx.fillText(String(i).replace("-", "−"), ox - 6, oy - i * s));

      const O = P([0, 0]), U = P(st.u), V = P(st.v), W = P([a + b, c + d]);
      if (D !== 0) {
        ctx.beginPath();
        ctx.moveTo(...O); ctx.lineTo(...U); ctx.lineTo(...W); ctx.lineTo(...V); ctx.closePath();
        ctx.fillStyle = D > 0 ? "rgba(107,20,86,0.22)" : "rgba(27,95,92,0.24)";
        ctx.fill();
        Plot.dashed(ctx, U[0], U[1], W[0], W[1], "rgba(36,22,22,0.4)", 1.4);
        Plot.dashed(ctx, V[0], V[1], W[0], W[1], "rgba(36,22,22,0.4)", 1.4);
        const th = Math.atan2(c, a), dl = Math.atan2(a * d - b * c, a * b + c * d);
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(ox, oy, s * 0.9, -th, -(th + dl), dl > 0);
        ctx.stroke();
        const e = -(th + dl), dir = dl > 0 ? -1 : 1;
        const ex = ox + s * 0.9 * Math.cos(e), ey = oy + s * 0.9 * Math.sin(e);
        arrow(ctx, ex + dir * 24 * Math.sin(e), ey - dir * 24 * Math.cos(e), ex, ey, C.gold, 2.4);
        const M = [(O[0] + W[0]) / 2, (O[1] + W[1]) / 2];
        ctx.fillStyle = D > 0 ? C.burgundy : C.teal;
        ctx.font = "bold 30px 'Noto Serif SC', serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText((D > 0 ? "+" : "−") + Math.abs(D), M[0], M[1]);
      }
      arrow(ctx, O[0], O[1], U[0], U[1], C.burgundy, 3.2);
      arrow(ctx, O[0], O[1], V[0], V[1], C.gold, 3.2);
      Plot.disc(ctx, U[0], U[1], 9, C.card, C.burgundy);
      Plot.disc(ctx, V[0], V[1], 9, C.card, C.gold);
      const tag = (p, txt, col) => {
        const L = Math.hypot(p[0] - O[0], p[1] - O[1]) || 1;
        Plot.label(ctx, txt, p[0] + ((p[0] - O[0]) / L) * 22 - 8, p[1] + ((p[1] - O[1]) / L) * 22 + 10, col, 30);
      };
      tag(U, "u", C.burgundy);
      tag(V, "v", C.gold);
    }

    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";

    canvas.style.touchAction = "none";
    canvas.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    const at = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const toGrid = ([X, Y]) => {
      const V = st.view;
      const g = (t) => Math.max(-R, Math.min(R, Math.round(t)));
      return [g((X - V.ox) / V.s), g((V.oy - Y) / V.s)];
    };
    canvas.addEventListener("pointerdown", (e) => {
      if (!st.view) return;
      const [X, Y] = at(e), V = st.view;
      const dist = (p) => Math.hypot(V.ox + p[0] * V.s - X, V.oy - p[1] * V.s - Y);
      const du = dist(st.u), dv = dist(st.v);
      const pick = Math.min(du, dv) > 40 ? null : du <= dv ? "u" : "v";
      if (!pick) return;
      st.drag = pick;
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!st.drag) return;
      const p = toGrid(at(e)), q = st[st.drag];
      if (p[0] === q[0] && p[1] === q[1]) return;
      st[st.drag] = p;
      render();
    });
    const stop = () => { st.drag = null; };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    const inside = (p) => Math.abs(p[0]) <= R && Math.abs(p[1]) <= R;
    slide.querySelectorAll("[data-area]").forEach((btn) => {
      btn.onclick = () => {
        const m = btn.dataset.area, [a, c] = st.u, [b, d] = st.v;
        if (m === "std") { st.u = [1, 0]; st.v = [0, 1]; }
        else if (m === "swap") { st.u = [b, d]; st.v = [a, c]; }
        else if (m === "shear") {
          const up = [b + a, d + c], dn = [b - a, d - c];
          if (inside(up)) st.v = up; else if (inside(dn)) st.v = dn;
        } else if (m === "line") {
          if (a === 0 && c === 0) st.u = [2, 1];
          const k = Math.max(Math.abs(st.u[0]), Math.abs(st.u[1])) <= 2 ? 2 : -1;
          st.v = [k * st.u[0], k * st.u[1]];
        }
        render();
      };
    });
    render();
  });

  /* 实验 2：萨吕斯法则。把前两列抄到右边，六条斜线三正三负 */
  const MATS = {
    ex: { A: [[1, 2, 1], [-2, 1, -1], [1, -4, 2]], name: "例 2.1.1 的 D" },
    tri: { A: [[1, 2, 3], [0, 4, 5], [0, 0, 6]], name: "上三角" },
  };
  const TERMS = [
    { sign: 1, start: 0 }, { sign: 1, start: 1 }, { sign: 1, start: 2 },
    { sign: -1, start: 2 }, { sign: -1, start: 3 }, { sign: -1, start: 4 },
  ];
  const cellsOf = (t) => [0, 1, 2].map((i) => [i, t.sign > 0 ? t.start + i : t.start - i]);

  Deck.on("sarrus", (slide) => {
    const canvas = slide.querySelector("#sarrus-canvas");
    const kEl = slide.querySelector("#sarrus-k");
    const kVal = slide.querySelector("#sarrus-k-val");
    const read = slide.querySelector("#sarrus-read");
    const verdict = slide.querySelector("#sarrus-verdict");
    const btns = [...slide.querySelectorAll("[data-sar]")];

    function render() {
      const key = slide.dataset.sar || "ex";
      const A = MATS[key].A;
      const k = Number(kEl.value);
      const vals = TERMS.map((t) => t.sign * cellsOf(t).reduce((p, [i, j]) => p * A[i][j % 3], 1));
      const t = TERMS[k], cells = cellsOf(t);
      const fs = cells.map(([i, j]) => par(A[i][j % 3])).join("\\cdot ");
      const prod = cells.reduce((p, [i, j]) => p * A[i][j % 3], 1);
      const acc = vals.slice(0, k + 1).reduce((p, q) => p + q, 0);
      kVal.textContent = `${k + 1} / 6`;
      Plot.tex(read, `$${t.sign > 0 ? "+" : "-"}\\,${fs}=${t.sign * prod}$`
        + `<small>前 ${k + 1} 项累计：${acc}${k === 5 ? "　= D" : ""}</small>`);
      verdict.className = "verdict" + (k === 5 ? " good" : "");
      verdict.textContent = key === "tri"
        ? "上三角：除主对角线外，每条斜线都碰到 0，只剩 1·4·6 = 24。"
        : k === 5
          ? "六项合计 D = 11 ≠ 0，例 2.1.1 的方程组有唯一解。"
          : "实线三条取正号，虚线三条取负号。拖到第 6 项看总和。";

      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80 || h < 80) return;
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, h);
      const s = Math.min(w / 5.6, h / 4.4), ox = (w - 5 * s) / 2, oy = (h - 3 * s) / 2;
      const cen = (i, j) => [ox + j * s + s / 2, oy + i * s + s / 2];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
          const hit = cells.some(([a, b]) => a === i && b === j);
          const copy = j >= 3;
          ctx.fillStyle = hit ? (t.sign > 0 ? "rgba(107,20,86,0.20)" : "rgba(27,95,92,0.20)") : copy ? C.card : C.paper;
          ctx.fillRect(ox + j * s + 4, oy + i * s + 4, s - 8, s - 8);
          const [cx, cy] = cen(i, j);
          ctx.fillStyle = copy && !hit ? "rgba(36,22,22,0.38)" : C.ink;
          ctx.font = `${Math.round(s * 0.36)}px 'Noto Serif SC', serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(A[i][j % 3]).replace("-", "−"), cx, cy);
        }
      }
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + 3 * s);
      ctx.moveTo(ox + 3 * s, oy); ctx.lineTo(ox + 3 * s, oy + 3 * s);
      ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.font = "22px 'Noto Serif SC', serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("抄写第 1、2 列", ox + 4 * s, oy + 3 * s + 10);
      TERMS.forEach((tt, q) => {
        const cs = cellsOf(tt).map(([i, j]) => cen(i, j));
        const cur = q === k;
        ctx.save();
        if (tt.sign < 0) ctx.setLineDash([10, 8]);
        ctx.strokeStyle = cur ? (tt.sign > 0 ? C.burgundy : C.teal) : "rgba(36,22,22,0.14)";
        ctx.lineWidth = cur ? 4 : 1.6;
        ctx.beginPath();
        const d = s * 0.32, dx = (cs[2][0] - cs[0][0]) / 2, dy = (cs[2][1] - cs[0][1]) / 2;
        const L = Math.hypot(dx, dy);
        ctx.moveTo(cs[0][0] - (dx / L) * d, cs[0][1] - (dy / L) * d);
        ctx.lineTo(cs[2][0] + (dx / L) * d, cs[2][1] + (dy / L) * d);
        ctx.stroke();
        ctx.restore();
      });
    }

    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    slide.dataset.sar = "ex";
    btns.forEach((b) => {
      b.onclick = () => {
        slide.dataset.sar = b.dataset.sar;
        btns.forEach((x) => x.classList.toggle("on", x === b));
        render();
      };
    });
    kEl.oninput = render;
    render();
  });

  if (window.FIGS) Object.assign(window.FIGS, {
    /* 课堂练：地图上的三角形地块 A(0,0)、B(4,1)、C(1,3)，另标 C'(8,2) */
    "21-tri"(ctx, w, h) {
      const { xOf, yOf } = Plot.axes(ctx, w, h, {
        xMin: -0.5, xMax: 8.6, yMin: -0.5, yMax: 4, grid: true, xlabel: "x（百米）", ylabel: "y（百米）",
        xticks: [0, 2, 4, 6, 8].map((v) => [v, String(v)]), yticks: [0, 1, 2, 3].map((v) => [v, String(v)]),
      });
      const pts = { A: [0, 0], B: [4, 1], C: [1, 3] };
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(0)); ctx.lineTo(xOf(4), yOf(1)); ctx.lineTo(xOf(1), yOf(3)); ctx.closePath();
      ctx.fillStyle = "rgba(107,20,86,0.2)";
      ctx.fill();
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      Object.entries(pts).forEach(([n, [x, y]]) => {
        Plot.disc(ctx, xOf(x), yOf(y), 6, C.burgundy);
        Plot.label(ctx, n, xOf(x) + 10, yOf(y) - 10, C.burgundy, 28);
      });
      Plot.disc(ctx, xOf(8), yOf(2), 6, C.card, C.gold);
      Plot.label(ctx, "C′", xOf(8) - 40, yOf(2) - 12, C.gold, 28);
    },
  });
})();
