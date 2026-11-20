/* 共享作图。不使用 ES module。热图经离屏 canvas，避免 putImageData 与 DPR 错位。 */
(function () {
  const C = {
    burgundy: "#6b1456",
    gold: "#b07a28",
    teal: "#1b5f5c",
    ink: "#241616",
    muted: "#6a5858",
    paper: "#f3eadc",
    card: "#fffaf2",
    rule: "#e9dfcf",
    danger: "#9c2f2f",
    ok: "#2c6b45",
  };

  const TYPE = 32; /* 24pt @ 96dpi，投影坐标字 */
  const TICK = 26;

  function niceTicks(a, b, want) {
    const span = b - a;
    if (!(span > 0)) return [];
    const raw = span / Math.max(2, want);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / mag;
    const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.ceil(a / step) * step; v <= b + step * 1e-9; v += step) {
      out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    }
    return out;
  }
  function tickText(v) {
    const s = Math.abs(v) >= 1000 || Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : String(+v.toFixed(2));
    return s.replace("-", "−");
  }

  function axes(ctx, w, h, opt) {
    const g = opt && opt.grid;
    const o = Object.assign({
      l: g ? 84 : 68, r: 22, t: 36, b: g ? 66 : 52,
      xMin: -1, xMax: 1, yMin: -1, yMax: 1,
      xlabel: "x", ylabel: "y", title: "",
      ticks: true, grid: false, xticks: null, yticks: null,
    }, opt || {});
    ctx.fillStyle = C.card;
    ctx.fillRect(0, 0, w, h);
    const pw = w - o.l - o.r, ph = h - o.t - o.b;
    const xOf = (x) => o.l + ((x - o.xMin) / (o.xMax - o.xMin)) * pw;
    const yOf = (y) => o.t + (1 - (y - o.yMin) / (o.yMax - o.yMin)) * ph;

    if (o.grid) {
      const xt = o.xticks || niceTicks(o.xMin, o.xMax, Math.max(3, Math.round(pw / 110))).map((v) => [v, tickText(v)]);
      const yt = o.yticks || niceTicks(o.yMin, o.yMax, Math.max(3, Math.round(ph / 70))).map((v) => [v, tickText(v)]);
      ctx.strokeStyle = "rgba(36,22,22,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      xt.forEach(([v]) => { const X = Math.round(xOf(v)) + 0.5; ctx.moveTo(X, o.t); ctx.lineTo(X, o.t + ph); });
      yt.forEach(([v]) => { const Y = Math.round(yOf(v)) + 0.5; ctx.moveTo(o.l, Y); ctx.lineTo(o.l + pw, Y); });
      ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.font = "22px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      xt.forEach(([v, s]) => ctx.fillText(s, xOf(v), o.t + ph + 6));
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      yt.forEach(([v, s]) => ctx.fillText(s, o.l - 8, yOf(v)));
      o.ticks = false;
    }

    ctx.strokeStyle = C.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(o.l + 0.5, o.t + 0.5, pw - 1, ph - 1);
    ctx.stroke();

    ctx.strokeStyle = "rgba(36,22,22,0.28)";
    ctx.beginPath();
    if (o.xMin < 0 && o.xMax > 0) {
      ctx.moveTo(xOf(0), o.t); ctx.lineTo(xOf(0), o.t + ph);
    }
    if (o.yMin < 0 && o.yMax > 0) {
      ctx.moveTo(o.l, yOf(0)); ctx.lineTo(o.l + pw, yOf(0));
    }
    ctx.stroke();

    ctx.fillStyle = C.muted;
    ctx.font = (o.grid ? 24 : TYPE) + "px 'Noto Serif SC', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(o.xlabel, o.l + pw / 2, h - (o.grid ? 6 : 10));
    ctx.save();
    ctx.translate(o.grid ? 20 : 22, o.t + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(o.ylabel, 0, 0);
    ctx.restore();
    if (o.title) {
      ctx.fillStyle = C.ink;
      ctx.textAlign = "left";
      ctx.fillText(o.title, o.l + 6, o.t - 8);
    }
    if (o.ticks) {
      ctx.fillStyle = C.muted;
      ctx.font = TICK + "px 'Noto Serif SC', serif";
      ctx.textAlign = "center";
      ctx.fillText(String(o.xMin), xOf(o.xMin), o.t + ph + 28);
      ctx.fillText(String(o.xMax), xOf(o.xMax), o.t + ph + 28);
    }
    return { xOf, yOf, pw, ph, m: o };
  }

  function curve(ctx, xOf, yOf, f, a, b, n, style) {
    const s = Object.assign({ color: C.burgundy, width: 2.2 }, style || {});
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= n; i++) {
      const x = a + (i / n) * (b - a);
      const y = f(x);
      if (!Number.isFinite(y)) { started = false; continue; }
      const X = xOf(x), Y = yOf(y);
      if (!started) { ctx.moveTo(X, Y); started = true; }
      else ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.stroke();
  }

  function polyline(ctx, pts, style) {
    const s = Object.assign({ color: C.burgundy, width: 2, fill: null }, style || {});
    if (!pts.length) return;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (s.fill) { ctx.fillStyle = s.fill; ctx.fill(); }
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.stroke();
  }

  function disc(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function heatmap(ctx, ox, oy, side, fxy, R) {
    const sw = 280;
    const img = ctx.createImageData(sw, sw);
    const lerp = (a, b, t) => a + (b - a) * t;
    for (let j = 0; j < sw; j++) {
      for (let i = 0; i < sw; i++) {
        const x = -R + (i / (sw - 1)) * 2 * R;
        const y = R - (j / (sw - 1)) * 2 * R;
        const v = fxy(x, y);
        const t = Number.isNaN(v) ? 0.5 : Math.max(0, Math.min(1, (v + 1) / 2));
        const r0 = t < 0.5 ? lerp(27, 243, t * 2) : lerp(243, 107, (t - 0.5) * 2);
        const g0 = t < 0.5 ? lerp(95, 234, t * 2) : lerp(234, 20, (t - 0.5) * 2);
        const b0 = t < 0.5 ? lerp(92, 220, t * 2) : lerp(220, 86, (t - 0.5) * 2);
        const p = (j * sw + i) * 4;
        img.data[p] = r0; img.data[p + 1] = g0; img.data[p + 2] = b0; img.data[p + 3] = 255;
      }
    }
    const off = document.createElement("canvas");
    off.width = sw; off.height = sw;
    off.getContext("2d").putImageData(img, 0, 0);
    ctx.drawImage(off, ox, oy, side, side);
  }

  function label(ctx, text, x, y, color, size) {
    ctx.fillStyle = color || C.ink;
    ctx.font = (size || TYPE) + "px 'Noto Serif SC', serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y);
  }

  /* 曲线 f 与 g 之间（默认 g=0）从 a 到 b 的区域填色；sign=true 时轴上轴下分色 */
  function fillBetween(ctx, xOf, yOf, f, a, b, style) {
    const s = Object.assign({ g: () => 0, color: "rgba(107,20,86,0.22)", neg: null, n: 200 }, style || {});
    if (!(b > a)) return;
    const n = s.n;
    /* 按正负分成若干连续段，每段画成一个多边形，避免细条拼接的接缝 */
    let run = [], runNeg = null;
    const flush = () => {
      if (run.length > 1) {
        ctx.beginPath();
        ctx.moveTo(xOf(run[0][0]), yOf(run[0][1]));
        run.forEach(([x, t]) => ctx.lineTo(xOf(x), yOf(t)));
        for (let j = run.length - 1; j >= 0; j--) ctx.lineTo(xOf(run[j][0]), yOf(run[j][2]));
        ctx.closePath();
        ctx.fillStyle = runNeg && s.neg ? s.neg : s.color;
        ctx.fill();
      }
      run = [];
    };
    for (let i = 0; i <= n; i++) {
      const x = a + (i / n) * (b - a);
      const top = f(x), bot = s.g(x);
      if (!Number.isFinite(top) || !Number.isFinite(bot)) { flush(); continue; }
      const neg = top < bot;
      if (s.neg && run.length && neg !== runNeg) {
        const last = run[run.length - 1];
        const d0 = last[1] - last[2], d1 = top - bot;
        const xc = last[0] + (x - last[0]) * (d0 / (d0 - d1 || 1));
        const yc = bot + ((last[2] - bot) * (x - xc)) / (x - last[0] || 1);
        run.push([xc, yc, yc]);
        flush();
        run.push([xc, yc, yc]);
      }
      runNeg = neg;
      run.push([x, top, bot]);
    }
    flush();
  }

  /* 只在坐标框内作画：A 是 axes() 的返回值 */
  function clip(ctx, A, draw) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(A.m.l, A.m.t, A.pw, A.ph);
    ctx.clip();
    draw();
    ctx.restore();
  }

  function dashed(ctx, X0, Y0, X1, Y1, color, width) {
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = color || C.gold;
    ctx.lineWidth = width || 1.6;
    ctx.beginPath();
    ctx.moveTo(X0, Y0);
    ctx.lineTo(X1, Y1);
    ctx.stroke();
    ctx.restore();
  }

  /* 读数里用 KaTeX 排公式；没有 KaTeX 时退回纯文本 */
  function tex(el, s) {
    if (window.katex) {
      el.innerHTML = s.replace(/\$([^$]+)\$/g, (_, m) => window.katex.renderToString(m, { throwOnError: false }));
    } else el.textContent = s.replace(/\$/g, "");
  }

  window.Plot = { C, axes, curve, polyline, disc, heatmap, label, fillBetween, dashed, tex, niceTicks, clip };
})();
