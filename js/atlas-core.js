/* 概念图鉴的画板。不依赖外网。 */
(function () {
  const C = {
    burgundy: "#6b1456",
    deep: "#3f0c32",
    gold: "#b07a28",
    teal: "#1b5f5c",
    ink: "#241616",
    muted: "#6a5858",
    paper: "#f3eadc",
    card: "#fffaf2",
    rule: "#d7c8b2",
    danger: "#9c2f2f",
    ok: "#2c6b45",
  };
  const SERIF = "'Palatino Linotype', Palatino, 'Songti SC', 'SimSun', serif";

  function num(v, d) {
    if (!Number.isFinite(v)) return "—";
    return Number(v).toFixed(d).replace("-", "−");
  }
  function say(formula, text, tone) {
    return { formula, text, tone: tone || "" };
  }
  function rng(key, label, min, max, step, digits, when) {
    return { type: "range", key, label, min, max, step, digits, when: when || null, suffix: "" };
  }
  function cho(key, label, options, when) {
    return { type: "choice", key, label, options, when: when || null };
  }
  function act(key, label) {
    return { type: "action", key, label };
  }

  function ticks(a, b, want) {
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
    const s = Math.abs(v) >= 100 || Math.abs(v - Math.round(v)) < 1e-8
      ? String(Math.round(v))
      : String(Math.round(v * 100) / 100);
    return s.replace("-", "−");
  }

  function axes(ctx, w, h, opt) {
    const o = Object.assign({
      l: 52, r: 16, t: 30, b: 38,
      xMin: -1, xMax: 1, yMin: -1, yMax: 1,
      xlabel: "x", ylabel: "y", title: "", grid: true, equal: false,
    }, opt || {});
    ctx.fillStyle = C.card;
    ctx.fillRect(0, 0, w, h);
    let pw = Math.max(8, w - o.l - o.r);
    let ph = Math.max(8, h - o.t - o.b);
    let l = o.l, t = o.t;
    if (o.equal) {
      const side = Math.min(pw, ph);
      l += (pw - side) / 2;
      t += (ph - side) / 2;
      pw = side;
      ph = side;
    }
    const xSpan = o.xMax - o.xMin || 1;
    const ySpan = o.yMax - o.yMin || 1;
    const xOf = (x) => l + ((x - o.xMin) / xSpan) * pw;
    const yOf = (y) => t + (1 - (y - o.yMin) / ySpan) * ph;
    if (o.grid) {
      const xs = ticks(o.xMin, o.xMax, Math.max(2, Math.round(pw / 78)));
      const ys = ticks(o.yMin, o.yMax, Math.max(2, Math.round(ph / 52)));
      ctx.strokeStyle = "rgba(36,22,22,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      xs.forEach((v) => { const X = Math.round(xOf(v)) + 0.5; ctx.moveTo(X, t); ctx.lineTo(X, t + ph); });
      ys.forEach((v) => { const Y = Math.round(yOf(v)) + 0.5; ctx.moveTo(l, Y); ctx.lineTo(l + pw, Y); });
      ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.font = "13px " + SERIF;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      xs.forEach((v) => ctx.fillText(tickText(v), xOf(v), t + ph + 4));
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ys.forEach((v) => ctx.fillText(tickText(v), l - 6, yOf(v)));
    }
    ctx.strokeStyle = "rgba(36,22,22,0.38)";
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    if (o.xMin < 0 && o.xMax > 0) { ctx.moveTo(xOf(0), t); ctx.lineTo(xOf(0), t + ph); }
    if (o.yMin < 0 && o.yMax > 0) { ctx.moveTo(l, yOf(0)); ctx.lineTo(l + pw, yOf(0)); }
    ctx.stroke();
    ctx.strokeStyle = C.rule;
    ctx.strokeRect(l + 0.5, t + 0.5, Math.max(1, pw - 1), Math.max(1, ph - 1));
    ctx.fillStyle = C.ink;
    ctx.font = "15px " + SERIF;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    if (o.title) ctx.fillText(o.title, l, Math.max(16, t - 8));
    ctx.fillStyle = C.muted;
    ctx.font = "13px " + SERIF;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if (o.xlabel) ctx.fillText(o.xlabel, l + pw / 2, Math.min(h - 6, t + ph + 30));
    if (o.ylabel) {
      ctx.save();
      ctx.translate(14, t + ph / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText(o.ylabel, 0, 0);
      ctx.restore();
    }
    return { xOf, yOf, l, t, pw, ph, xMin: o.xMin, xMax: o.xMax, yMin: o.yMin, yMax: o.yMax, w, h };
  }

  function clip(ctx, box, fn) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.l, box.t, box.pw, box.ph);
    ctx.clip();
    fn();
    ctx.restore();
  }

  function curve(ctx, box, f, a, b, n, style) {
    const s = style || {};
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.l, box.t, box.pw, box.ph);
    ctx.clip();
    ctx.beginPath();
    ctx.lineWidth = s.width || 2.4;
    ctx.strokeStyle = s.color || C.burgundy;
    ctx.setLineDash(s.dash || []);
    let prev = null;
    let on = false;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const y = f(x);
      if (!Number.isFinite(y)) { on = false; prev = null; continue; }
      const X = box.xOf(x);
      const Y = box.yOf(y);
      if (on && prev != null && Math.abs(Y - prev) > box.ph) on = false;
      if (!on) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
      on = true;
      prev = Y;
    }
    ctx.stroke();
    ctx.restore();
  }

  function band(ctx, box, f, g, a, b, n, color) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.l, box.t, box.pw, box.ph);
    ctx.clip();
    ctx.beginPath();
    let moved = false;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const y = f(x);
      if (!Number.isFinite(y)) continue;
      const X = box.xOf(x), Y = box.yOf(y);
      if (!moved) { ctx.moveTo(X, Y); moved = true; }
      else ctx.lineTo(X, Y);
    }
    for (let i = n; i >= 0; i--) {
      const x = a + ((b - a) * i) / n;
      const y = g(x);
      if (!Number.isFinite(y)) continue;
      ctx.lineTo(box.xOf(x), box.yOf(y));
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function disc(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function label(ctx, text, x, y, color, size) {
    ctx.fillStyle = color || C.ink;
    ctx.font = (size || 14) + "px " + SERIF;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y);
  }

  function arrow(ctx, x1, y1, x2, y2, color, width) {
    const dx = x2 - x1, dy = y2 - y1;
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 2.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 11 * ux + 5 * uy, y2 - 11 * uy - 5 * ux);
    ctx.lineTo(x2 - 11 * ux - 5 * uy, y2 - 11 * uy + 5 * ux);
    ctx.closePath();
    ctx.fill();
  }

  function dash(ctx, x1, y1, x2, y2, color) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = color || C.gold;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function tangent(ctx, box, x, y, slope, half, color) {
    ctx.save();
    ctx.strokeStyle = color || C.gold;
    ctx.lineWidth = 2.2;
    if (!Number.isFinite(slope) || Math.abs(slope) > 60) {
      ctx.beginPath();
      ctx.moveTo(box.xOf(x), box.t);
      ctx.lineTo(box.xOf(x), box.t + box.ph);
      ctx.stroke();
      ctx.restore();
      return;
    }
    clip(ctx, box, () => {
      ctx.beginPath();
      ctx.moveTo(box.xOf(x - half), box.yOf(y - half * slope));
      ctx.lineTo(box.xOf(x + half), box.yOf(y + half * slope));
      ctx.stroke();
    });
    ctx.restore();
  }

  function ramp(v, lo, hi) {
    const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo || 1)));
    const teal = [20, 95, 92], paper = [255, 250, 242], burg = [122, 28, 86];
    const mix = (a, b, u) => a.map((n, i) => Math.round(n + (b[i] - n) * u));
    const c = t < 0.5 ? mix(teal, paper, t * 2) : mix(paper, burg, (t - 0.5) * 2);
    c.push(255);
    return c;
  }

  function heat(ctx, box, fn, lo, hi) {
    const sw = Math.max(40, Math.min(150, Math.floor(box.pw / 2)));
    const sh = Math.max(40, Math.min(150, Math.floor(box.ph / 2)));
    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    const o = off.getContext("2d");
    const img = o.createImageData(sw, sh);
    for (let j = 0; j < sh; j++) {
      for (let i = 0; i < sw; i++) {
        const x = box.xMin + (i / (sw - 1)) * (box.xMax - box.xMin);
        const y = box.yMax - (j / (sh - 1)) * (box.yMax - box.yMin);
        const v = fn(x, y);
        const col = Number.isFinite(v) ? ramp(v, lo, hi) : [255, 250, 242, 255];
        const p = (j * sw + i) * 4;
        img.data[p] = col[0];
        img.data[p + 1] = col[1];
        img.data[p + 2] = col[2];
        img.data[p + 3] = col[3];
      }
    }
    o.putImageData(img, 0, 0);
    ctx.drawImage(off, box.l, box.t, box.pw, box.ph);
  }

  function pane(ctx, x, y, w, h, fn) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.translate(x, y);
    fn(w, h);
    ctx.restore();
  }

  function glyphF() {
    const raw = [[0, 0], [0, 1.7], [1.15, 1.7], [1.15, 1.38], [0.42, 1.38], [0.42, 1.02], [0.98, 1.02], [0.98, 0.7], [0.42, 0.7], [0.42, 0]];
    return raw.map(([x, y]) => [x - 0.5, y - 0.85]);
  }

  function strokePoly(ctx, box, pts, color, width, fill) {
    if (!pts.length) return;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const X = box.xOf(p[0]), Y = box.yOf(p[1]);
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    });
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = color;
    ctx.lineWidth = width || 2.2;
    ctx.stroke();
  }

  function mapPts(pts, A) {
    return pts.map((p) => AtlasMath.matVec(A, p));
  }

  window.A = {
    C, SERIF, num, say, rng, cho, act,
    axes, clip, curve, band, disc, label, arrow, dash, tangent,
    heat, ramp, pane, glyphF, strokePoly, mapPts,
  };
})();
