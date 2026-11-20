/* 课后自测：题目来自 js/quiz/<讲>.js 里的 window.QUIZ[讲]，每轮随机抽 n 题，点选即判，附解析。 */
(function () {
  const LETTERS = "ABCD";

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function wrapMath(s) {
    if (/\\\(|\$|[\u4e00-\u9fff]/.test(s)) return s;
    return "\\(\\displaystyle " + s + "\\)";
  }

  Deck.on("quiz", (slide) => {
    const box = slide.querySelector(".quiz");
    if (!box || box.dataset.bound) return;
    box.dataset.bound = "1";
    const bank = (window.QUIZ || {})[box.dataset.quiz] || [];
    const n = Math.min(Number(box.dataset.n) || 6, bank.length);
    if (!bank.length) {
      box.textContent = "本讲题库尚未导出。";
      return;
    }
    let round = [], k = 0, right = 0;

    function start() {
      round = shuffle(bank.slice()).slice(0, n);
      k = 0;
      right = 0;
      ask();
    }

    function ask() {
      const q = round[k];
      box.innerHTML =
        `<div class="q-head">第 ${k + 1} / ${n} 题　·　已答对 ${right}</div>` +
        `<div class="q-stem">${q.stem.replace(/\\\(/g, "\\(\\displaystyle ")}</div>` +
        `<div class="q-choices">${q.choices.map((c, i) => `<button type="button" data-i="${i}"><b>${LETTERS[i]}</b>${wrapMath(c)}</button>`).join("")}</div>` +
        `<div class="q-why" hidden></div>` +
        `<div class="q-nav"><button type="button" class="btn primary q-next" hidden>${k + 1 < n ? "下一题" : "看成绩"}</button></div>`;
      Deck.renderMath(box);
      box.querySelectorAll(".q-choices button").forEach((b) => {
        b.onclick = () => {
          const i = Number(b.dataset.i);
          const ok = i === q.answer;
          if (ok) right += 1;
          box.querySelectorAll(".q-choices button").forEach((x) => {
            x.disabled = true;
            if (Number(x.dataset.i) === q.answer) x.classList.add("right");
          });
          if (!ok) b.classList.add("wrong");
          const why = box.querySelector(".q-why");
          why.hidden = false;
          why.innerHTML = `${ok ? "答对了。" : `正确答案是 ${LETTERS[q.answer]}。`}${q.explain}`;
          Deck.renderMath(why);
          box.querySelector(".q-head").textContent = `第 ${k + 1} / ${n} 题　·　已答对 ${right}`;
          const nx = box.querySelector(".q-next");
          nx.hidden = false;
          nx.onclick = () => { k += 1; if (k < n) ask(); else finish(); };
        };
      });
    }

    function finish() {
      const msg = right === n ? "全对。可以去做选做题了。" : right >= n - 1 ? "基本掌握。错的那题回到对应页再看一遍。" : "建议回看本讲的推导页与课堂练，再来一组。";
      box.innerHTML =
        `<div class="q-score">${right} / ${n}</div><p>${msg}</p>` +
        `<div class="q-nav"><button type="button" class="btn primary q-again">再来一组</button></div>`;
      box.querySelector(".q-again").onclick = start;
    }

    start();
  });
})();
