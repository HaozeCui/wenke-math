/* 方向键翻页、逐步揭示、页码与进度、备注、全屏、解答揭晓、本讲提纲、计时、画笔、黑屏。不使用 ES module。 */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    i: 0,
    slides: [],
    hooks: {},
    reveal: false,
    teacher: new URLSearchParams(location.search).has("teacher"),
    ink: {},
    pen: false,
  };

  const MATH_OPTS = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  };

  function current() {
    return state.slides[state.i];
  }

  function isAnswer(s) {
    return s && s.dataset.kind === "answer";
  }
  function isMeta(s) {
    return s && s.dataset.kind === "meta";
  }
  function allowed(s) {
    if (!s) return false;
    if (!state.teacher && isMeta(s)) return false;
    if (!state.reveal && isAnswer(s)) return false;
    return true;
  }

  function visibleList() {
    return state.slides.filter(allowed);
  }

  function renderMath(el) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(el, MATH_OPTS);
  }

  /* ---------- 逐步揭示 ---------- */
  /* 同一 data-g 的若干元素算作一步（推导页的一行等式与它的理由） */
  function steps(s) {
    if (!s) return [];
    const groups = [], byG = {};
    $$(".step", s).forEach((el) => {
      const g = el.dataset.g;
      if (!g) { groups.push([el]); return; }
      if (!byG[g]) { byG[g] = []; groups.push(byG[g]); }
      byG[g].push(el);
    });
    return groups;
  }
  function stepK(s) {
    return Number(s?.dataset.stepk || 0);
  }
  function setSteps(s, k) {
    if (!s) return;
    const st = steps(s);
    k = Math.max(0, Math.min(st.length, k));
    st.forEach((g, j) => g.forEach((el) => el.classList.toggle("shown", j < k)));
    s.dataset.stepk = String(k);
  }

  function pageLabel() {
    const vis = visibleList();
    const pos = vis.indexOf(current());
    const n = pos >= 0 ? pos + 1 : state.i + 1;
    const st = steps(current());
    const narrow = window.matchMedia("(max-width: 960px)").matches;
    if (narrow) return `${n}/${vis.length}` + (st.length ? `·${stepK(current())}/${st.length}` : "");
    const tail = st.length ? `　·　${stepK(current())}/${st.length} 步` : "";
    return `${n} / ${vis.length}${tail}`;
  }

  function fillOutline() {
    const box = $("#outline-list");
    if (!box) return;
    let sec = "";
    box.innerHTML = visibleList().map((s) => {
      const k = state.slides.indexOf(s);
      const t = s.dataset.title || s.querySelector(".slide-title")?.textContent || `第 ${k + 1} 页`;
      const on = k === state.i ? " class=\"on\"" : "";
      let head = "";
      if (s.dataset.sec && s.dataset.sec !== sec) {
        sec = s.dataset.sec;
        head = `<div class="grp">${sec}</div>`;
      }
      if (s.classList.contains("divider")) return head;
      return `${head}<button type="button" data-jump="${k}"${on}>${t}</button>`;
    }).join("");
  }

  function fillProgress() {
    const bar = $("#progress");
    if (!bar) return;
    const vis = visibleList();
    const pos = Math.max(0, vis.indexOf(current()));
    const frac = vis.length > 1 ? pos / (vis.length - 1) : 1;
    bar.querySelector("i").style.width = (frac * 100).toFixed(2) + "%";
    $$(".tick", bar).forEach((t) => t.remove());
    vis.forEach((s, j) => {
      if (!s.classList.contains("divider") || j === 0) return;
      const t = document.createElement("b");
      t.className = "tick";
      t.style.left = ((j / (vis.length - 1)) * 100).toFixed(2) + "%";
      t.title = s.dataset.title || "";
      bar.appendChild(t);
    });
  }

  function show(n, { hash = true, allSteps = false } = {}) {
    const max = state.slides.length - 1;
    let i = Math.max(0, Math.min(max, n));
    if (!allowed(state.slides[i])) {
      while (i <= max && !allowed(state.slides[i])) i += 1;
      if (i > max) {
        i = max;
        while (i > 0 && !allowed(state.slides[i])) i -= 1;
      }
    }
    const moved = i !== state.i;
    state.i = i;
    state.slides.forEach((s, k) => s.classList.toggle("active", k === state.i));
    const slide = current();
    if (!slide) return;
    if (moved || allSteps) setSteps(slide, allSteps ? steps(slide).length : 0);
    const title = slide.dataset.title || "";
    const sec = $("#sec-label");
    if (sec) sec.textContent = slide.dataset.sec && slide.dataset.sec !== title ? `${slide.dataset.sec}　·　${title}` : title;
    const page = $("#page");
    if (page) page.textContent = pageLabel();
    const notes = $("#notes");
    if (notes) notes.innerHTML = `<b>备注</b>　${slide.dataset.notes || "本页无额外备注。"}`;
    const app = document.querySelector(".app");
    if (app) {
      app.classList.toggle("cover-mode", slide.classList.contains("cover"));
      app.classList.toggle("reveal-answers", state.reveal);
    }
    document.body.classList.toggle("play", !state.teacher);
    document.body.classList.toggle("teacher", state.teacher);
    const ansBtn = $("#btn-ans");
    if (ansBtn) ansBtn.textContent = state.reveal ? "解答开" : "解答 A";
    if (hash) history.replaceState(null, "", `${location.search}#${state.i + 1}`);
    renderMath(slide);
    const hook = slide.dataset.hook;
    if (hook && state.hooks[hook]) {
      requestAnimationFrame(() => state.hooks[hook](slide));
    }
    fillOutline();
    fillProgress();
    drawInk();
    window.dispatchEvent(new CustomEvent("slidechange", { detail: { i: state.i, slide } }));
  }

  function next() {
    const s = current();
    if (stepK(s) < steps(s).length) {
      setSteps(s, stepK(s) + 1);
      $("#page").textContent = pageLabel();
      return;
    }
    let n = state.i + 1;
    while (n < state.slides.length && !allowed(state.slides[n])) n += 1;
    show(n);
  }
  function prev() {
    const s = current();
    if (stepK(s) > 0) {
      setSteps(s, stepK(s) - 1);
      $("#page").textContent = pageLabel();
      return;
    }
    let n = state.i - 1;
    while (n >= 0 && !allowed(state.slides[n])) n -= 1;
    if (n >= 0) show(n, { allSteps: true });
  }

  function toggleReveal() {
    state.reveal = !state.reveal;
    if (state.reveal) {
      const nxt = state.slides[state.i + 1];
      if (isAnswer(nxt)) show(state.i + 1);
      else show(state.i);
    } else {
      if (isAnswer(current())) {
        let n = state.i - 1;
        while (n >= 0 && isAnswer(state.slides[n])) n -= 1;
        while (n >= 0 && !allowed(state.slides[n])) n -= 1;
        show(Math.max(0, n));
      } else show(state.i);
    }
  }

  function toggleOutline() {
    $("#outline")?.classList.toggle("open");
    fillOutline();
  }

  /* ---------- 计时 ---------- */
  const clock = { left: 0, id: 0 };
  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  function stopClock() {
    clearInterval(clock.id);
    clock.id = 0;
    const el = $("#clock");
    if (el) { el.className = "clock"; el.textContent = ""; }
  }
  function startClock(sec) {
    stopClock();
    clock.left = sec;
    const el = $("#clock");
    if (!el) return;
    el.className = "clock on";
    el.textContent = fmt(clock.left);
    clock.id = setInterval(() => {
      clock.left -= 1;
      if (clock.left <= 0) {
        clearInterval(clock.id);
        clock.id = 0;
        el.className = "clock on done";
        el.textContent = "时间到";
        return;
      }
      el.textContent = fmt(clock.left);
    }, 1000);
  }
  function timerFromSlide() {
    if (clock.id) { stopClock(); return; }
    const b = current()?.querySelector(".timer");
    startClock(b ? Number(b.dataset.sec) : 180);
  }

  /* ---------- 画笔 ---------- */
  function inkCanvas() {
    const c = $("#ink");
    const stage = $(".stage");
    if (!c || !stage) return null;
    const r = stage.getBoundingClientRect();
    c.style.left = r.left + "px";
    c.style.top = r.top + "px";
    c.style.width = r.width + "px";
    c.style.height = r.height + "px";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.floor(r.width * dpr)), H = Math.max(1, Math.floor(r.height * dpr));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { c, ctx, w: r.width, h: r.height };
  }
  function drawInk() {
    const k = inkCanvas();
    if (!k) return;
    const { ctx, w, h } = k;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#c0262d";
    ctx.lineWidth = 4;
    (state.ink[state.i] || []).forEach((pts) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * w, pts[0][1] * h);
      for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0] * w, pts[j][1] * h);
      ctx.stroke();
    });
  }
  function setPen(on) {
    state.pen = on;
    $("#ink")?.classList.toggle("on", on);
    $("#btn-pen")?.classList.toggle("primary", on);
    drawInk();
  }
  function bindInk() {
    const c = $("#ink");
    if (!c) return;
    let cur = null;
    const at = (e) => {
      const r = c.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    c.addEventListener("pointerdown", (e) => {
      if (!state.pen) return;
      c.setPointerCapture(e.pointerId);
      cur = [at(e)];
      (state.ink[state.i] = state.ink[state.i] || []).push(cur);
    });
    c.addEventListener("pointermove", (e) => {
      if (!cur) return;
      cur.push(at(e));
      drawInk();
    });
    const end = () => { cur = null; };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
  }

  /* ---------- 打印：先把所有实验画好 ---------- */
  function renderAllForPrint() {
    document.body.classList.add("printing");
    state.slides.forEach((s) => {
      setSteps(s, steps(s).length);
      renderMath(s);
      const hook = s.dataset.hook;
      if (hook && state.hooks[hook]) {
        try { state.hooks[hook](s); } catch (err) { console.warn(err); }
      }
    });
  }

  window.Deck = {
    on: (name, fn) => { state.hooks[name] = fn; },
    show,
    next,
    prev,
    renderMath,
    fitCanvas(canvas) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(120, Math.floor(rect.width));
      const h = Math.max(120, Math.floor(rect.height));
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    },
  };

  window.addEventListener("DOMContentLoaded", () => {
    state.slides = $$(".slide");
    if (!state.slides.length) return;
    const fromHash = parseInt((location.hash || "#1").slice(1), 10);
    const start = Number.isFinite(fromHash) ? fromHash - 1 : 0;
    if (isAnswer(state.slides[start])) state.reveal = true;
    state.i = -1;
    show(start, { hash: false });
    renderMath(document.body);
    bindInk();

    document.addEventListener("keydown", (e) => {
      if (e.target.matches?.("input, textarea, select")) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const black = $("#blackout");
      if (black?.classList.contains("open")) {
        e.preventDefault();
        black.classList.remove("open");
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault(); next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault(); prev();
      } else if (e.key === "Home") show(0);
      else if (e.key === "End") {
        const vis = visibleList();
        show(state.slides.indexOf(vis[vis.length - 1]), { allSteps: true });
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if ((e.key === "n" || e.key === "N") && state.teacher) {
        $("#notes")?.classList.toggle("open");
      } else if (e.key === "a" || e.key === "A") {
        toggleReveal();
      } else if (e.key === "i" || e.key === "I") {
        toggleOutline();
      } else if (e.key === "t" || e.key === "T") {
        timerFromSlide();
      } else if (e.key === "p" || e.key === "P") {
        setPen(!state.pen);
      } else if (e.key === "c" || e.key === "C") {
        delete state.ink[state.i];
        drawInk();
      } else if (e.key === "b" || e.key === "B" || e.key === ".") {
        black?.classList.add("open");
      } else if (e.key === "?" || e.key === "/") {
        $("#help")?.classList.toggle("open");
      } else if (e.key === "Escape") {
        $("#help")?.classList.remove("open");
        $("#notes")?.classList.remove("open");
        $("#outline")?.classList.remove("open");
        if (state.pen) setPen(false);
      }
    });

    $("#btn-prev")?.addEventListener("click", prev);
    $("#btn-next")?.addEventListener("click", next);
    $("#btn-help")?.addEventListener("click", () => $("#help")?.classList.toggle("open"));
    if (state.teacher) {
      $("#btn-notes")?.addEventListener("click", () => $("#notes")?.classList.toggle("open"));
    }
    $("#btn-ans")?.addEventListener("click", toggleReveal);
    $("#btn-toc")?.addEventListener("click", toggleOutline);
    $("#btn-pen")?.addEventListener("click", () => setPen(!state.pen));
    $("#btn-full")?.addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    });
    $("#clock")?.addEventListener("click", stopClock);
    $("#blackout")?.addEventListener("click", () => $("#blackout")?.classList.remove("open"));
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".timer");
      if (!b) return;
      if (clock.id) stopClock();
      else startClock(Number(b.dataset.sec) || 180);
    });
    $("#help")?.addEventListener("click", () => $("#help")?.classList.remove("open"));
    $("#outline")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-jump]");
      if (!b) return;
      const k = Number(b.dataset.jump);
      if (isAnswer(state.slides[k])) state.reveal = true;
      show(k);
      $("#outline")?.classList.remove("open");
    });

    window.addEventListener("resize", () => {
      const hook = current()?.dataset.hook;
      if (hook && state.hooks[hook]) state.hooks[hook](current());
      drawInk();
    });
    window.addEventListener("hashchange", () => {
      const n = parseInt((location.hash || "#1").slice(1), 10);
      if (!Number.isFinite(n)) return;
      if (isAnswer(state.slides[n - 1])) state.reveal = true;
      show(n - 1, { hash: false });
    });
    window.addEventListener("beforeprint", renderAllForPrint);
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("printing");
      show(state.i, { hash: false });
    });

    const stage = document.querySelector(".stage");
    if (stage) bindSwipe(stage);
  });

  function bindSwipe(stage) {
    let x0 = 0;
    let y0 = 0;
    let mode = "";
    const block = "input, textarea, select, button, a, .seg, .ctrl";

    stage.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) {
        mode = "ignore";
        return;
      }
      const t = e.target;
      if (t.closest(block)) {
        mode = "ignore";
        return;
      }
      const wide = t.closest(".katex-display, .sheet, table");
      if (wide && wide.scrollWidth > wide.clientWidth + 12) {
        mode = "ignore";
        return;
      }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      mode = "";
    }, { passive: true });

    stage.addEventListener("touchmove", (e) => {
      if (mode === "ignore" || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - x0;
      const dy = e.touches[0].clientY - y0;
      if (!mode) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      }
      if (mode === "x") e.preventDefault();
    }, { passive: false });

    stage.addEventListener("touchend", (e) => {
      if (mode !== "x") {
        mode = "";
        return;
      }
      const dx = e.changedTouches[0].clientX - x0;
      const help = $("#help");
      const outline = $("#outline");
      const overlay = help?.classList.contains("open") || outline?.classList.contains("open");
      if (!overlay && dx <= -56) next();
      else if (!overlay && dx >= 56) prev();
      mode = "";
    }, { passive: true });

    stage.addEventListener("touchcancel", () => { mode = ""; });
  }
})();
