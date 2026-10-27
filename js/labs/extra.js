/* 增补例题的图：交易费、初等函数、奇函数、黄金分割、微分近似、竖直切线、盒子、原函数族、学习曲线、人口、定义域、三角形切条。 */
(function () {
  function bind(slide, render, wire) {
    if (slide.dataset.bound) { render(); return; }
    slide.dataset.bound = "1";
    wire();
    render();
  }

  function tangent(ctx, xOf, yOf, x, y, slope, len) {
    if (!Number.isFinite(slope) || Math.abs(slope) > 30) return false;
    ctx.strokeStyle = Plot.C.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xOf(x - len), yOf(y - len * slope));
    ctx.lineTo(xOf(x + len), yOf(y + len * slope));
    ctx.stroke();
    return true;
  }

  Deck.on("fee", (slide) => {
    const canvas = slide.querySelector("#fee-canvas");
    const xEl = slide.querySelector("#fee-x");
    const xVal = slide.querySelector("#fee-x-val");
    const read = slide.querySelector("#fee-read");
    const p = 0.8, q = 2;
    function fee(x) {
      if (x <= 0) return 0;
      if (x <= q) return p * q;
      return p * x;
    }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = fee(x);
      read.textContent = x === 0
        ? "x = 0，费用 = 0。向右一点就变成 1.6。"
        : `x = ${x.toFixed(2)}，费用 = ${y.toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.4, xMax: 6.2, yMin: -0.3, yMax: 5.2, title: "交易费" });
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(xOf(0.02), yOf(p * q));
      ctx.lineTo(xOf(q), yOf(p * q));
      ctx.stroke();
      Plot.curve(ctx, xOf, yOf, (t) => p * t, q, 6.1, 40);
      Plot.disc(ctx, xOf(0), yOf(0), 5, Plot.C.burgundy);
      Plot.disc(ctx, xOf(0), yOf(p * q), 5, Plot.C.card, Plot.C.burgundy);
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("elem", (slide) => {
    const canvas = slide.querySelector("#elem-canvas");
    const btns = [...slide.querySelectorAll("[data-elem]")];
    const verdict = slide.querySelector("#elem-verdict");
    const kinds = [
      { name: "y = x²", f: (x) => x * x, a: -2, b: 2, y0: -0.4, y1: 4.2, note: "全体实数都有定义。开口向上。" },
      { name: "y = 2ˣ", f: (x) => Math.pow(2, x), a: -2, b: 2.2, y0: -0.3, y1: 4.6, note: "全体实数，函数值恒正。" },
      { name: "y = ln x", f: (x) => Math.log(x), a: 0.08, b: 4, y0: -2.6, y1: 1.8, note: "只在 x > 0。左边没有图像。" },
      { name: "y = sin x", f: Math.sin, a: -6.6, b: 6.6, y0: -1.6, y1: 1.6, note: "全体实数，以 2π 为周期。" },
      {
        name: "y = tan x",
        f: (x) => { const c = Math.cos(x); return Math.abs(c) < 0.12 ? NaN : Math.sin(x) / c; },
        a: -1.35, b: 1.35, y0: -4, y1: 4,
        note: "在 ±π/2 断开。定义域要去掉这些点。",
      },
    ];
    let mode = Number(slide.dataset.elem || 0);
    function render() {
      const k = kinds[mode];
      verdict.textContent = k.name + "　·　" + k.note;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: k.a, xMax: k.b, yMin: k.y0, yMax: k.y1, title: k.name });
      Plot.curve(ctx, xOf, yOf, k.f, k.a, k.b, 240);
    }
    bind(slide, render, () => {
      btns.forEach((b) => {
        b.onclick = () => {
          mode = Number(b.dataset.elem);
          slide.dataset.elem = String(mode);
          btns.forEach((x) => x.classList.toggle("on", x === b));
          render();
        };
      });
    });
  });

  Deck.on("oddpt", (slide) => {
    const canvas = slide.querySelector("#odd-canvas");
    const xEl = slide.querySelector("#odd-x");
    const xVal = slide.querySelector("#odd-x-val");
    const read = slide.querySelector("#odd-read");
    function f(x) { return Math.log(Math.sqrt(x * x + 1) - x); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const y = f(x);
      read.textContent = `f(${x.toFixed(2)}) = ${y.toFixed(2)}，f(${(-x).toFixed(2)}) = ${f(-x).toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -3.2, xMax: 3.2, yMin: -2.4, yMax: 2.4, title: "奇函数" });
      Plot.curve(ctx, xOf, yOf, f, -3.1, 3.1, 200);
      ctx.strokeStyle = "rgba(176,122,40,0.7)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(xOf(x), yOf(y));
      ctx.lineTo(xOf(-x), yOf(-y));
      ctx.stroke();
      ctx.setLineDash([]);
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.burgundy);
      Plot.disc(ctx, xOf(-x), yOf(-y), 6, Plot.C.gold);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("phi", (slide) => {
    const canvas = slide.querySelector("#phi-canvas");
    const nEl = slide.querySelector("#phi-n");
    const nVal = slide.querySelector("#phi-n-val");
    const read = slide.querySelector("#phi-read");
    const phi = (1 + Math.sqrt(5)) / 2;
    function ratios(n) {
      let prev = 1, cur = 1;
      const out = [1];
      for (let k = 2; k <= n; k++) {
        const next = prev + cur;
        prev = cur;
        cur = next;
        out.push(cur / prev);
      }
      return out;
    }
    function render() {
      const n = Number(nEl.value);
      nVal.textContent = String(n);
      const rs = ratios(n);
      const last = rs[rs.length - 1];
      read.textContent = `F${n + 1}/F${n} = ${last.toFixed(4)}　·　黄金分割 ${phi.toFixed(4)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0.5, xMax: 14.5, yMin: 0.8, yMax: 2.2, xlabel: "n", ylabel: "比", title: "相邻斐波那契比" });
      ctx.strokeStyle = Plot.C.gold;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(xOf(0.5), yOf(phi));
      ctx.lineTo(xOf(14.5), yOf(phi));
      ctx.stroke();
      ctx.setLineDash([]);
      rs.forEach((r, i) => Plot.disc(ctx, xOf(i + 1), yOf(r), 5, Plot.C.burgundy));
    }
    bind(slide, render, () => { nEl.oninput = render; });
  });

  Deck.on("approx", (slide) => {
    const canvas = slide.querySelector("#ap-canvas");
    const dxEl = slide.querySelector("#ap-dx");
    const dxVal = slide.querySelector("#ap-dx-val");
    const read = slide.querySelector("#ap-read");
    const x0 = 4;
    const f = Math.sqrt;
    const slope = 0.25;
    function render() {
      const dx = Number(dxEl.value);
      dxVal.textContent = dx.toFixed(2);
      const actual = f(x0 + dx);
      const linear = 2 + slope * dx;
      read.textContent = `√${(x0 + dx).toFixed(2)} = ${actual.toFixed(4)}，切线给出 ${linear.toFixed(4)}，差 ${Math.abs(actual - linear).toFixed(4)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 2.5, xMax: 6, yMin: 1.4, yMax: 2.7, title: "用切线代替 √x" });
      Plot.curve(ctx, xOf, yOf, f, 2.6, 5.9, 80);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(2.6), yOf(2 + slope * (2.6 - x0)));
      ctx.lineTo(xOf(5.8), yOf(2 + slope * (5.8 - x0)));
      ctx.stroke();
      ctx.setLineDash([]);
      Plot.disc(ctx, xOf(x0 + dx), yOf(actual), 6, Plot.C.burgundy);
      Plot.disc(ctx, xOf(x0 + dx), yOf(linear), 5, Plot.C.gold);
    }
    bind(slide, render, () => { dxEl.oninput = render; });
  });

  Deck.on("vert", (slide) => {
    const canvas = slide.querySelector("#vert-canvas");
    const xEl = slide.querySelector("#vert-x");
    const xVal = slide.querySelector("#vert-x-val");
    const read = slide.querySelector("#vert-read");
    function f(x) { return Math.pow(3 - x, 3) * Math.cbrt(x * x); }
    function fp(x) {
      if (Math.abs(x) < 1e-3) return Infinity;
      const cbrt = Math.sign(x) * Math.pow(Math.abs(x), -1 / 3);
      return Math.pow(3 - x, 2) * cbrt * (2 - (11 / 3) * x);
    }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const s = fp(x);
      const near0 = Math.abs(x) < 0.12;
      const near3 = Math.abs(x - 3) < 0.12;
      read.textContent = near0
        ? "靠近 0：切线几乎竖直。"
        : near3
          ? "x≈3：切线水平，但函数仍在下降，不是极值。"
          : `斜率约 ${Number.isFinite(s) ? s.toFixed(2) : "∞"}　·　${s > 0.05 ? "上升" : s < -0.05 ? "下降" : "平"}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1, xMax: 4.2, yMin: -8, yMax: 14, title: "(3−x)³ x^(2/3)" });
      Plot.curve(ctx, xOf, yOf, f, -0.9, 4.1, 220);
      const y = f(x);
      if (!tangent(ctx, xOf, yOf, x, y, s, 0.35)) {
        ctx.strokeStyle = Plot.C.gold;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xOf(x), yOf(-7));
        ctx.lineTo(xOf(x), yOf(13));
        ctx.stroke();
      }
      Plot.disc(ctx, xOf(x), yOf(y), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("mono14", (slide) => {
    const canvas = slide.querySelector("#m14-canvas");
    const xEl = slide.querySelector("#m14-x");
    const xVal = slide.querySelector("#m14-x-val");
    const read = slide.querySelector("#m14-read");
    function f(x) { return x * x * x - 3 * x * x - 9 * x + 14; }
    function fp(x) { return 3 * (x + 1) * (x - 3); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const s = fp(x);
      let line;
      if (Math.abs(x + 1) < 0.08) line = "x=−1，左侧升、右侧降，极大值 19";
      else if (Math.abs(x - 3) < 0.08) line = "x=3，左侧降、右侧升，极小值 −13";
      else if (x < -1) line = "y'>0，在 (−∞,−1] 上递增";
      else if (x < 3) line = "y'<0，在 [−1,3] 上递减";
      else line = "y'>0，在 [3,+∞) 上递增";
      read.textContent = line;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -2.8, xMax: 4.8, yMin: -22, yMax: 30, title: "x³−3x²−9x+14" });
      Plot.curve(ctx, xOf, yOf, f, -2.7, -1, 40, { color: Plot.C.ok, width: 3 });
      Plot.curve(ctx, xOf, yOf, f, -1, 3, 60, { color: Plot.C.danger, width: 3 });
      Plot.curve(ctx, xOf, yOf, f, 3, 4.7, 40, { color: Plot.C.ok, width: 3 });
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 1.5;
      [-1, 3].forEach((t) => {
        ctx.beginPath();
        ctx.moveTo(xOf(t), yOf(-20));
        ctx.lineTo(xOf(t), yOf(28));
        ctx.stroke();
      });
      ctx.setLineDash([]);
      Plot.label(ctx, "增", xOf(-2.35), yOf(26), Plot.C.ok);
      Plot.label(ctx, "减", xOf(0.6), yOf(26), Plot.C.danger);
      Plot.label(ctx, "增", xOf(3.7), yOf(26), Plot.C.ok);
      tangent(ctx, xOf, yOf, x, f(x), s, 0.42);
      Plot.disc(ctx, xOf(-1), yOf(19), 5, Plot.C.gold);
      Plot.disc(ctx, xOf(3), yOf(-13), 5, Plot.C.gold);
      Plot.disc(ctx, xOf(x), yOf(f(x)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("concav", (slide) => {
    const canvas = slide.querySelector("#cv-canvas");
    const xEl = slide.querySelector("#cv-x");
    const xVal = slide.querySelector("#cv-x-val");
    const read = slide.querySelector("#cv-read");
    function f(x) { return x * x * x; }
    function fp(x) { return 3 * x * x; }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      read.textContent = Math.abs(x) < 0.06
        ? "x=0 是拐点，凹凸在这里切换。"
        : x < 0
          ? "f''<0，凹：切线在曲线上方。"
          : "f''>0，凸：切线在曲线下方。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1.7, xMax: 1.7, yMin: -4.2, yMax: 4.2, title: "y=x³" });
      Plot.curve(ctx, xOf, yOf, f, -1.55, 0, 50, { color: Plot.C.danger, width: 3 });
      Plot.curve(ctx, xOf, yOf, f, 0, 1.55, 50, { color: Plot.C.ok, width: 3 });
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(-4));
      ctx.lineTo(xOf(0), yOf(4));
      ctx.stroke();
      ctx.setLineDash([]);
      Plot.label(ctx, "凹", xOf(-1.35), yOf(2.6), Plot.C.danger);
      Plot.label(ctx, "凸", xOf(0.85), yOf(-2.4), Plot.C.ok);
      tangent(ctx, xOf, yOf, x, f(x), fp(x), 0.55);
      Plot.disc(ctx, xOf(0), yOf(0), 5, Plot.C.gold);
      Plot.disc(ctx, xOf(x), yOf(f(x)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("holext", (slide) => {
    const canvas = slide.querySelector("#hole-canvas");
    const xEl = slide.querySelector("#hole-x");
    const xVal = slide.querySelector("#hole-x-val");
    const read = slide.querySelector("#hole-read");
    function f(x) { return (x * x * x) / 3 - 3 * x - Math.log(x * x); }
    function fp(x) { return (x - 2) * (x + 1) * (x + 1) / x; }
    function render() {
      let x = Number(xEl.value);
      if (Math.abs(x) < 0.06) x = x < 0 ? -0.06 : 0.06;
      xVal.textContent = x.toFixed(2);
      const y = f(x);
      const s = fp(x);
      read.textContent = Math.abs(x + 1) < 0.08
        ? "x=−1 是驻点，左右导数都为正，不是极值。"
        : Math.abs(x - 2) < 0.08
          ? "x=2 是极小，y = −10/3 − 2ln2。"
          : `y ≈ ${y.toFixed(2)}　·　${s > 0 ? "上升" : "下降"}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -3.4, xMax: 4.4, yMin: -6, yMax: 8, title: "x³/3 − 3x − ln(x²)" });
      Plot.curve(ctx, xOf, yOf, f, -3.3, -0.08, 80);
      Plot.curve(ctx, xOf, yOf, f, 0.08, 4.3, 80);
      if (Math.abs(s) < 12) tangent(ctx, xOf, yOf, x, y, s, 0.45);
      Plot.disc(ctx, xOf(x), yOf(Math.max(-5.5, Math.min(7.5, y))), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("cusps", (slide) => {
    const canvas = slide.querySelector("#cusp-canvas");
    const xEl = slide.querySelector("#cusp-x");
    const xVal = slide.querySelector("#cusp-x-val");
    const read = slide.querySelector("#cusp-read");
    function f(x) { return Math.cbrt(2 * x - x * x); }
    function kind(x) {
      if (Math.abs(x + 1) < 0.08 || Math.abs(x - 4) < 0.08) return "端点";
      if (Math.abs(x) < 0.08 || Math.abs(x - 2) < 0.08) return "不可导（尖点）";
      if (Math.abs(x - 1) < 0.08) return "驻点";
      return "区间内部";
    }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      read.textContent = `${kind(x)}　·　f = ${f(x).toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1.4, xMax: 4.4, yMin: -2.6, yMax: 1.6, title: "(2x−x²) 的立方根" });
      Plot.curve(ctx, xOf, yOf, f, -1, 4, 200);
      [-1, 0, 1, 2, 4].forEach((t) => {
        const special = t === 0 || t === 2;
        Plot.disc(ctx, xOf(t), yOf(f(t)), special ? 5 : 4, special ? Plot.C.gold : Plot.C.ink);
      });
      Plot.disc(ctx, xOf(x), yOf(f(x)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("boxvol", (slide) => {
    const canvas = slide.querySelector("#box-canvas");
    const xEl = slide.querySelector("#box-x");
    const xVal = slide.querySelector("#box-x-val");
    const read = slide.querySelector("#box-read");
    const a = 12;
    function V(x) { return x * (a - 2 * x) * (a - 2 * x); }
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      read.textContent = `底边 ${ (a - 2 * x).toFixed(2) }，高 ${x.toFixed(2)}，体积 ${V(x).toFixed(1)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: 6, yMin: 0, yMax: 140, xlabel: "x", ylabel: "V", title: "无盖盒子的体积" });
      Plot.curve(ctx, xOf, yOf, V, 0.05, 5.9, 80);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = Plot.C.gold;
      ctx.beginPath();
      ctx.moveTo(xOf(2), yOf(0));
      ctx.lineTo(xOf(2), yOf(130));
      ctx.stroke();
      ctx.setLineDash([]);
      Plot.disc(ctx, xOf(x), yOf(V(x)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("twins", (slide) => {
    const canvas = slide.querySelector("#twin-canvas");
    const xEl = slide.querySelector("#twin-x");
    const xVal = slide.querySelector("#twin-x-val");
    const read = slide.querySelector("#twin-read");
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      const a = Math.asin(x);
      const b = -Math.acos(x);
      read.textContent = `arcsin = ${a.toFixed(3)}，−arccos = ${b.toFixed(3)}，差 ${(a - b).toFixed(3)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -1.2, xMax: 1.2, yMin: -2, yMax: 2, title: "arcsin 与 −arccos" });
      Plot.curve(ctx, xOf, yOf, Math.asin, -0.98, 0.98, 80, { color: Plot.C.burgundy });
      Plot.curve(ctx, xOf, yOf, (t) => -Math.acos(t), -0.98, 0.98, 80, { color: Plot.C.teal });
      ctx.strokeStyle = Plot.C.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(x), yOf(a));
      ctx.lineTo(xOf(x), yOf(b));
      ctx.stroke();
      Plot.disc(ctx, xOf(x), yOf(a), 5, Plot.C.burgundy);
      Plot.disc(ctx, xOf(x), yOf(b), 5, Plot.C.teal);
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });

  Deck.on("learn", (slide) => {
    const canvas = slide.querySelector("#learn-canvas");
    const tEl = slide.querySelector("#learn-t");
    const tVal = slide.querySelector("#learn-t-val");
    const read = slide.querySelector("#learn-read");
    function y(t) { return 60 * (1 - Math.pow(0.75, t / 20)); }
    function render() {
      const t = Number(tEl.value);
      tVal.textContent = String(t);
      read.textContent = `${t} 分钟记住约 ${y(t).toFixed(1)} 件，还差 ${(60 - y(t)).toFixed(1)} 件`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: 180, yMin: 0, yMax: 70, xlabel: "分钟", ylabel: "件", title: "学习曲线" });
      Plot.curve(ctx, xOf, yOf, y, 0, 180, 120);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = Plot.C.gold;
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(60));
      ctx.lineTo(xOf(180), yOf(60));
      ctx.stroke();
      ctx.setLineDash([]);
      Plot.disc(ctx, xOf(t), yOf(y(t)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { tEl.oninput = render; });
  });

  Deck.on("wpop", (slide) => {
    const canvas = slide.querySelector("#pop-canvas");
    const tEl = slide.querySelector("#pop-t");
    const tVal = slide.querySelector("#pop-t-val");
    const read = slide.querySelector("#pop-read");
    const y0 = 29.8, r0 = 0.029, ym = 82.3;
    const c = ym / y0 - 1;
    function logistic(t) { return ym / (1 + c * Math.exp(-r0 * t)); }
    function expo(t) { return y0 * Math.exp(0.0185 * t); }
    function render() {
      const t = Number(tEl.value);
      tVal.textContent = String(t);
      read.textContent = `${1960 + t} 年：阻滞 ${logistic(t).toFixed(1)} 亿，指数 ${expo(t).toFixed(1)} 亿`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: 0, xMax: 100, yMin: 0, yMax: 180, xlabel: "年", ylabel: "亿", title: "1960 年起" });
      Plot.curve(ctx, xOf, yOf, logistic, 0, 100, 100, { color: Plot.C.burgundy });
      ctx.setLineDash([5, 4]);
      Plot.curve(ctx, xOf, yOf, expo, 0, 100, 80, { color: Plot.C.gold, width: 2 });
      ctx.setLineDash([]);
      Plot.disc(ctx, xOf(t), yOf(logistic(t)), 6, Plot.C.burgundy);
    }
    bind(slide, render, () => { tEl.oninput = render; });
  });

  Deck.on("dom2", (slide) => {
    const canvas = slide.querySelector("#dom2-canvas");
    const btns = [...slide.querySelectorAll("[data-dom]")];
    const verdict = slide.querySelector("#dom2-verdict");
    let mode = slide.dataset.dom || "hole";
    function render() {
      verdict.textContent = mode === "hole"
        ? "1/(x²+y²)：整张平面，只挖掉原点。"
        : "√x + √y：第一象限，含两条正半轴。";
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const R = 2;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -R, xMax: R, yMin: -R, yMax: R, title: mode === "hole" ? "挖去原点" : "第一象限" });
      ctx.fillStyle = "rgba(107,20,86,0.28)";
      if (mode === "quad") {
        ctx.fillRect(xOf(0), yOf(R), xOf(R) - xOf(0), yOf(0) - yOf(R));
      } else {
        ctx.fillRect(xOf(-R), yOf(R), xOf(R) - xOf(-R), yOf(-R) - yOf(R));
        Plot.disc(ctx, xOf(0), yOf(0), 7, Plot.C.card, Plot.C.burgundy);
      }
      ctx.strokeStyle = "rgba(36,22,22,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xOf(-R), yOf(0)); ctx.lineTo(xOf(R), yOf(0));
      ctx.moveTo(xOf(0), yOf(-R)); ctx.lineTo(xOf(0), yOf(R));
      ctx.stroke();
    }
    bind(slide, render, () => {
      btns.forEach((b) => {
        b.onclick = () => {
          mode = b.dataset.dom;
          slide.dataset.dom = mode;
          btns.forEach((x) => x.classList.toggle("on", x === b));
          render();
        };
      });
    });
  });

  Deck.on("trix", (slide) => {
    const canvas = slide.querySelector("#trix-canvas");
    const xEl = slide.querySelector("#trix-x");
    const xVal = slide.querySelector("#trix-x-val");
    const read = slide.querySelector("#trix-read");
    function render() {
      const x = Number(xEl.value);
      xVal.textContent = x.toFixed(2);
      read.textContent = `这条竖条：y 从 0 到 ${(1 - x).toFixed(2)}`;
      const { ctx, w, h } = Deck.fitCanvas(canvas);
      if (w < 80) return;
      const { xOf, yOf } = Plot.axes(ctx, w, h, { xMin: -0.15, xMax: 1.25, yMin: -0.15, yMax: 1.25, title: "x+y ≤ 1" });
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(0));
      ctx.lineTo(xOf(1), yOf(0));
      ctx.lineTo(xOf(0), yOf(1));
      ctx.closePath();
      ctx.fillStyle = "rgba(107,20,86,0.2)";
      ctx.fill();
      ctx.strokeStyle = Plot.C.burgundy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = "rgba(36,22,22,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xOf(-0.15), yOf(0)); ctx.lineTo(xOf(1.25), yOf(0));
      ctx.moveTo(xOf(0), yOf(-0.15)); ctx.lineTo(xOf(0), yOf(1.25));
      ctx.stroke();
      const half = 0.03;
      ctx.fillStyle = "rgba(176,122,40,0.85)";
      ctx.beginPath();
      ctx.moveTo(xOf(x - half), yOf(0));
      ctx.lineTo(xOf(x + half), yOf(0));
      ctx.lineTo(xOf(x + half), yOf(1 - x));
      ctx.lineTo(xOf(x - half), yOf(1 - x));
      ctx.closePath();
      ctx.fill();
    }
    bind(slide, render, () => { xEl.oninput = render; });
  });
})();
