/* 概念图鉴 · 微积分 */
(function () {
  const A = window.A;
  const M = window.AtlasMath;
  const C = A.C;
  const scenes = [];
  const rng = A.rng, cho = A.cho, say = A.say, num = A.num;

  scenes.push({
    id: "piece", ch: "fn", title: "分段函数", keys: "绝对值 折点 连续",
    lead: "一个函数可以分段来写。折点上函数值接得上，斜率却左右不同。",
    init: { x: 0.4 },
    controls: [rng("x", "位置 x", -1.2, 3.2, 0.02, 2)],
    presets: [{ name: "左支", set: { x: -0.4 } }, { name: "折点", set: { x: 1 } }, { name: "右支", set: { x: 2.2 } }],
    read(st) {
      const y = Math.abs(st.x - 1);
      const side = st.x < 1 ? "左支 y = 1 − x，斜率 −1" : st.x > 1 ? "右支 y = x − 1，斜率 +1" : "正在折点上";
      return say("|x − 1| = " + num(y, 2), side + "。值是连续的，导数要等下一讲再问。");
    },
    draw(ctx, w, h, st) {
      const f = (x) => Math.abs(x - 1);
      const box = A.axes(ctx, w, h, { xMin: -1.5, xMax: 3.5, yMin: -0.4, yMax: 3.2, title: "y = |x − 1|" });
      A.curve(ctx, box, f, -1.5, 3.5, 80);
      A.disc(ctx, box.xOf(st.x), box.yOf(f(st.x)), 6, C.gold);
    },
  });

  scenes.push({
    id: "fee", ch: "fn", title: "交易费", keys: "分段 空心点 费率",
    lead: "示意 p = 0.8，q = 2。不交易不收费；不到 q 一律收 pq；超过 q 按费率收。",
    init: { x: 1 },
    controls: [rng("x", "交易额 x", 0, 6, 0.02, 2)],
    presets: [{ name: "不交易", set: { x: 0 } }, { name: "定额", set: { x: 1 } }, { name: "刚好 q", set: { x: 2 } }, { name: "按费率", set: { x: 4 } }],
    read(st) {
      const y = M.fee(st.x);
      let text = "超过 q 之后是一条射线 y = px。";
      if (st.x === 0) text = "x = 0 时费用是 0。往右挪一点点，费用立刻跳到 pq = 1.6。";
      else if (st.x < 2) text = "交易额不到 q，一律收 pq = 1.6。左端是空心点，不含 x = 0。";
      else if (Math.abs(st.x - 2) < 0.03) text = "x = q 时两段都给出 1.6，线段和射线在这里接上。";
      return say("y = " + num(y, 2), text, Math.abs(st.x - 2) < 0.03 || st.x === 0 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const p = 0.8, q = 2;
      const box = A.axes(ctx, w, h, { xMin: -0.4, xMax: 6.2, yMin: -0.3, yMax: 5.2, xlabel: "交易额 x", ylabel: "费用 y", title: "交易费" });
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(box.xOf(0.04), box.yOf(p * q));
      ctx.lineTo(box.xOf(q), box.yOf(p * q));
      ctx.stroke();
      A.curve(ctx, box, (t) => p * t, q, 6.1, 20);
      A.disc(ctx, box.xOf(0), box.yOf(0), 6, C.burgundy);
      A.disc(ctx, box.xOf(0), box.yOf(p * q), 6, C.card, C.burgundy);
      A.dash(ctx, box.xOf(q), box.yOf(0), box.xOf(q), box.yOf(p * q), C.muted);
      A.label(ctx, "q", box.xOf(q) + 6, box.yOf(0) + 18, C.muted, 14);
      A.disc(ctx, box.xOf(st.x), box.yOf(M.fee(st.x)), 7, C.gold);
    },
  });

  scenes.push({
    id: "floor", ch: "fn", title: "取整", keys: "高斯 负数 左闭右开",
    lead: "取整向 −∞ 取，不是把小数抹掉。负数最容易写错。实心点在左，空心点在右。",
    init: { x: -0.2 },
    controls: [rng("x", "x", -2.4, 2.6, 0.01, 2)],
    presets: [{ name: "−0.2", set: { x: -0.2 } }, { name: "1.01", set: { x: 1.01 } }, { name: "整数 1", set: { x: 1 } }, { name: "−2", set: { x: -2 } }],
    read(st) {
      const y = Math.floor(st.x + 1e-9);
      const onInt = Math.abs(st.x - Math.round(st.x)) < 0.015;
      return say("[" + num(st.x, 2) + "] = " + y, onInt
        ? "整数点取左端的实心点。"
        : y + " ≤ x < " + (y + 1) + "，取左边那个整数。负数也是向左取，不是向 0 取。", st.x < 0 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -2.6, xMax: 2.8, yMin: -3, yMax: 3, title: "y = [x]" });
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2.3;
      for (let k = -3; k <= 2; k++) {
        ctx.beginPath();
        ctx.moveTo(box.xOf(k), box.yOf(k));
        ctx.lineTo(box.xOf(k + 1 - 0.02), box.yOf(k));
        ctx.stroke();
        A.disc(ctx, box.xOf(k), box.yOf(k), 5, C.burgundy);
        A.disc(ctx, box.xOf(k + 1), box.yOf(k), 5, C.card, C.burgundy);
      }
      const y = Math.floor(st.x + 1e-9);
      A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.gold);
    },
  });

  scenes.push({
    id: "compose", ch: "fn", title: "复合", keys: "里层 外层 次序 换序",
    lead: "先走里层，再走外层。次序是定义的一部分，换一下通常是另一个函数。",
    init: { x: 2 },
    controls: [rng("x", "输入 x", -4, 4, 0.1, 1)],
    presets: [{ name: "x = 0", set: { x: 0 } }, { name: "x = 2", set: { x: 2 } }, { name: "x = −2", set: { x: -2 } }],
    read(st) {
      const u = st.x / 2 + 1;
      const y = u * u;
      const swap = (st.x * st.x) / 2 + 1;
      const same = Math.abs(y - swap) < 1e-9;
      return say("x → u = " + num(u, 2) + " → y = " + num(y, 2),
        same ? "这一点上两种次序碰巧相等。换一个 x 再看。" : "先平方再「除以 2 加 1」得到 " + num(swap, 2) + "，和先里后外不同。",
        same ? "" : "good");
    },
    draw(ctx, w, h, st) {
      const u = st.x / 2 + 1, y = u * u;
      const top = h > 460 ? Math.floor(h * 0.46) : h;
      ctx.fillStyle = C.card;
      ctx.fillRect(0, 0, w, top);
      const bw = Math.min(132, w * 0.18), bh = Math.min(92, top * 0.46);
      const by = top * 0.52 - bh / 2;
      const xs = [w * 0.08, w * 0.5 - bw / 2, w * 0.92 - bw];
      ctx.strokeStyle = C.gold;
      ctx.fillStyle = C.gold;
      ctx.lineWidth = 2.4;
      for (let i = 0; i < 2; i++) {
        const x0 = xs[i] + bw + 8, x1 = xs[i + 1] - 12, ym = top * 0.52;
        ctx.beginPath(); ctx.moveTo(x0, ym); ctx.lineTo(x1 - 8, ym); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x1, ym); ctx.lineTo(x1 - 10, ym - 6); ctx.lineTo(x1 - 10, ym + 6); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = C.muted;
      ctx.font = "14px " + A.SERIF;
      ctx.textAlign = "center";
      ctx.fillText("u = x/2 + 1", (xs[0] + bw + xs[1]) / 2, top * 0.52 - 16);
      ctx.fillText("y = u²", (xs[1] + bw + xs[2]) / 2, top * 0.52 - 16);
      [["输入 x", num(st.x, 1)], ["里层 u", num(u, 2)], ["外层 y", num(y, 2)]].forEach((pair, i) => {
        ctx.fillStyle = C.burgundy;
        ctx.fillRect(xs[i], by, bw, bh);
        ctx.fillStyle = C.paper;
        ctx.font = "14px " + A.SERIF;
        ctx.fillText(pair[0], xs[i] + bw / 2, by + bh * 0.38);
        ctx.font = "22px " + A.SERIF;
        ctx.fillText(pair[1], xs[i] + bw / 2, by + bh * 0.72);
      });
      if (h > 460) {
        A.pane(ctx, 0, top, w, h - top, (pw, ph) => {
          const box = A.axes(ctx, pw, ph, { xMin: -4, xMax: 4, yMin: -0.5, yMax: 10, title: "两种次序", xlabel: "x", ylabel: "y" });
          A.curve(ctx, box, (x) => Math.pow(x / 2 + 1, 2), -4, 4, 80, { color: C.burgundy });
          A.curve(ctx, box, (x) => (x * x) / 2 + 1, -4, 4, 80, { color: C.teal, dash: [6, 4] });
          A.disc(ctx, box.xOf(st.x), box.yOf(y), 5, C.gold);
          A.label(ctx, "先里后外", box.l + 8, box.t + 22, C.burgundy, 13);
          A.label(ctx, "换序", box.l + 8, box.t + 40, C.teal, 13);
        });
      }
    },
  });

  scenes.push({
    id: "inverse", ch: "fn", title: "反函数", keys: "镜像 y=x 对数 反正弦 平方",
    lead: "点 (x, f(x)) 关于 y = x 翻到 (f(x), x)。翻过去仍是函数，才叫有反函数。",
    init: { kind: "exp", x: 1.2 },
    controls: [
      cho("kind", "函数", [["exp", "2ˣ"], ["cube", "x³"], ["sin", "sin"], ["sq", "x²"]]),
      rng("x", "x", -2, 2, 0.02, 2),
    ],
    presets: [{ name: "指数", set: { kind: "exp", x: 1.2 } }, { name: "立方", set: { kind: "cube", x: 1.1 } }, { name: "正弦", set: { kind: "sin", x: 0.8 } }, { name: "平方", set: { kind: "sq", x: 1.4 } }],
    read(st) {
      const pack = invPack(st);
      if (st.kind === "sq") return say("P = (" + num(pack.x, 2) + ", " + num(pack.y, 2) + ")", "同一个 y 来自 x 和 −x。翻折后一条竖线碰到两点，这不是函数。先把定义域限制到 [0, ∞)，才有 y = √x。", "bad");
      if (st.kind === "sin" && Math.abs(st.x) > Math.PI / 2) return say("超出 [−π/2, π/2]", "整条正弦翻过去不是函数。反函数只承认这一段，翻过去才是 arcsin。", "bad");
      return say("P = (" + num(pack.x, 2) + ", " + num(pack.y, 2) + ")　Q = (" + num(pack.y, 2) + ", " + num(pack.x, 2) + ")", "一一对应：水平线只碰原曲线一次，翻折后竖线也只碰一次。", "good");
    },
    draw(ctx, w, h, st) {
      const pack = invPack(st);
      const R = 4.2;
      const box = A.axes(ctx, w, h, { xMin: -R, xMax: R, yMin: -R, yMax: R, equal: true, title: pack.title, xlabel: "", ylabel: "" });
      A.clip(ctx, box, () => {
        A.dash(ctx, box.xOf(-R), box.yOf(-R), box.xOf(R), box.yOf(R), C.gold);
        if (st.kind === "sin") A.curve(ctx, box, Math.sin, -R, R, 240, { color: "rgba(107,20,86,0.2)", width: 1.6 });
        A.curve(ctx, box, pack.f, pack.lo, pack.hi, 180);
        ctx.beginPath();
        ctx.strokeStyle = C.teal;
        ctx.lineWidth = 2.4;
        for (let i = 0; i <= 180; i++) {
          const s = pack.lo + (i / 180) * (pack.hi - pack.lo);
          const X = box.xOf(pack.f(s)), Y = box.yOf(s);
          if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        A.dash(ctx, box.xOf(pack.x), box.yOf(pack.y), box.xOf(pack.y), box.yOf(pack.x), C.muted);
        if (st.kind === "sq") {
          A.disc(ctx, box.xOf(-pack.x), box.yOf(pack.y), 5, C.card, C.burgundy);
          A.disc(ctx, box.xOf(pack.y), box.yOf(-pack.x), 5, C.card, C.teal);
        }
      });
      A.disc(ctx, box.xOf(pack.x), box.yOf(pack.y), 6, C.burgundy);
      A.disc(ctx, box.xOf(pack.y), box.yOf(pack.x), 6, C.teal);
      A.label(ctx, "y = x", box.xOf(2.4), box.yOf(2.8), C.gold, 14);
      A.label(ctx, "原函数", box.l + 8, box.t + 22, C.burgundy, 13);
      A.label(ctx, "翻折", box.l + 8, box.t + 40, C.teal, 13);
    },
  });

  function invPack(st) {
    if (st.kind === "cube") return { f: (x) => x * x * x, lo: -1.6, hi: 1.6, x: st.x, y: st.x * st.x * st.x, title: "y = x³ 与立方根" };
    if (st.kind === "sin") {
      const x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, st.x));
      return { f: Math.sin, lo: -Math.PI / 2, hi: Math.PI / 2, x, y: Math.sin(x), title: "y = sin x（只取一段）" };
    }
    if (st.kind === "sq") return { f: (x) => x * x, lo: -1.8, hi: 1.8, x: st.x, y: st.x * st.x, title: "y = x² 翻折之后" };
    const x = Math.max(-2, Math.min(2, st.x));
    return { f: (t) => Math.pow(2, t), lo: -2.2, hi: 2, x, y: Math.pow(2, x), title: "y = 2ˣ 与 y = log₂x" };
  }

  const ELEM = {
    sq: { name: "y = x²", f: (x) => x * x, a: -2.2, b: 2.2, y0: -0.4, y1: 4.6, note: "幂函数。全体实数都有定义，开口向上，没有上界。" },
    exp: { name: "y = 2ˣ", f: (x) => Math.pow(2, x), a: -2.6, b: 3, y0: -0.4, y1: 8.2, note: "指数函数。全体实数都有定义，函数值恒正，没有上界。" },
    ln: { name: "y = ln x", f: (x) => (x > 0 ? Math.log(x) : NaN), a: -1, b: 6, y0: -2.8, y1: 2, note: "对数只在 x > 0 有定义。左半边没有图像。" },
    sin: { name: "y = sin x", f: Math.sin, a: -6.6, b: 6.6, y0: -1.6, y1: 1.6, note: "周期 2π，并且有界：永远夹在 ±1 之间。" },
    tan: { name: "y = tan x", f: (x) => { const c = Math.cos(x); return Math.abs(c) < 0.07 ? NaN : Math.sin(x) / c; }, a: -4.2, b: 4.2, y0: -4, y1: 4, note: "在 π/2 + kπ 处断开。定义域要挖掉这些点。" },
    asin: { name: "y = arcsin x", f: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN), a: -1.6, b: 1.6, y0: -1.8, y1: 1.8, note: "定义域只有 [−1, 1]，值落在 [−π/2, π/2]。" },
  };

  scenes.push({
    id: "elem", ch: "fn", title: "初等函数", keys: "幂 指数 对数 三角 定义域 值域 周期 有界",
    lead: "先看定义域：哪里有图像，哪里是空的。再看它有没有上界、有没有周期。",
    init: { kind: "ln", x: 1 },
    controls: [
      cho("kind", "函数", [["sq", "x²"], ["exp", "2ˣ"], ["ln", "ln"], ["sin", "sin"], ["tan", "tan"], ["asin", "arcsin"]]),
      rng("x", "探针 x", -6, 6, 0.05, 2),
    ],
    presets: [{ name: "对数", set: { kind: "ln", x: -0.5 } }, { name: "正切", set: { kind: "tan", x: 1.2 } }, { name: "正弦", set: { kind: "sin", x: 1.57 } }],
    read(st) {
      const k = ELEM[st.kind];
      const y = k.f(st.x);
      const head = Number.isFinite(y) ? "f(" + num(st.x, 2) + ") = " + num(y, 2) : "x = " + num(st.x, 2) + " 不在定义域里";
      return say(head, k.note, Number.isFinite(y) ? "" : "bad");
    },
    draw(ctx, w, h, st) {
      const k = ELEM[st.kind];
      const box = A.axes(ctx, w, h, { xMin: k.a, xMax: k.b, yMin: k.y0, yMax: k.y1, title: k.name });
      A.curve(ctx, box, k.f, k.a, k.b, 400);
      const y = k.f(st.x);
      if (Number.isFinite(y) && st.x >= k.a && st.x <= k.b) A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.gold);
    },
  });

  const PAR = {
    cube: { name: "y = x³", f: (x) => x * x * x, kind: "奇", a: -2, b: 2, y0: -8, y1: 8, bound: null },
    sq: { name: "y = x²", f: (x) => x * x, kind: "偶", a: -2.2, b: 2.2, y0: -0.6, y1: 4.8, bound: null },
    sin: { name: "y = sin x", f: Math.sin, kind: "奇", a: -6.4, b: 6.4, y0: -1.7, y1: 1.7, bound: 1 },
    abs: { name: "y = |x|", f: Math.abs, kind: "偶", a: -3, b: 3, y0: -0.4, y1: 3.2, bound: null },
    exp: { name: "y = eˣ", f: Math.exp, kind: "无", a: -2, b: 2.2, y0: -0.5, y1: 8, bound: null },
  };

  scenes.push({
    id: "parity", ch: "fn", title: "奇偶与有界", keys: "奇函数 偶函数 对称 有界",
    lead: "偶函数关于 y 轴对称，奇函数关于原点对称。有界，就是能被两条水平线永远夹住。",
    init: { kind: "cube", x: 1.2 },
    controls: [
      cho("kind", "函数", [["cube", "x³"], ["sq", "x²"], ["sin", "sin"], ["abs", "|x|"], ["exp", "eˣ"]]),
      rng("x", "x", -2, 2, 0.02, 2),
    ],
    presets: [{ name: "奇", set: { kind: "cube", x: 1.2 } }, { name: "偶", set: { kind: "sq", x: 1.4 } }, { name: "有界", set: { kind: "sin", x: 1 } }, { name: "都不是", set: { kind: "exp", x: 1 } }],
    read(st) {
      const k = PAR[st.kind];
      const y = k.f(st.x), ym = k.f(-st.x);
      let text = "f(−x) = " + num(ym, 2) + "，−f(x) = " + num(-y, 2) + "。两者不同，也不是相等，所以非奇非偶。";
      if (k.kind === "奇") text = "f(−x) = −f(x)。绕原点转 180° 还是它自己。";
      if (k.kind === "偶") text = "f(−x) = f(x)。左右两支是镜子。";
      if (k.bound) text += " 并且 |f| ≤ " + k.bound + "，有界。";
      else if (st.kind !== "sin") text += " 往远处走没有水平线能永远夹住它，无界。";
      return say("f(" + num(st.x, 2) + ") = " + num(y, 2), text, k.kind === "无" ? "" : "good");
    },
    draw(ctx, w, h, st) {
      const k = PAR[st.kind];
      const box = A.axes(ctx, w, h, { xMin: k.a, xMax: k.b, yMin: k.y0, yMax: k.y1, title: k.name });
      if (k.bound) {
        A.dash(ctx, box.xOf(k.a), box.yOf(k.bound), box.xOf(k.b), box.yOf(k.bound), C.teal);
        A.dash(ctx, box.xOf(k.a), box.yOf(-k.bound), box.xOf(k.b), box.yOf(-k.bound), C.teal);
      }
      A.curve(ctx, box, k.f, k.a, k.b, 200);
      const x = Math.max(k.a, Math.min(k.b, st.x));
      const y = k.f(x);
      A.clip(ctx, box, () => {
        if (k.kind === "偶") A.dash(ctx, box.xOf(x), box.yOf(y), box.xOf(-x), box.yOf(y), C.gold);
        else if (k.kind === "奇") A.dash(ctx, box.xOf(x), box.yOf(y), box.xOf(-x), box.yOf(-y), C.gold);
        else {
          A.disc(ctx, box.xOf(-x), box.yOf(k.f(-x)), 5, C.card, C.teal);
          A.disc(ctx, box.xOf(-x), box.yOf(-y), 5, C.card, C.gold);
        }
      });
      A.disc(ctx, box.xOf(x), box.yOf(y), 6, C.burgundy);
      if (k.kind !== "无") A.disc(ctx, box.xOf(-x), box.yOf(k.kind === "奇" ? -y : y), 6, C.gold);
    },
  });

  scenes.push({
    id: "seq", ch: "lim", title: "数列与 ε", keys: "极限 黄金分割 重要极限 e 发散 夹逼",
    lead: "极限说的是：带子再窄，从某一项往后，点都掉进带子里。有一项掉出去，就不能算。",
    init: { kind: "inv", n: 16, eps: 0.12 },
    controls: [
      cho("kind", "数列", [["inv", "1/n"], ["e", "(1+1/n)ⁿ"], ["phi", "黄金分割"], ["alt", "(−1)ⁿ/n"], ["bad", "(−1)ⁿ"]]),
      rng("n", "看到第 n 项", 1, 40, 1, 0),
      rng("eps", "带宽 ε", 0.02, 1, 0.01, 2),
    ],
    presets: [{ name: "1/n", set: { kind: "inv", n: 20, eps: 0.1 } }, { name: "e", set: { kind: "e", n: 30, eps: 0.05 } }, { name: "黄金分割", set: { kind: "phi", n: 12, eps: 0.02 } }, { name: "不收敛", set: { kind: "bad", n: 16, eps: 0.5 } }],
    read(st) {
      const n = Math.round(st.n);
      const a = M.seqTerm(st.kind, n);
      const L = M.seqLimit(st.kind);
      if (L == null) {
        return say("aₙ = " + (n % 2 ? "−1" : "1"), st.eps >= 1
          ? "ε ≥ 1 时 ±1 都落在带里。定义要求每一个更小的 ε 也行，把 ε 收到 0.5，后面的项就不断跳出去。"
          : "奇数项和偶数项永远隔着 2。不存在一个 N，使后面所有项都留在带里。", "bad");
      }
      let N = 0;
      for (let k = 1; k <= 80; k++) if (Math.abs(M.seqTerm(st.kind, k) - L) >= st.eps - 1e-12) N = k;
      const inside = Math.abs(a - L) < st.eps;
      const settled = N < 80;
      return say("a" + n + " = " + num(a, 4) + "　极限 " + num(L, 4),
        settled
          ? "从第 " + (N + 1) + " 项起，后面都落在 ε 带里。" + (inside ? " 当前这一项已经在带内。" : " 当前这一项还在带外。")
          : "前 80 项还没全部进带。把 ε 放宽，或承认它靠近得很慢。",
        settled && n > N ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const n = Math.round(st.n);
      const L = M.seqLimit(st.kind);
      const show = Math.max(n, 12);
      let y0 = -1.4, y1 = 1.4, title = "aₙ";
      if (st.kind === "inv") { y0 = -0.1; y1 = 1.15; title = "aₙ = 1/n"; }
      if (st.kind === "e") { y0 = 2.15; y1 = 2.85; title = "(1+1/n)ⁿ → e"; }
      if (st.kind === "phi") { y0 = 1; y1 = 2.3; title = "相邻斐波那契之比"; }
      if (st.kind === "alt") { y0 = -1.2; y1 = 1.2; title = "(−1)ⁿ / n"; }
      if (st.kind === "bad") { y0 = -1.6; y1 = 1.6; title = "(−1)ⁿ 不收敛"; }
      const box = A.axes(ctx, w, h, { xMin: 0, xMax: show + 1, yMin: y0, yMax: y1, xlabel: "n", ylabel: "aₙ", title });
      const center = L == null ? 0 : L;
      const yA = box.yOf(center + st.eps), yB = box.yOf(center - st.eps);
      ctx.fillStyle = "rgba(27,95,92,0.16)";
      ctx.fillRect(box.l, Math.min(yA, yB), box.pw, Math.abs(yB - yA));
      if (L != null) A.dash(ctx, box.xOf(0), box.yOf(L), box.xOf(show + 1), box.yOf(L), C.teal);
      for (let k = 1; k <= show; k++) {
        const y = M.seqTerm(st.kind, k);
        const ok = L != null && Math.abs(y - L) < st.eps;
        A.disc(ctx, box.xOf(k), box.yOf(y), k === n ? 6 : 3.5, k === n ? C.gold : ok ? C.teal : C.burgundy);
      }
    },
  });

  scenes.push({
    id: "cont", ch: "lim", title: "左右极限与连续", keys: "跳跃 可去间断 空心 补定义",
    lead: "极限看靠近时的趋势，不看那一个点上写了什么。左右不一致，极限就不存在。",
    init: { mode: "sign", x: -0.6, fill: "no" },
    controls: [
      cho("mode", "例子", [["sign", "符号函数"], ["hole", "可去间断"], ["step", "跳跃"]]),
      rng("x", "x", -2, 2, 0.02, 2),
      cho("fill", "在洞上", [["no", "留空"], ["yes", "补上 2"]], (s) => s.mode === "hole"),
    ],
    presets: [{ name: "从左", set: { mode: "sign", x: -0.4 } }, { name: "从右", set: { mode: "sign", x: 0.4 } }, { name: "可去", set: { mode: "hole", x: 1, fill: "no" } }, { name: "补上", set: { mode: "hole", x: 1, fill: "yes" } }],
    read(st) {
      if (st.mode === "sign") {
        if (Math.abs(st.x) < 0.04) return say("停在 0", "左右极限一个是 −1，一个是 +1。在 0 上写什么数都无法让它连续。", "bad");
        return say(st.x < 0 ? "左极限 −1" : "右极限 +1", st.x < 0 ? "从左边靠近，值钉在 −1。" : "从右边靠近，值钉在 +1。左右不同，极限不存在。", "bad");
      }
      if (st.mode === "step") {
        return say(st.x < 0 ? "左边是 0" : "右边是 1", "左极限 0，右极限 1。跳跃间断，极限不存在。", "bad");
      }
      const filled = st.fill === "yes";
      return say("极限是 2", filled ? "把 f(1) 定义成 2 之后，极限等于函数值，连续了。" : "x ≠ 1 时它就是 x + 1。洞在 (1, 2)。极限存在，只是原来没定义，所以不连续。", filled ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -2.2, xMax: 2.4, yMin: -1.6, yMax: 3.2, title: st.mode === "hole" ? "(x²−1)/(x−1)" : st.mode === "step" ? "跳跃" : "符号函数" });
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2.4;
      if (st.mode === "sign") {
        ctx.beginPath(); ctx.moveTo(box.xOf(-2.2), box.yOf(-1)); ctx.lineTo(box.xOf(0), box.yOf(-1)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(box.xOf(0), box.yOf(1)); ctx.lineTo(box.xOf(2.4), box.yOf(1)); ctx.stroke();
        A.disc(ctx, box.xOf(0), box.yOf(-1), 5, C.card, C.burgundy);
        A.disc(ctx, box.xOf(0), box.yOf(1), 5, C.burgundy);
        const y = st.x < 0 ? -1 : 1;
        A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.gold);
      } else if (st.mode === "step") {
        ctx.beginPath(); ctx.moveTo(box.xOf(-2.2), box.yOf(0)); ctx.lineTo(box.xOf(0), box.yOf(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(box.xOf(0), box.yOf(1)); ctx.lineTo(box.xOf(2.4), box.yOf(1)); ctx.stroke();
        A.disc(ctx, box.xOf(0), box.yOf(0), 5, C.card, C.burgundy);
        A.disc(ctx, box.xOf(0), box.yOf(1), 5, C.burgundy);
        A.disc(ctx, box.xOf(st.x), box.yOf(st.x < 0 ? 0 : 1), 6, C.gold);
      } else {
        A.curve(ctx, box, (x) => x + 1, -2, 0.97, 40);
        A.curve(ctx, box, (x) => x + 1, 1.03, 2.2, 40);
        if (st.fill === "yes") A.disc(ctx, box.xOf(1), box.yOf(2), 6, C.burgundy);
        else A.disc(ctx, box.xOf(1), box.yOf(2), 6, C.card, C.burgundy);
        if (Math.abs(st.x - 1) > 0.03) A.disc(ctx, box.xOf(st.x), box.yOf(st.x + 1), 6, C.gold);
        else if (st.fill === "yes") A.disc(ctx, box.xOf(1), box.yOf(2), 6, C.gold);
      }
    },
  });

  scenes.push({
    id: "squeeze", ch: "lim", title: "夹逼", keys: "振荡 x sin(1/x) 无穷小",
    lead: "中间那条晃得很凶，但逃不出 ±x。两边都走向 0，中间只能跟着走。",
    init: { z: 0.7 },
    controls: [rng("z", "窗口半宽", 0.12, 2, 0.01, 2)],
    presets: [{ name: "看清振荡", set: { z: 0.35 } }, { name: "拉远", set: { z: 1.6 } }],
    read(st) {
      return say("−|x| ≤ x sin(1/x) ≤ |x|", "把窗口收到 0 附近：包络变成一条缝，振荡被夹进 0。", "good");
    },
    draw(ctx, w, h, st) {
      const z = st.z;
      const box = A.axes(ctx, w, h, { xMin: -z, xMax: z, yMin: -z, yMax: z, equal: true, title: "x sin(1/x)" });
      A.curve(ctx, box, (x) => x, -z, z, 20, { color: C.gold, width: 1.4 });
      A.curve(ctx, box, (x) => -x, -z, z, 20, { color: C.gold, width: 1.4 });
      A.curve(ctx, box, (x) => (Math.abs(x) < 1e-4 ? 0 : x * Math.sin(1 / x)), -z, z, 900);
    },
  });

  scenes.push({
    id: "circle", ch: "lim", title: "单位圆与 sin x / x", keys: "重要极限 夹逼 弧度",
    lead: "小三角在扇形里面，扇形又在大三角里面。于是 sin θ < θ < tan θ，夹出 sin θ / θ → 1。",
    init: { deg: 32 },
    controls: [rng("deg", "角度 θ", 8, 70, 1, 0)],
    presets: [{ name: "很尖", set: { deg: 12 } }, { name: "45°", set: { deg: 45 } }],
    read(st) {
      const th = st.deg * Math.PI / 180;
      const s = Math.sin(th), ratio = s / th;
      return say("sin θ / θ = " + num(ratio, 4),
        "sin θ = " + num(s, 3) + " < θ = " + num(th, 3) + " < tan θ = " + num(Math.tan(th), 3) + "。所以 cos θ < sin θ / θ < 1。θ 再小，比值就被夹到 1。",
        st.deg < 20 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const th = st.deg * Math.PI / 180;
      const box = A.axes(ctx, w, h, { xMin: -0.35, xMax: 1.55, yMin: -0.25, yMax: 1.65, equal: true, title: "单位圆", xlabel: "", ylabel: "" });
      const cx = box.xOf(0), cy = box.yOf(0);
      const R = box.xOf(1) - cx;
      const P = [Math.cos(th), Math.sin(th)];
      const T = [1, Math.tan(th)];
      function tri(pts, color) {
        ctx.beginPath();
        pts.forEach((p, i) => {
          const X = box.xOf(p[0]), Y = box.yOf(p[1]);
          if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        });
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }
      A.clip(ctx, box, () => {
        tri([[0, 0], [1, 0], T], "rgba(176,122,40,0.28)");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, 0, -th, true);
        ctx.closePath();
        ctx.fillStyle = "rgba(27,95,92,0.35)";
        ctx.fill();
        tri([[0, 0], [1, 0], P], "rgba(107,20,86,0.38)");
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(box.xOf(1), box.yOf(0));
        ctx.lineTo(box.xOf(T[0]), box.yOf(T[1]));
        ctx.strokeStyle = C.gold;
        ctx.stroke();
      });
      A.disc(ctx, box.xOf(P[0]), box.yOf(P[1]), 5, C.burgundy);
      A.label(ctx, "大三角", box.xOf(1.05), box.yOf(Math.min(1.45, T[1] * 0.55)), C.gold, 13);
      A.label(ctx, "扇形", box.xOf(0.35), box.yOf(0.18), C.teal, 13);
    },
  });

  scenes.push({
    id: "secant", ch: "der", title: "割线变成切线", keys: "导数 差商 切线",
    lead: "割线连着曲线上的两点。两点并到一起时，割线的斜率走向导数。",
    init: { h: 0.8 },
    controls: [rng("h", "步长 h", 0.05, 1.5, 0.01, 2)],
    presets: [{ name: "还是割线", set: { h: 1.3 } }, { name: "几乎是切线", set: { h: 0.06 } }],
    read(st) {
      const slope = ((1 + st.h) * (1 + st.h) - 1) / st.h;
      return say("差商 = " + num(slope, 3) + "　真导数 = 2", "f(x) = x² 在 x = 1。差商 = 2 + h，h 越小越贴住切线。", st.h < 0.15 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const f = (x) => x * x;
      const box = A.axes(ctx, w, h, { xMin: -0.2, xMax: 2.6, yMin: -0.4, yMax: 5.4, title: "y = x²，x = 1" });
      A.curve(ctx, box, f, -0.2, 2.6, 80);
      const slope = (f(1 + st.h) - 1) / st.h;
      A.tangent(ctx, box, 1, 1, slope, Math.max(0.9, st.h + 0.2), C.gold);
      A.dash(ctx, box.xOf(0.2), box.yOf(1 + 2 * (0.2 - 1)), box.xOf(2.2), box.yOf(1 + 2 * (2.2 - 1)), C.teal);
      A.disc(ctx, box.xOf(1), box.yOf(1), 6, C.burgundy);
      A.disc(ctx, box.xOf(1 + st.h), box.yOf(f(1 + st.h)), 6, C.gold);
      A.label(ctx, "割线", box.xOf(1.55), box.yOf(f(1 + st.h)) - 12, C.gold, 13);
      A.label(ctx, "切线", box.xOf(0.25), box.yOf(1 + 2 * (0.25 - 1)) - 8, C.teal, 13);
    },
  });

  scenes.push({
    id: "diff", ch: "der", title: "微分近似", keys: "线性近似 以直代曲 Δy dy",
    lead: "在切点附近，用切线代替曲线。dx 越小，Δy 和 dy 越分不开。",
    init: { dx: 0.7 },
    controls: [rng("dx", "增量 dx", -0.9, 1.2, 0.02, 2)],
    presets: [{ name: "离得远", set: { dx: 1.1 } }, { name: "贴得很近", set: { dx: 0.08 } }],
    read(st) {
      const actual = Math.sqrt(4 + st.dx);
      const lin = M.sqrtLin(st.dx);
      return say("√(4+dx) ≈ 2 + dx/4", "真值 " + num(actual, 4) + "，切线给出 " + num(lin, 4) + "，相差 " + num(Math.abs(actual - lin), 4) + "。", Math.abs(st.dx) < 0.2 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: 2.4, xMax: 6, yMin: 1.35, yMax: 2.75, title: "用切线代替 √x" });
      A.curve(ctx, box, Math.sqrt, 2.5, 5.9, 80);
      A.dash(ctx, box.xOf(2.5), box.yOf(M.sqrtLin(2.5 - 4)), box.xOf(5.8), box.yOf(M.sqrtLin(5.8 - 4)), C.gold);
      const x = 4 + st.dx;
      const actual = Math.sqrt(x), lin = M.sqrtLin(st.dx);
      ctx.strokeStyle = C.danger;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(box.xOf(x), box.yOf(actual));
      ctx.lineTo(box.xOf(x), box.yOf(lin));
      ctx.stroke();
      A.disc(ctx, box.xOf(4), box.yOf(2), 5, C.ink);
      A.disc(ctx, box.xOf(x), box.yOf(actual), 6, C.burgundy);
      A.disc(ctx, box.xOf(x), box.yOf(lin), 5, C.gold);
    },
  });

  function vertF(x) { return Math.pow(3 - x, 3) * Math.pow(Math.abs(x), 2 / 3); }
  function vertFp(x) {
    if (Math.abs(x) < 1e-3) return Infinity;
    const cbrt = Math.sign(x) * Math.pow(Math.abs(x), -1 / 3);
    return Math.pow(3 - x, 2) * cbrt * (2 - (11 / 3) * x);
  }

  scenes.push({
    id: "cusp", ch: "der", title: "尖点与竖直切线", keys: "不可导 左右导数 尖点",
    lead: "连续不等于可导。尖点上左右差商各走各的；竖直切线则是斜率变成无穷。",
    init: { mode: "abs", h: 0.7, x: 0.2 },
    controls: [
      cho("mode", "看哪一种", [["abs", "尖点 |x|"], ["vert", "竖直切线"]]),
      rng("h", "步长 h", 0.05, 1.4, 0.01, 2, (s) => s.mode === "abs"),
      rng("x", "位置 x", -0.8, 3.8, 0.02, 2, (s) => s.mode === "vert"),
    ],
    presets: [{ name: "尖点", set: { mode: "abs", h: 0.8 } }, { name: "h 很小", set: { mode: "abs", h: 0.08 } }, { name: "竖直", set: { mode: "vert", x: 0 } }, { name: "假水平", set: { mode: "vert", x: 3 } }],
    read(st) {
      if (st.mode === "abs") return say("左差商 = −1　右差商 = +1", "h 再小，两条割线也不汇合。尖点连续，但没有导数。", "bad");
      const s = vertFp(st.x);
      if (Math.abs(st.x) < 0.12) return say("切线几乎竖直", "导数的绝对值变得很大。这不是尖点，是切线立起来了。", "good");
      if (Math.abs(st.x - 3) < 0.12) return say("切线是水平的", "斜率是 0，但曲线还在下降，这里不是极值。水平切线要再看两侧。", "bad");
      return say("斜率 ≈ " + (Number.isFinite(s) ? num(s, 2) : "∞"), s > 0.05 ? "这一段在上升。" : s < -0.05 ? "这一段在下降。" : "近于水平。");
    },
    draw(ctx, w, h, st) {
      if (st.mode === "abs") {
        const box = A.axes(ctx, w, h, { xMin: -2, xMax: 2, yMin: -0.4, yMax: 2.2, title: "y = |x|" });
        A.curve(ctx, box, Math.abs, -2, 2, 80);
        const h0 = st.h;
        A.tangent(ctx, box, 0, 0, 1, Math.max(h0, 0.8), C.gold);
        A.tangent(ctx, box, 0, 0, -1, Math.max(h0, 0.8), C.teal);
        A.disc(ctx, box.xOf(h0), box.yOf(h0), 5, C.gold);
        A.disc(ctx, box.xOf(-h0), box.yOf(h0), 5, C.teal);
        A.disc(ctx, box.xOf(0), box.yOf(0), 6, C.burgundy);
        return;
      }
      const box = A.axes(ctx, w, h, { xMin: -1, xMax: 4.2, yMin: -8, yMax: 14, title: "(3−x)³ |x|^(2/3)" });
      A.curve(ctx, box, vertF, -0.9, 4.1, 240);
      const y = vertF(st.x);
      A.tangent(ctx, box, st.x, y, vertFp(st.x), 0.45, C.gold);
      A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.burgundy);
    },
  });

  scenes.push({
    id: "chain", ch: "der", title: "链式法则", keys: "复合 导数 内外层",
    lead: "复合函数的斜率，是外层斜率乘里层斜率。两个倍率连乘。",
    init: { x: 0.8 },
    controls: [rng("x", "位置 x", -1.8, 1.8, 0.02, 2)],
    presets: [{ name: "原点", set: { x: 0 } }, { name: "x = 1", set: { x: 1 } }, { name: "下降", set: { x: -1 } }],
    read(st) {
      const u = st.x * st.x;
      const outer = Math.cos(u), inner = 2 * st.x, slope = outer * inner;
      return say("dy/dx = cos(x²) · 2x = " + num(slope, 3),
        "里层 u = x²，倍率 " + num(inner, 2) + "；外层 sin u，倍率 " + num(outer, 3) + "。乘起来就是切线斜率。", "");
    },
    draw(ctx, w, h, st) {
      const f = (x) => Math.sin(x * x);
      const box = A.axes(ctx, w, h, { xMin: -2, xMax: 2, yMin: -1.4, yMax: 1.4, title: "y = sin(x²)" });
      A.curve(ctx, box, f, -2, 2, 240);
      const y = f(st.x);
      A.tangent(ctx, box, st.x, y, M.chainSlope(st.x), 0.45, C.gold);
      A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.burgundy);
    },
  });

  scenes.push({
    id: "shape", ch: "app", title: "单调、极值与凹凸", keys: "驻点 极大 极小 拐点 二阶",
    lead: "f′ 的正负管升降，f′ 穿过 0 的方向管极值。f″ 管切线在曲线的哪一侧。",
    init: { x: 0.4 },
    controls: [rng("x", "位置 x", -0.4, 6.4, 0.02, 2)],
    presets: [{ name: "极大", set: { x: 1 } }, { name: "拐点", set: { x: 3 } }, { name: "极小", set: { x: 5 } }],
    read(st) {
      const d1 = M.poly1(st.x), d2 = M.poly2(st.x);
      let text, tone = "";
      if (Math.abs(st.x - 1) < 0.08) { text = "x = 1：f′ 由正到负，f″ < 0。峰顶，极大值 f(1) = 10。"; tone = "good"; }
      else if (Math.abs(st.x - 5) < 0.08) { text = "x = 5：f′ 由负到正，f″ > 0。谷底，极小值 f(5) = −22。"; tone = "good"; }
      else if (Math.abs(st.x - 3) < 0.08) { text = "x = 3：f″ = 0 且变号。这是拐点，不是驻点，f′ 在这里并不为 0。"; tone = "good"; }
      else if (st.x < 3) text = "f″ < 0：f′ 在减小，切线在曲线上方。";
      else text = "f″ > 0：f′ 在增大，切线在曲线下方。";
      const mono = d1 > 0.05 ? "上升" : d1 < -0.05 ? "下降" : "驻点附近";
      return say("f′ = " + num(d1, 2) + "　f″ = " + num(d2, 2) + "　" + mono, text, tone);
    },
    draw(ctx, w, h, st) {
      const top = Math.floor(h * 0.58);
      A.pane(ctx, 0, 0, w, top, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: -0.6, xMax: 6.6, yMin: -26, yMax: 16, title: "f(x) = x³ − 9x² + 15x + 3", ylabel: "f" });
        A.curve(ctx, box, M.poly, -0.5, 6.5, 160);
        const y = M.poly(st.x);
        A.tangent(ctx, box, st.x, y, M.poly1(st.x), 0.7, C.gold);
        [1, 3, 5].forEach((x) => A.disc(ctx, box.xOf(x), box.yOf(M.poly(x)), 4, C.teal));
        A.disc(ctx, box.xOf(st.x), box.yOf(y), 6, C.burgundy);
      });
      A.pane(ctx, 0, top, w, h - top, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: -0.6, xMax: 6.6, yMin: -16, yMax: 16, title: "f′(x)", xlabel: "x", ylabel: "f′" });
        A.curve(ctx, box, M.poly1, -0.5, 6.5, 120, { color: C.teal });
        A.disc(ctx, box.xOf(st.x), box.yOf(M.poly1(st.x)), 5, C.gold);
      });
    },
  });

  scenes.push({
    id: "barrel", ch: "app", title: "圆桶最省", keys: "最值 表面积 体积 优化",
    lead: "体积固定为 16π。太细太高，或太扁太宽，表面积都贵。导数为 0 的地方最省。",
    init: { r: 2 },
    controls: [rng("r", "底面半径 r", 0.75, 3.2, 0.01, 2)],
    presets: [{ name: "太细", set: { r: 0.9 } }, { name: "最省", set: { r: 2 } }, { name: "太扁", set: { r: 3 } }],
    read(st) {
      const s = M.barrelS(st.r);
      const best = Math.abs(st.r - 2) < 0.06;
      return say("S = " + num(s, 1) + "　高 h = " + num(M.barrelH(st.r), 2),
        best ? "r = 2，h = 4，刚好 h = 2r。这是表面积的最低点，S = 24π。" : "虚线是驻点 r = 2。往两边走，表面积都会升高。",
        best ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const left = Math.floor(w * 0.42);
      A.pane(ctx, 0, 0, left, h, (pw, ph) => {
        ctx.fillStyle = C.card;
        ctx.fillRect(0, 0, pw, ph);
        const H = M.barrelH(st.r);
        const maxH = M.barrelH(0.75);
        const s = Math.min((pw - 36) / (2 * 3.2), (ph - 64) / maxH);
        const rw = Math.max(8, st.r * s), hh = Math.max(8, H * s);
        const cx = pw / 2, top = ph * 0.62 - hh / 2, ry = Math.max(5, rw * 0.28);
        const bot = top + hh;
        ctx.fillStyle = "rgba(107,20,86,0.14)";
        ctx.strokeStyle = C.burgundy;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - rw, top);
        ctx.lineTo(cx - rw, bot);
        ctx.ellipse(cx, bot, rw, ry, 0, Math.PI, 0, true);
        ctx.lineTo(cx + rw, top);
        ctx.ellipse(cx, top, rw, ry, 0, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, top, rw, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        A.label(ctx, "r = " + num(st.r, 2), 16, 28, C.ink, 15);
        A.label(ctx, "h = " + num(H, 2), 16, 48, C.muted, 15);
      });
      A.pane(ctx, left, 0, w - left, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: 0.6, xMax: 3.3, yMin: 40, yMax: 150, xlabel: "r", ylabel: "S", title: "表面积" });
        A.curve(ctx, box, M.barrelS, 0.75, 3.2, 80);
        A.dash(ctx, box.xOf(2), box.yOf(40), box.xOf(2), box.yOf(150), C.teal);
        A.disc(ctx, box.xOf(st.r), box.yOf(M.barrelS(st.r)), 6, C.gold);
      });
    },
  });

  scenes.push({
    id: "lhop", ch: "app", title: "洛必达", keys: "0/0 不定式 sinx/x 导数之比",
    lead: "先确认是 0/0。这时函数之比和导数之比走向同一个数。不是不定式，就不要用。",
    init: { x: 0.35 },
    controls: [rng("x", "靠近 0 的位置", 0.05, 1.5, 0.01, 2)],
    presets: [{ name: "还远", set: { x: 1.2 } }, { name: "很近", set: { x: 0.08 } }],
    read(st) {
      const q = M.lhopRatio(st.x);
      const far = st.x > 0.9;
      return say("sin x / x = " + num(q, 4) + "　cos x = " + num(Math.cos(st.x), 4),
        far ? "离 0 还远，直接看函数值就行，不必洛必达。" : "分子分母都走向 0，是 0/0。导数之比是 cos x / 1，和原比一起走向 1。",
        far ? "" : "good");
    },
    draw(ctx, w, h, st) {
      const top = Math.floor(h * 0.5);
      A.pane(ctx, 0, 0, w, top, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 1.6, yMin: -0.15, yMax: 1.7, title: "sin x 与 x", ylabel: "y" });
        A.curve(ctx, box, Math.sin, 0, 1.6, 80);
        A.curve(ctx, box, (x) => x, 0, 1.6, 20, { color: C.gold, width: 1.6 });
        A.disc(ctx, box.xOf(st.x), box.yOf(Math.sin(st.x)), 5, C.burgundy);
        A.disc(ctx, box.xOf(st.x), box.yOf(st.x), 5, C.gold);
      });
      A.pane(ctx, 0, top, w, h - top, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 1.6, yMin: 0, yMax: 1.25, title: "比值与导数之比", xlabel: "x", ylabel: "" });
        A.dash(ctx, box.xOf(0), box.yOf(1), box.xOf(1.6), box.yOf(1), C.muted);
        A.curve(ctx, box, (x) => Math.sin(x) / x, 0.02, 1.6, 80);
        A.curve(ctx, box, Math.cos, 0, 1.6, 80, { color: C.teal });
        A.disc(ctx, box.xOf(st.x), box.yOf(M.lhopRatio(st.x)), 5, C.burgundy);
        A.disc(ctx, box.xOf(st.x), box.yOf(Math.cos(st.x)), 5, C.teal);
        A.label(ctx, "sin x / x", box.l + 8, box.t + 20, C.burgundy, 13);
        A.label(ctx, "cos x", box.l + 8, box.t + 38, C.teal, 13);
      });
    },
  });

  scenes.push({
    id: "family", ch: "ind", title: "原函数族", keys: "不定积分 加 C 常数",
    lead: "不定积分是一族曲线，上下平移。求导之后 C 消失，斜率全都一样。",
    init: { C: 1, x: 0.8 },
    controls: [rng("C", "常数 C", -2, 3, 0.1, 1), rng("x", "看斜率的位置", -1.6, 1.6, 0.05, 2)],
    presets: [{ name: "C = 0", set: { C: 0, x: 1 } }, { name: "抬高", set: { C: 2.5, x: 1 } }],
    read(st) {
      return say("∫ 2x dx = x² + C", "在 x = " + num(st.x, 2) + " 处，每一条的斜率都是 " + num(2 * st.x, 2) + "。平行的切线，就是「加 C 不影响导数」。", "good");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -2.2, xMax: 2.2, yMin: -3, yMax: 7, title: "x² + C" });
      for (let k = -2; k <= 3; k++) {
        A.curve(ctx, box, (x) => x * x + k, -2.1, 2.1, 60, { color: "rgba(107,20,86,0.18)", width: 1.2 });
        const y = st.x * st.x + k;
        A.tangent(ctx, box, st.x, y, 2 * st.x, 0.35, "rgba(176,122,40,0.45)");
      }
      A.curve(ctx, box, (x) => x * x + st.C, -2.1, 2.1, 80);
      A.tangent(ctx, box, st.x, st.x * st.x + st.C, 2 * st.x, 0.55, C.gold);
      A.disc(ctx, box.xOf(st.x), box.yOf(st.x * st.x + st.C), 6, C.burgundy);
    },
  });

  scenes.push({
    id: "subst", ch: "ind", title: "第一换元", keys: "凑微分 换元 u=x²",
    lead: "令 u = x²，du = 2x dx。横轴被拉开的同时，左边多出来的 2x 正好补上。两块有号面积相等。",
    init: { b: 1 },
    controls: [rng("b", "上限 b", 0.3, 1.6, 0.01, 2)],
    presets: [{ name: "b = 1", set: { b: 1 } }, { name: "积分变负", set: { b: 1.5 } }],
    read(st) {
      const v = M.substExact(st.b);
      return say("两边都等于 sin(b²) = " + num(v, 4), "左边是 ∫ 2x cos(x²) dx，右边是 ∫ cos u du，上限从 b 变成 b²。", "good");
    },
    draw(ctx, w, h, st) {
      const mid = Math.floor(w / 2);
      A.pane(ctx, 0, 0, mid, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 1.7, yMin: -3.2, yMax: 3.4, title: "y = 2x cos(x²)", xlabel: "x" });
        A.band(ctx, box, (x) => 2 * x * Math.cos(x * x), () => 0, 0, st.b, 80, "rgba(107,20,86,0.25)");
        A.curve(ctx, box, (x) => 2 * x * Math.cos(x * x), 0, 1.65, 120);
        A.disc(ctx, box.xOf(st.b), box.yOf(2 * st.b * Math.cos(st.b * st.b)), 5, C.gold);
      });
      A.pane(ctx, mid, 0, w - mid, h, (pw, ph) => {
        const u1 = st.b * st.b;
        const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 2.7, yMin: -1.4, yMax: 1.4, title: "y = cos u", xlabel: "u" });
        A.band(ctx, box, Math.cos, () => 0, 0, u1, 80, "rgba(27,95,92,0.28)");
        A.curve(ctx, box, Math.cos, 0, 2.6, 80, { color: C.teal });
        A.disc(ctx, box.xOf(u1), box.yOf(Math.cos(u1)), 5, C.gold);
      });
    },
  });

  scenes.push({
    id: "parts", ch: "ind", title: "分部积分", keys: "ln 反函数 矩形",
    lead: "∫ ln x dx 可以看成一块矩形减去反函数底下的面积。令 u = ln x，dv = dx。",
    init: { b: Math.E },
    controls: [rng("b", "右端 b", 1.4, 6, 0.02, 2)],
    presets: [{ name: "b = e，面积为 1", set: { b: Math.E } }, { name: "b = 4", set: { b: 4 } }],
    read(st) {
      const area = M.partsExact(st.b);
      return say("∫₁ᵇ ln x dx = " + num(area, 3),
        "矩形面积 b ln b = " + num(M.partsRect(st.b), 3) + "，减去反函数下的面积 b − 1 = " + num(M.partsInverse(st.b), 3) + "。b = e 时积分等于 1。",
        Math.abs(st.b - Math.E) < 0.05 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const b = st.b, L = Math.log(b);
      const box = A.axes(ctx, w, h, { xMin: -0.2, xMax: b + 0.6, yMin: -0.4, yMax: L + 0.5, title: "矩形减去反函数下的面积" });
      A.clip(ctx, box, () => {
        ctx.beginPath();
        ctx.moveTo(box.xOf(0), box.yOf(0));
        ctx.lineTo(box.xOf(0), box.yOf(L));
        for (let i = 40; i >= 0; i--) {
          const y = (L * i) / 40;
          ctx.lineTo(box.xOf(Math.exp(y)), box.yOf(y));
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(27,95,92,0.25)";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(box.xOf(1), box.yOf(0));
        for (let i = 0; i <= 60; i++) {
          const x = 1 + ((b - 1) * i) / 60;
          ctx.lineTo(box.xOf(x), box.yOf(Math.log(x)));
        }
        ctx.lineTo(box.xOf(b), box.yOf(0));
        ctx.closePath();
        ctx.fillStyle = "rgba(107,20,86,0.35)";
        ctx.fill();
        ctx.strokeStyle = C.gold;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(box.xOf(0), box.yOf(L), box.xOf(b) - box.xOf(0), box.yOf(0) - box.yOf(L));
        ctx.setLineDash([]);
      });
      A.curve(ctx, box, Math.log, 0.45, b, 80);
      A.label(ctx, "∫ ln", box.xOf(1 + (b - 1) * 0.45), box.yOf(L * 0.25), C.burgundy, 14);
    },
  });

  scenes.push({
    id: "riemann", ch: "def", title: "黎曼和", keys: "定积分 左端点 右端点 中点 梯形 辛普森",
    lead: "把曲边切成窄条，用矩形、梯形或抛物线代替。条数越多，越接近 ∫₀^π sin x dx = 2。",
    init: { n: 8, method: "mid" },
    controls: [
      cho("method", "代替", [["left", "左"], ["right", "右"], ["mid", "中点"], ["trap", "梯形"], ["simpson", "辛普森"]]),
      rng("n", "条数 n", 2, 36, 1, 0),
    ],
    presets: [{ name: "很粗", set: { n: 2, method: "left" } }, { name: "中点", set: { n: 8, method: "mid" } }, { name: "辛普森", set: { n: 4, method: "simpson" } }],
    read(st) {
      const n = Math.round(st.n);
      const s = M.riemann(n, st.method);
      return say("和 = " + num(s, 4) + "　误差 " + num(s - 2, 4), "精确值是 2。辛普森用抛物线，很少的条就贴住了；左右矩形偏在两侧。", Math.abs(s - 2) < 0.02 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const n = Math.round(st.n);
      const box = A.axes(ctx, w, h, { xMin: 0, xMax: Math.PI, yMin: -0.15, yMax: 1.25, title: "y = sin x", xlabel: "x", ylabel: "y" });
      const dx = Math.PI / n;
      A.clip(ctx, box, () => {
        if (st.method === "simpson") {
          const m = n % 2 === 0 ? n : n + 1;
          const h0 = Math.PI / m;
          ctx.fillStyle = "rgba(107,20,86,0.22)";
          for (let i = 0; i < m; i += 2) {
            const x0 = i * h0, x1 = (i + 1) * h0, x2 = (i + 2) * h0;
            const y0 = Math.sin(x0), y1 = Math.sin(x1), y2 = Math.sin(x2);
            ctx.beginPath();
            ctx.moveTo(box.xOf(x0), box.yOf(0));
            for (let k = 0; k <= 16; k++) {
              const x = x0 + (x2 - x0) * k / 16;
              const l0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2));
              const l1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2));
              const l2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1));
              ctx.lineTo(box.xOf(x), box.yOf(y0 * l0 + y1 * l1 + y2 * l2));
            }
            ctx.lineTo(box.xOf(x2), box.yOf(0));
            ctx.closePath();
            ctx.fill();
          }
        } else if (st.method === "trap") {
          ctx.fillStyle = "rgba(107,20,86,0.22)";
          for (let i = 0; i < n; i++) {
            const x0 = i * dx, x1 = (i + 1) * dx;
            ctx.beginPath();
            ctx.moveTo(box.xOf(x0), box.yOf(0));
            ctx.lineTo(box.xOf(x0), box.yOf(Math.sin(x0)));
            ctx.lineTo(box.xOf(x1), box.yOf(Math.sin(x1)));
            ctx.lineTo(box.xOf(x1), box.yOf(0));
            ctx.closePath();
            ctx.fill();
          }
        } else {
          for (let i = 0; i < n; i++) {
            const x = st.method === "left" ? i * dx : st.method === "right" ? (i + 1) * dx : (i + 0.5) * dx;
            const y = Math.sin(x);
            const x0 = box.xOf(i * dx), x1 = box.xOf((i + 1) * dx);
            const y0 = box.yOf(0), y1 = box.yOf(y);
            ctx.fillStyle = "rgba(107,20,86,0.22)";
            ctx.strokeStyle = "rgba(107,20,86,0.55)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(x0, Math.min(y0, y1), Math.max(1, x1 - x0), Math.abs(y1 - y0));
            ctx.fill();
            ctx.stroke();
          }
        }
      });
      A.curve(ctx, box, Math.sin, 0, Math.PI, 120);
    },
  });

  scenes.push({
    id: "ftc", ch: "def", title: "牛顿–莱布尼茨", keys: "微积分基本定理 变上限 面积函数",
    lead: "变上限积分的导数，就是被积函数在右端的高度。面积的变化率等于那一条边。",
    init: { x: 2 },
    controls: [rng("x", "右端 x", 0.15, 6.2, 0.05, 2)],
    presets: [{ name: "到 π", set: { x: Math.PI } }, { name: "到 2π", set: { x: 2 * Math.PI } }],
    read(st) {
      return say("F(x) = ∫₀ˣ sin t dt = " + num(M.ftc(st.x), 3),
        "右端高度 sin x = " + num(Math.sin(st.x), 3) + "，这就是 F′(x)。到 π 时面积是 2，再到 2π 时正负抵消回 0。",
        Math.abs(st.x - Math.PI) < 0.08 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const use = w > 680;
      const left = use ? Math.floor(w * 0.62) : w;
      A.pane(ctx, 0, 0, left, h, (pw, ph) => {
        const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 6.4, yMin: -1.3, yMax: 1.3, title: "阴影的面积是 F(x)" });
        const x = st.x;
        A.band(ctx, box, Math.sin, () => 0, 0, x, 80, "rgba(107,20,86,0.28)");
        A.curve(ctx, box, Math.sin, 0, 6.3, 160);
        const slice = 0.12;
        ctx.fillStyle = "rgba(176,122,40,0.85)";
        ctx.fillRect(box.xOf(x), Math.min(box.yOf(0), box.yOf(Math.sin(x))), Math.max(2, box.xOf(x + slice) - box.xOf(x)), Math.abs(box.yOf(Math.sin(x)) - box.yOf(0)));
        A.disc(ctx, box.xOf(x), box.yOf(Math.sin(x)), 5, C.gold);
      });
      if (use) {
        A.pane(ctx, left, 0, w - left, h, (pw, ph) => {
          const box = A.axes(ctx, pw, ph, { xMin: 0, xMax: 6.4, yMin: -0.3, yMax: 2.3, title: "面积函数 F", xlabel: "x", ylabel: "F" });
          A.curve(ctx, box, M.ftc, 0, 6.3, 120, { color: C.teal });
          A.tangent(ctx, box, st.x, M.ftc(st.x), Math.sin(st.x), 0.6, C.gold);
          A.disc(ctx, box.xOf(st.x), box.yOf(M.ftc(st.x)), 5, C.burgundy);
        });
      }
    },
  });

  scenes.push({
    id: "signed", ch: "def", title: "有号面积", keys: "正负相消 定积分 sin",
    lead: "定积分把 x 轴下方记成负的。净面积可以是 0，上下两块却都实实在在在那里。",
    init: { T: Math.PI },
    controls: [rng("T", "积到 T", 0.2, 12.6, 0.05, 2)],
    presets: [{ name: "到 π", set: { T: Math.PI } }, { name: "到 2π，抵消", set: { T: 2 * Math.PI } }, { name: "三瓣", set: { T: 3 * Math.PI } }],
    read(st) {
      const s = M.signed(st.T);
      return say("净面积 " + num(s.net, 3) + "　总面积 " + num(s.gross, 3),
        Math.abs(s.net) < 0.05 ? "正负刚好抵消，净面积是 0。总面积把下方翻上来再加。" : "红色在轴下，算进积分时要带负号。",
        Math.abs(s.net) < 0.05 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: 0, xMax: 13, yMin: -1.4, yMax: 1.4, title: "sin x 的有号面积" });
      const n = 180;
      for (let i = 0; i < n; i++) {
        const a = (st.T * i) / n, b = (st.T * (i + 1)) / n;
        const mid = Math.sin((a + b) / 2);
        A.band(ctx, box, Math.sin, () => 0, a, b, 2, mid >= 0 ? "rgba(107,20,86,0.35)" : "rgba(156,47,47,0.35)");
      }
      A.curve(ctx, box, Math.sin, 0, 12.8, 200);
      A.disc(ctx, box.xOf(st.T), box.yOf(Math.sin(st.T)), 5, C.gold);
    },
  });

  scenes.push({
    id: "improper", ch: "def", title: "反常积分", keys: "无穷区间 收敛 1/x²",
    lead: "积分到无穷，先积到 B，再让 B 走远。尾巴还在，但加上去的面积会越来越少。",
    init: { B: 4 },
    controls: [rng("B", "先积到 B", 1.2, 18, 0.1, 1)],
    presets: [{ name: "刚开始", set: { B: 2 } }, { name: "尾巴已很薄", set: { B: 12 } }],
    read(st) {
      const v = M.improper(st.B);
      return say("∫₁ᴮ x⁻² dx = " + num(v, 4), "极限是 1。还差 " + num(1 - v, 4) + "，全在 B 右边那条越来越矮的尾巴里。", v > 0.9 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: 0.6, xMax: 18, yMin: -0.05, yMax: 1.15, title: "y = 1/x²" });
      A.band(ctx, box, (x) => 1 / (x * x), () => 0, 1, st.B, 60, "rgba(107,20,86,0.35)");
      A.band(ctx, box, (x) => 1 / (x * x), () => 0, st.B, 18, 40, "rgba(176,122,40,0.25)");
      A.curve(ctx, box, (x) => 1 / (x * x), 0.9, 18, 80);
      A.dash(ctx, box.xOf(st.B), box.yOf(0), box.xOf(st.B), box.yOf(1 / (st.B * st.B)), C.gold);
      A.label(ctx, "已积 " + num(M.improper(st.B), 3), box.l + 8, box.t + 22, C.burgundy, 14);
    },
  });

  function ySpan(x) {
    if (x < 0 || x > 4) return null;
    const up = Math.sqrt(x);
    if (x <= 1) return [-up, up];
    return [x - 2, up];
  }

  scenes.push({
    id: "region", ch: "iap", title: "曲边面积", keys: "切条 对 y 对 x 交点",
    lead: "区域夹在 x = y² 和 x = y + 2 之间。先画图，再决定竖着切还是横着切。",
    init: { dir: "y", t: 0.4 },
    controls: [
      cho("dir", "切条", [["y", "横条，对 y"], ["x", "竖条，对 x"]]),
      rng("t", "这一条的位置", -1, 3.6, 0.02, 2),
    ],
    presets: [{ name: "横着，一个积分", set: { dir: "y", t: 0.5 } }, { name: "竖着，要切开", set: { dir: "x", t: 2 } }],
    read(st) {
      if (st.dir === "y") {
        const y = Math.max(-1, Math.min(2, st.t));
        const width = y + 2 - y * y;
        return say("面积 = 9/2", "横条从 x = y² 到 x = y + 2，这一条长 " + num(width, 2) + "。y 从 −1 到 2，一个积分就够。", "good");
      }
      const span = ySpan(Math.max(0.05, Math.min(3.9, st.t)));
      return say("面积仍是 9/2", "竖条在 x = 1 左边是抛物线的上下两支，右边下沿换成直线。要拆成两个积分。这一条从 " + num(span[0], 2) + " 到 " + num(span[1], 2) + "。", "");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -0.4, xMax: 5, yMin: -2.4, yMax: 2.8, title: "x = y² 与 x = y + 2" });
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const y = -1 + (3 * i) / 80;
        const X = box.xOf(y * y), Y = box.yOf(y);
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      for (let i = 80; i >= 0; i--) {
        const y = -1 + (3 * i) / 80;
        ctx.lineTo(box.xOf(y + 2), box.yOf(y));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(107,20,86,0.12)";
      ctx.fill();
      A.curve(ctx, box, (x) => x, 0, 0, 1);
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const y = -2.2 + (4.4 * i) / 80;
        const X = box.xOf(y * y), Y = box.yOf(y);
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.strokeStyle = C.gold;
      ctx.beginPath();
      ctx.moveTo(box.xOf(-2.2 + 2), box.yOf(-2.2));
      ctx.lineTo(box.xOf(2.2 + 2), box.yOf(2.2));
      ctx.stroke();
      ctx.strokeStyle = C.teal;
      ctx.lineWidth = 3;
      if (st.dir === "y") {
        const y = Math.max(-1, Math.min(2, st.t));
        ctx.beginPath();
        ctx.moveTo(box.xOf(y * y), box.yOf(y));
        ctx.lineTo(box.xOf(y + 2), box.yOf(y));
        ctx.stroke();
      } else {
        const x = Math.max(0.05, Math.min(3.9, st.t));
        const span = ySpan(x);
        ctx.beginPath();
        ctx.moveTo(box.xOf(x), box.yOf(span[0]));
        ctx.lineTo(box.xOf(x), box.yOf(span[1]));
        ctx.stroke();
      }
    },
  });

  scenes.push({
    id: "growth", ch: "iap", title: "指数、阻滞与碳-14", keys: "人口 对数增长 半衰期 微分方程",
    lead: "同一类方程，故事不同。指数会冲出去，阻滞有天花板，碳-14 按半衰期减半。",
    init: { mode: "pop", t: 40, r: 0.6, year: 5730 },
    controls: [
      cho("mode", "模型", [["pop", "人口"], ["block", "阻滞"], ["carbon", "碳-14"]]),
      rng("t", "1960 之后的年", 0, 100, 1, 0, (s) => s.mode === "pop"),
      rng("r", "内禀增长率 r", 0.2, 1.4, 0.02, 2, (s) => s.mode === "block"),
      rng("year", "经过的年", 0, 20000, 10, 0, (s) => s.mode === "carbon"),
    ],
    presets: [{ name: "人口", set: { mode: "pop", t: 60 } }, { name: "阻滞变陡", set: { mode: "block", r: 1.1 } }, { name: "一个半衰期", set: { mode: "carbon", year: 5730 } }, { name: "两个半衰期", set: { mode: "carbon", year: 11460 } }],
    read(st) {
      if (st.mode === "pop") {
        return say(Math.round(1960 + st.t) + " 年", "阻滞 " + num(M.popLogistic(st.t), 1) + " 亿，指数 " + num(M.popExpo(st.t), 1) + " 亿。指数没有天花板，阻滞靠近 82.3 亿。");
      }
      if (st.mode === "block") {
        return say("dy/dt = r y (1 − y)", "r 越大，S 形越陡。天花板仍是环境容量 1，改 r 改不了它。", "good");
      }
      const left = M.carbon(st.year);
      const halves = Math.abs(st.year - 5730) < 30 || Math.abs(st.year - 11460) < 40;
      return say("剩余 " + num(left * 100, 1) + "%", "半衰期 5730 年：到那时剩一半，再过一个半衰期剩四分之一。", halves ? "good" : "");
    },
    draw(ctx, w, h, st) {
      if (st.mode === "pop") {
        const box = A.axes(ctx, w, h, { xMin: 0, xMax: 100, yMin: 0, yMax: 200, xlabel: "年", ylabel: "亿", title: "1960 年起" });
        A.curve(ctx, box, M.popLogistic, 0, 100, 100);
        A.curve(ctx, box, M.popExpo, 0, 100, 80, { color: C.gold, dash: [6, 4], width: 2 });
        A.dash(ctx, box.xOf(0), box.yOf(82.3), box.xOf(100), box.yOf(82.3), C.teal);
        A.disc(ctx, box.xOf(st.t), box.yOf(M.popLogistic(st.t)), 6, C.burgundy);
        A.label(ctx, "阻滞", box.l + 8, box.t + 20, C.burgundy, 14);
        A.label(ctx, "指数", box.l + 8, box.t + 38, C.gold, 14);
        return;
      }
      if (st.mode === "block") {
        const box = A.axes(ctx, w, h, { xMin: 0, xMax: 12, yMin: 0, yMax: 1.15, xlabel: "t", ylabel: "y", title: "阻滞增长" });
        const pts = [];
        let y = 0.05;
        const n = 160, dt = 12 / n;
        for (let i = 0; i <= n; i++) {
          pts.push([box.xOf(i * dt), box.yOf(y)]);
          y += st.r * y * (1 - y) * dt;
        }
        ctx.beginPath();
        ctx.strokeStyle = C.burgundy;
        ctx.lineWidth = 2.4;
        pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
        ctx.stroke();
        A.dash(ctx, box.xOf(0), box.yOf(1), box.xOf(12), box.yOf(1), C.gold);
        return;
      }
      const box = A.axes(ctx, w, h, { xMin: 0, xMax: 20000, yMin: 0, yMax: 1.05, xlabel: "年", ylabel: "剩余比例", title: "碳-14" });
      A.curve(ctx, box, M.carbon, 0, 20000, 80);
      [5730, 11460].forEach((t) => A.dash(ctx, box.xOf(t), box.yOf(0), box.xOf(t), box.yOf(M.carbon(t)), C.gold));
      A.disc(ctx, box.xOf(st.year), box.yOf(M.carbon(st.year)), 6, C.burgundy);
      A.label(ctx, "5730", box.xOf(5730) - 16, box.yOf(0.08), C.gold, 13);
    },
  });

  scenes.push({
    id: "domain", ch: "two", title: "二元定义域", keys: "挖去原点 第一象限 根号",
    lead: "二元函数的定义域是平面上的一块。探针走到空白处，函数就没有值。",
    init: { mode: "hole", x: 0.7, y: 0.4 },
    controls: [
      cho("mode", "函数", [["hole", "1/(x²+y²)"], ["quad", "√x + √y"]]),
      rng("x", "x", -2, 2, 0.02, 2),
      rng("y", "y", -2, 2, 0.02, 2),
    ],
    presets: [{ name: "原点", set: { mode: "hole", x: 0, y: 0 } }, { name: "第一象限外", set: { mode: "quad", x: -0.4, y: 0.5 } }, { name: "在域内", set: { mode: "quad", x: 0.8, y: 0.6 } }],
    read(st) {
      if (st.mode === "hole") {
        const bad = Math.hypot(st.x, st.y) < 0.06;
        return say(bad ? "无定义" : "z = " + num(1 / (st.x * st.x + st.y * st.y), 2), bad ? "整张平面都可以，只挖掉原点。" : "离开原点就有定义。越靠近原点，值越大。", bad ? "bad" : "good");
      }
      const ok = st.x >= -0.001 && st.y >= -0.001;
      return say(ok ? "z = " + num(Math.sqrt(Math.max(0, st.x)) + Math.sqrt(Math.max(0, st.y)), 2) : "无定义", ok ? "第一象限，含两条正半轴。" : "根号里面不能是负的。", ok ? "good" : "bad");
    },
    draw(ctx, w, h, st) {
      const box = A.axes(ctx, w, h, { xMin: -2, xMax: 2, yMin: -2, yMax: 2, equal: true, title: st.mode === "hole" ? "挖去原点" : "第一象限" });
      ctx.fillStyle = "rgba(107,20,86,0.22)";
      if (st.mode === "quad") ctx.fillRect(box.xOf(0), box.yOf(2), box.xOf(2) - box.xOf(0), box.yOf(0) - box.yOf(2));
      else {
        ctx.fillRect(box.l, box.t, box.pw, box.ph);
        A.disc(ctx, box.xOf(0), box.yOf(0), 7, C.card, C.burgundy);
      }
      const ok = st.mode === "hole" ? Math.hypot(st.x, st.y) >= 0.06 : st.x >= 0 && st.y >= 0;
      A.disc(ctx, box.xOf(st.x), box.yOf(st.y), 6, ok ? C.gold : C.danger);
    },
  });

  function rayFn(x, y) {
    const d = x * x + y * y;
    if (d < 1e-4) return NaN;
    return (x * x - y * y) / d;
  }
  function paraFn(x, y) {
    const d = x * x * x * x + y * y;
    if (d < 1e-8) return NaN;
    return (x * x * y) / d;
  }

  scenes.push({
    id: "paths", ch: "two", title: "路径极限", keys: "二重极限 不存在 抛物线 射线",
    lead: "沿不同的路走进同一个点，如果答案不同，极限就不存在。直线全部一致，仍要再看弯路。",
    init: { mode: "ray", th1: 0, th2: 90, rad: 0.55, along: 0.45 },
    controls: [
      cho("mode", "例子", [["ray", "不同方向"], ["para", "直线都是 0"]]),
      rng("th1", "路径甲 °", 0, 180, 1, 0, (s) => s.mode === "ray"),
      rng("th2", "路径乙 °", 0, 180, 1, 0, (s) => s.mode === "ray"),
      rng("rad", "离原点", 0.12, 1.2, 0.01, 2, (s) => s.mode === "ray"),
      rng("along", "沿抛物线的 x", 0.15, 1, 0.01, 2, (s) => s.mode === "para"),
    ],
    presets: [{ name: "0° 与 90°", set: { mode: "ray", th1: 0, th2: 90 } }, { name: "碰巧接近", set: { mode: "ray", th1: 20, th2: 25 } }, { name: "抛物线", set: { mode: "para", along: 0.4 } }],
    read(st) {
      if (st.mode === "para") {
        const x = st.along;
        const onLine = M.pathLine(1, x);
        return say("抛物线上始终是 1/2", "沿直线 y = x 走到这里只有 " + num(onLine, 3) + "，再靠近会变成 0。所有直线的极限都是 0，抛物线却是 1/2，所以极限不存在。", "bad");
      }
      const a = M.pathRay(st.th1 * Math.PI / 180);
      const b = M.pathRay(st.th2 * Math.PI / 180);
      const differ = Math.abs(a - b) > 0.15;
      return say("甲 " + num(a, 3) + "　乙 " + num(b, 3), differ ? "两条射线得到两个不同的数。这个二重极限不存在。" : "这两条方向碰巧接近。把其中一条转到 0° 或 90°，差异会出来。", differ ? "bad" : "");
    },
    draw(ctx, w, h, st) {
      const R = 1.35;
      const box = A.axes(ctx, w, h, { xMin: -R, xMax: R, yMin: -R, yMax: R, equal: true, grid: false, title: st.mode === "ray" ? "(x²−y²)/(x²+y²)" : "x²y / (x⁴+y²)", xlabel: "", ylabel: "" });
      A.heat(ctx, box, st.mode === "ray" ? rayFn : paraFn, st.mode === "ray" ? -1 : -0.2, st.mode === "ray" ? 1 : 0.7);
      ctx.strokeStyle = "rgba(36,22,22,0.35)";
      ctx.beginPath();
      ctx.moveTo(box.xOf(-R), box.yOf(0)); ctx.lineTo(box.xOf(R), box.yOf(0));
      ctx.moveTo(box.xOf(0), box.yOf(-R)); ctx.lineTo(box.xOf(0), box.yOf(R));
      ctx.stroke();
      A.disc(ctx, box.xOf(0), box.yOf(0), 4, C.card, C.ink);
      if (st.mode === "ray") {
        [[st.th1, C.gold, "甲"], [st.th2, C.burgundy, "乙"]].forEach(([deg, col, name]) => {
          const th = deg * Math.PI / 180;
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(box.xOf(0), box.yOf(0));
          ctx.lineTo(box.xOf(1.2 * Math.cos(th)), box.yOf(1.2 * Math.sin(th)));
          ctx.stroke();
          A.disc(ctx, box.xOf(st.rad * Math.cos(th)), box.yOf(st.rad * Math.sin(th)), 6, col);
          A.label(ctx, name, box.xOf(1.05 * Math.cos(th)) + 4, box.yOf(1.05 * Math.sin(th)), col, 14);
        });
      } else {
        [-1, 0, 1, 2].forEach((m) => A.curve(ctx, box, (x) => m * x, -1.2, 1.2, 2, { color: "rgba(176,122,40,0.8)", width: 1.4 }));
        A.curve(ctx, box, (x) => x * x, -1.1, 1.1, 40, { width: 2.6 });
        const x = st.along;
        A.disc(ctx, box.xOf(x), box.yOf(x * x), 6, C.burgundy);
        A.disc(ctx, box.xOf(x), box.yOf(x), 5, C.gold);
        A.label(ctx, "y = x²", box.xOf(-1), box.yOf(1.05), C.burgundy, 14);
      }
    },
  });

  scenes.push({
    id: "profit", ch: "two", title: "偏导与驻点", keys: "等高线 利润 黑塞 极大",
    lead: "偏导是只沿一个方向走的斜率。两个偏导同时为 0，才是驻点。这里黑塞判定它是极大。",
    init: { x: 12, y: 8 },
    controls: [rng("x", "x", 0, 40, 0.01, 2), rng("y", "y", 0, 20, 0.01, 2)],
    presets: [{ name: "驻点", set: { x: 70 / 3, y: 10 / 3 } }, { name: "角落", set: { x: 4, y: 16 } }],
    read(st) {
      const px = M.profitX(st.x, st.y), py = M.profitY(st.x, st.y), p = M.profit(st.x, st.y);
      const flat = Math.abs(px) < 0.08 && Math.abs(py) < 0.08;
      const word = (d) => (Math.abs(d) < 0.08 ? "已经走平" : d > 0 ? "还在上升" : "已经下降");
      return say("P = " + num(p, 1) + "　Px = " + num(px, 2) + "　Py = " + num(py, 2),
        flat ? "两个偏导同时为 0。Pxx = −2，Pyy = −2，Pxy = −1，黑塞行列式 3 > 0，是极大。驻点 (70/3, 10/3)，P = 1900/3。" : "沿 x " + word(px) + "，沿 y " + word(py) + "。往偏导为正的方向挪，利润会增加。",
        flat ? "good" : "");
    },
    hit(type, p, st) {
      const box = this._top;
      if (!box) return false;
      if (p[0] < box.l || p[0] > box.l + box.pw || p[1] < box.t || p[1] > box.t + box.ph) return false;
      st.x = Math.max(0, Math.min(40, box.xMin + ((p[0] - box.l) / box.pw) * (box.xMax - box.xMin)));
      st.y = Math.max(0, Math.min(20, box.yMin + (1 - (p[1] - box.t) / box.ph) * (box.yMax - box.yMin)));
      return true;
    },
    draw(ctx, w, h, st) {
      const topH = Math.floor(h * 0.56);
      const box = A.axes(ctx, w, topH, { xMin: 0, xMax: 40, yMin: 0, yMax: 20, title: "点等高线可拖。颜色越深，利润越高", xlabel: "", ylabel: "y" });
      this._top = box;
      A.heat(ctx, box, M.profit, -250, 1900 / 3);
      const PMAX = 1900 / 3;
      A.clip(ctx, box, () => {
        [600, 450, 300, 100, 0].forEach((c) => {
          const k = PMAX - c;
          if (k <= 0) return;
          const a = Math.sqrt((2 * k) / 3), b = Math.sqrt(2 * k);
          ctx.beginPath();
          for (let i = 0; i <= 90; i++) {
            const ph = (i / 90) * Math.PI * 2;
            const s = a * Math.cos(ph), t = b * Math.sin(ph);
            const u = (s + t) / Math.SQRT2, v = (s - t) / Math.SQRT2;
            const X = box.xOf(70 / 3 + u), Y = box.yOf(10 / 3 + v);
            if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
          }
          ctx.strokeStyle = "rgba(36,22,22,0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
      A.dash(ctx, box.xOf(0), box.yOf(st.y), box.xOf(40), box.yOf(st.y), C.gold);
      A.dash(ctx, box.xOf(st.x), box.yOf(0), box.xOf(st.x), box.yOf(20), C.teal);
      A.disc(ctx, box.xOf(st.x), box.yOf(st.y), 6, C.burgundy, C.card);
      const half = Math.floor(w / 2);
      A.pane(ctx, 0, topH, half, h - topH, (pw, ph) => {
        const L = A.axes(ctx, pw, ph, { xMin: 0, xMax: 40, yMin: -250, yMax: 700, title: "固定 y，沿 x", xlabel: "x", ylabel: "P" });
        A.curve(ctx, L, (x) => M.profit(x, st.y), 0, 40, 80, { color: C.gold });
        const p = M.profit(st.x, st.y);
        A.tangent(ctx, L, st.x, p, M.profitX(st.x, st.y), 4, C.ink);
        A.disc(ctx, L.xOf(st.x), L.yOf(p), 5, C.burgundy);
      });
      A.pane(ctx, half, topH, w - half, h - topH, (pw, ph) => {
        const R = A.axes(ctx, pw, ph, { xMin: 0, xMax: 20, yMin: -250, yMax: 700, title: "固定 x，沿 y", xlabel: "y", ylabel: "P" });
        A.curve(ctx, R, (y) => M.profit(st.x, y), 0, 20, 80, { color: C.teal });
        const p = M.profit(st.x, st.y);
        A.tangent(ctx, R, st.y, p, M.profitY(st.x, st.y), 2.2, C.ink);
        A.disc(ctx, R.xOf(st.y), R.yOf(p), 5, C.burgundy);
      });
    },
  });

  scenes.push({
    id: "double", ch: "two", title: "二重积分", keys: "三角形 X型 竖条 黎曼和",
    lead: "在三角形 x ≥ 0，y ≥ 0，x + y ≤ 1 上积分 x + y。竖条先对 y，再沿 x 累加。",
    init: { n: 8, x: 0.35 },
    controls: [rng("n", "每边格数", 2, 24, 1, 0), rng("x", "看一条竖条", 0, 1, 0.01, 2)],
    presets: [{ name: "粗", set: { n: 3, x: 0.3 } }, { name: "细", set: { n: 16, x: 0.3 } }],
    read(st) {
      const n = Math.round(st.n);
      const s = M.triSum(n);
      return say("黎曼和 " + num(s, 4) + "　精确值 1/3", "x = " + num(st.x, 2) + " 这条竖条，y 从 0 积到 " + num(1 - st.x, 2) + "。格越细，和越靠近 1/3。", Math.abs(s - 1 / 3) < 0.02 ? "good" : "");
    },
    draw(ctx, w, h, st) {
      const n = Math.round(st.n);
      const box = A.axes(ctx, w, h, { xMin: -0.15, xMax: 1.2, yMin: -0.15, yMax: 1.2, title: "∬ (x+y) dA = 1/3" });
      A.clip(ctx, box, () => {
        ctx.beginPath();
        ctx.moveTo(box.xOf(0), box.yOf(0));
        ctx.lineTo(box.xOf(1), box.yOf(0));
        ctx.lineTo(box.xOf(0), box.yOf(1));
        ctx.closePath();
        ctx.clip();
        const h0 = 1 / n;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const x = (i + 0.5) * h0, y = (j + 0.5) * h0;
            if (x + y > 1) continue;
            const col = A.ramp(x + y, 0, 1);
            ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.85)";
            ctx.fillRect(box.xOf(i * h0), box.yOf((j + 1) * h0), box.xOf((i + 1) * h0) - box.xOf(i * h0), box.yOf(j * h0) - box.yOf((j + 1) * h0));
          }
        }
      });
      ctx.beginPath();
      ctx.moveTo(box.xOf(0), box.yOf(0));
      ctx.lineTo(box.xOf(1), box.yOf(0));
      ctx.lineTo(box.xOf(0), box.yOf(1));
      ctx.closePath();
      ctx.strokeStyle = C.burgundy;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(box.xOf(st.x), box.yOf(0));
      ctx.lineTo(box.xOf(st.x), box.yOf(Math.max(0, 1 - st.x)));
      ctx.stroke();
    },
  });

  window.ATLAS_SCENES = (window.ATLAS_SCENES || []).concat(scenes);
})();
