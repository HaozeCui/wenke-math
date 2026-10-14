/* 方向键翻页、页码、备注、全屏、解答揭晓、本讲提纲。不使用 ES module。 */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    i: 0,
    slides: [],
    hooks: {},
    reveal: false,
    teacher: new URLSearchParams(location.search).has("teacher"),
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
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }

  function pageLabel() {
    const vis = visibleList();
    const pos = vis.indexOf(current());
    const n = pos >= 0 ? pos + 1 : state.i + 1;
    return `${n} / ${vis.length}`;
  }

  function fillOutline() {
    const box = $("#outline-list");
    if (!box) return;
    box.innerHTML = visibleList().map((s) => {
      const k = state.slides.indexOf(s);
      const t = s.dataset.title || s.querySelector(".slide-title")?.textContent || `第 ${k + 1} 页`;
      const on = k === state.i ? " class=\"on\"" : "";
      return `<button type="button" data-jump="${k}"${on}>${t}</button>`;
    }).join("");
  }

  function show(n, { hash = true } = {}) {
    const max = state.slides.length - 1;
    let i = Math.max(0, Math.min(max, n));
    if (!allowed(state.slides[i])) {
      while (i <= max && !allowed(state.slides[i])) i += 1;
      if (i > max) {
        i = max;
        while (i > 0 && !allowed(state.slides[i])) i -= 1;
      }
    }
    state.i = i;
    state.slides.forEach((s, k) => s.classList.toggle("active", k === state.i));
    const slide = current();
    if (!slide) return;
    const title = slide.dataset.title || "";
    const sec = $("#sec-label");
    if (sec) sec.textContent = title;
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
    window.dispatchEvent(new CustomEvent("slidechange", { detail: { i: state.i, slide } }));
  }

  function next() {
    let n = state.i + 1;
    while (n < state.slides.length && !allowed(state.slides[n])) n += 1;
    show(n);
  }
  function prev() {
    let n = state.i - 1;
    while (n >= 0 && !allowed(state.slides[n])) n -= 1;
    show(n);
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

  window.Deck = {
    on: (name, fn) => { state.hooks[name] = fn; },
    show,
    next,
    prev,
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
    show(start, { hash: false });
    renderMath(document.body);

    document.addEventListener("keydown", (e) => {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault(); next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault(); prev();
      } else if (e.key === "Home") show(0);
      else if (e.key === "End") {
        const vis = visibleList();
        show(state.slides.indexOf(vis[vis.length - 1]));
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if ((e.key === "n" || e.key === "N") && state.teacher) {
        $("#notes")?.classList.toggle("open");
      } else if (e.key === "a" || e.key === "A") {
        toggleReveal();
      } else if (e.key === "i" || e.key === "I") {
        toggleOutline();
      } else if (e.key === "?" || e.key === "/") {
        $("#help")?.classList.toggle("open");
      } else if (e.key === "Escape") {
        $("#help")?.classList.remove("open");
        $("#notes")?.classList.remove("open");
        $("#outline")?.classList.remove("open");
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
    $("#btn-full")?.addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
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
    });
    window.addEventListener("hashchange", () => {
      const n = parseInt((location.hash || "#1").slice(1), 10);
      if (!Number.isFinite(n)) return;
      if (isAnswer(state.slides[n - 1])) state.reveal = true;
      show(n - 1, { hash: false });
    });
  });
})();
