// Claude Academy VN — logic ứng dụng

(() => {
"use strict";

// ───────────────────────── Tiến độ (localStorage) ─────────────────────────
const STORE_KEY = "ca-progress-v1";
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let P = loadProgress();
P.done = P.done || {};        // lessonId -> true
P.quiz = P.quiz || {};        // courseId -> best score %
P.days = P.days || [];        // các ngày có học (yyyy-mm-dd)

function markStudyDay() {
  const d = new Date().toISOString().slice(0, 10);
  if (!P.days.includes(d)) { P.days.push(d); }
}
function streak() {
  const set = new Set(P.days);
  let n = 0; const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function courseProgress(c) {
  const total = c.lessons.length;
  const done = c.lessons.filter(l => P.done[l.id]).length;
  return { done, total, pct: Math.round(done / total * 100) };
}

// ───────────────────────── Âm thanh: đọc bài (TTS) + hiệu ứng ─────────────────────────
const TTS = {
  utter: null, playing: false, rate: 1,
  viVoice() {
    const vs = speechSynthesis.getVoices();
    return vs.find(v => v.lang && v.lang.toLowerCase().startsWith("vi")) || null;
  },
  speak(text, onend) {
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN"; u.rate = this.rate;
    const v = this.viVoice(); if (v) u.voice = v;
    u.onend = () => { this.playing = false; updateAudioBar(); if (onend) onend(); };
    u.onerror = () => { this.playing = false; updateAudioBar(); };
    this.utter = u; this.playing = true;
    speechSynthesis.speak(u);
  },
  pause() { speechSynthesis.pause(); this.playing = false; },
  resume() { speechSynthesis.resume(); this.playing = true; },
  stop() { speechSynthesis.cancel(); this.playing = false; }
};
if ("speechSynthesis" in window) speechSynthesis.getVoices(); // nạp danh sách giọng sớm

// Hiệu ứng âm thanh ngắn (WebAudio — không cần file)
let audioCtx = null;
function sfx(kind) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === "correct" ? [[523, 0], [659, .09], [784, .18]]
                : kind === "wrong"   ? [[220, 0], [185, .12]]
                : kind === "done"    ? [[523, 0], [659, .1], [784, .2], [1047, .3]]
                : [[660, 0]];
    notes.forEach(([f, t]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.18, audioCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + t + .22);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + .25);
    });
  } catch { /* không có audio cũng không sao */ }
}

// ───────────────────────── Tiện ích ─────────────────────────
const app = document.getElementById("app");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
function go(hash) { location.hash = hash; }
function findCourse(id) { return COURSES.find(c => c.id === id); }
function lessonSpeechText(l) {
  const parts = [l.title + "."];
  l.sections.forEach(s => {
    if (s.h) parts.push(s.h + ".");
    (s.p || []).forEach(p => parts.push(p));
    (s.list || []).forEach(it => parts.push(it));
  });
  parts.push("Điểm cần nhớ:");
  l.takeaways.forEach(t => parts.push(t));
  return parts.join(" ");
}

// ───────────────────────── Trang chủ ─────────────────────────
function renderHome() {
  TTS.stop();
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);
  const doneLessons = Object.keys(P.done).length;
  const pct = Math.round(doneLessons / totalLessons * 100);
  app.innerHTML = `
  <header class="hero">
    <div class="hero-top">
      <div class="logo">CLAUDE<span>\\</span>ACADEMY</div>
      <button class="icon-btn" id="themeBtn" title="Đổi giao diện sáng/tối">🌓</button>
    </div>
    <h1>Học nhanh các khoá Claude</h1>
    <p class="sub">7 khoá học tiếng Việt theo chương trình Anthropic Academy — nghe bài giảng, xem minh hoạ, làm quiz và ôn flashcard.</p>
    <div class="stats">
      <div class="stat"><b>${doneLessons}/${totalLessons}</b><span>bài đã học</span></div>
      <div class="stat"><b>${pct}%</b><span>hoàn thành</span></div>
      <div class="stat"><b>🔥 ${streak()}</b><span>ngày liên tiếp</span></div>
    </div>
  </header>
  <main class="course-list">
    ${COURSES.map(c => {
      const pr = courseProgress(c);
      const quizBest = P.quiz[c.id];
      return `
      <a class="course-card" href="#/course/${c.id}" style="--cc:${c.color}">
        <div class="cc-emoji">${c.emoji}</div>
        <div class="cc-body">
          <div class="cc-meta">${esc(c.level)} · ${esc(c.duration)}</div>
          <h2>${esc(c.title)}</h2>
          <p>${esc(c.subtitle)}</p>
          <div class="bar"><i style="width:${pr.pct}%"></i></div>
          <div class="cc-foot">${pr.done}/${pr.total} bài${quizBest != null ? ` · quiz tốt nhất ${quizBest}%` : ""}</div>
        </div>
      </a>`;
    }).join("")}
  </main>
  <footer class="foot">Nội dung biên soạn theo chương trình tại <b>anthropic.skilljar.com</b> — hoàn thành ở đó để nhận chứng chỉ chính thức.</footer>`;
  document.getElementById("themeBtn").onclick = toggleTheme;
}

// ───────────────────────── Trang khoá học ─────────────────────────
function renderCourse(cid) {
  TTS.stop();
  const c = findCourse(cid); if (!c) return renderHome();
  const pr = courseProgress(c);
  app.innerHTML = `
  <header class="page-head" style="--cc:${c.color}">
    <a class="back" href="#/">← Trang chủ</a>
    <div class="ph-emoji">${c.emoji}</div>
    <h1>${esc(c.title)}</h1>
    <p>${esc(c.subtitle)}</p>
    <div class="bar big"><i style="width:${pr.pct}%"></i></div>
    <div class="ph-meta">${pr.done}/${pr.total} bài · ${esc(c.duration)}</div>
  </header>
  <main class="lesson-list">
    ${c.lessons.map((l, i) => `
      <a class="lesson-item ${P.done[l.id] ? "done" : ""}" href="#/lesson/${c.id}/${i}">
        <span class="li-num">${P.done[l.id] ? "✓" : i + 1}</span>
        <span class="li-body"><b>${esc(l.title)}</b><small>${esc(l.time)} · nghe được 🔊</small></span>
        <span class="li-go">›</span>
      </a>`).join("")}
    <div class="course-actions">
      <a class="btn primary" href="#/quiz/${c.id}">📝 Làm quiz (${c.quiz.length} câu)${P.quiz[c.id] != null ? ` — tốt nhất ${P.quiz[c.id]}%` : ""}</a>
      <a class="btn" href="#/cards/${c.id}">🃏 Ôn flashcard (${c.cards.length} thẻ)</a>
    </div>
  </main>`;
}

// ───────────────────────── Trang bài học ─────────────────────────
function renderLesson(cid, idx) {
  TTS.stop();
  const c = findCourse(cid); if (!c) return renderHome();
  idx = +idx;
  const l = c.lessons[idx]; if (!l) return renderCourse(cid);
  const art = ArtLib[l.art] || "";
  const next = c.lessons[idx + 1];
  app.innerHTML = `
  <header class="page-head slim" style="--cc:${c.color}">
    <a class="back" href="#/course/${c.id}">← ${esc(c.title)}</a>
    <h1>${esc(l.title)}</h1>
    <div class="ph-meta">Bài ${idx + 1}/${c.lessons.length} · ${esc(l.time)}</div>
  </header>
  <div class="audiobar" id="audiobar">
    <button class="play-btn" id="playBtn">▶</button>
    <div class="ab-label" id="abLabel">Nghe bài giảng (giọng tiếng Việt)</div>
    <select id="rateSel" title="Tốc độ đọc">
      <option value="0.85">0.85×</option>
      <option value="1" selected>1×</option>
      <option value="1.25">1.25×</option>
      <option value="1.5">1.5×</option>
    </select>
  </div>
  <main class="lesson">
    <figure class="art">${art}</figure>
    ${l.sections.map(s => `
      <section>
        ${s.h ? `<h2>${esc(s.h)}</h2>` : ""}
        ${(s.p || []).map(p => `<p>${esc(p)}</p>`).join("")}
        ${s.list ? `<ul>${s.list.map(it => `<li>${esc(it)}</li>`).join("")}</ul>` : ""}
      </section>`).join("")}
    <div class="takeaways" style="--cc:${c.color}">
      <h3>🎯 Điểm cần nhớ</h3>
      <ul>${l.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>
    <div class="lesson-actions">
      <button class="btn primary" id="doneBtn">${P.done[l.id] ? "✓ Đã hoàn thành" : "Hoàn thành bài học ✓"}</button>
      ${next ? `<a class="btn" href="#/lesson/${c.id}/${idx + 1}">Bài tiếp theo →</a>`
             : `<a class="btn" href="#/quiz/${c.id}">Làm quiz của khoá →</a>`}
    </div>
  </main>`;

  // Âm thanh đọc bài
  const playBtn = document.getElementById("playBtn");
  const rateSel = document.getElementById("rateSel");
  const supported = "speechSynthesis" in window;
  if (!supported) document.getElementById("abLabel").textContent = "Thiết bị không hỗ trợ đọc giọng nói";
  playBtn.onclick = () => {
    if (!supported) return;
    if (TTS.playing) { TTS.pause(); }
    else if (speechSynthesis.paused && speechSynthesis.speaking) { TTS.resume(); }
    else { TTS.rate = +rateSel.value; TTS.speak(lessonSpeechText(l)); }
    updateAudioBar();
  };
  rateSel.onchange = () => {
    TTS.rate = +rateSel.value;
    if (speechSynthesis.speaking) { TTS.rate = +rateSel.value; TTS.speak(lessonSpeechText(l)); updateAudioBar(); }
  };

  document.getElementById("doneBtn").onclick = () => {
    if (!P.done[l.id]) {
      P.done[l.id] = true; markStudyDay(); saveProgress(P); sfx("done");
    }
    if (next) go(`#/lesson/${c.id}/${idx + 1}`); else go(`#/quiz/${c.id}`);
  };
}
function updateAudioBar() {
  const b = document.getElementById("playBtn");
  const lab = document.getElementById("abLabel");
  if (!b) return;
  b.textContent = TTS.playing ? "⏸" : "▶";
  if (lab) lab.textContent = TTS.playing ? "Đang đọc… (bấm để tạm dừng)" : "Nghe bài giảng (giọng tiếng Việt)";
}

// ───────────────────────── Quiz ─────────────────────────
function renderQuiz(cid) {
  TTS.stop();
  const c = findCourse(cid); if (!c) return renderHome();
  let i = 0, score = 0, answered = false;
  function draw() {
    const q = c.quiz[i];
    app.innerHTML = `
    <header class="page-head slim" style="--cc:${c.color}">
      <a class="back" href="#/course/${c.id}">← ${esc(c.title)}</a>
      <h1>Quiz · câu ${i + 1}/${c.quiz.length}</h1>
      <div class="bar big"><i style="width:${Math.round(i / c.quiz.length * 100)}%"></i></div>
    </header>
    <main class="quiz">
      <p class="q">${esc(q.q)}</p>
      <div class="opts">
        ${q.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}
      </div>
      <div class="expl" id="expl" hidden></div>
      <button class="btn primary" id="nextQ" hidden>Câu tiếp theo →</button>
    </main>`;
    answered = false;
    document.querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => {
        if (answered) return; answered = true;
        const k = +btn.dataset.k;
        const ok = k === q.a;
        if (ok) { score++; sfx("correct"); } else sfx("wrong");
        document.querySelectorAll(".opt").forEach((b, j) => {
          if (j === q.a) b.classList.add("right");
          else if (j === k) b.classList.add("wrong");
          b.disabled = true;
        });
        const e = document.getElementById("expl");
        e.hidden = false;
        e.innerHTML = `<b>${ok ? "✅ Chính xác!" : "❌ Chưa đúng."}</b> ${esc(q.expl)}`;
        const n = document.getElementById("nextQ");
        n.hidden = false;
        n.textContent = i + 1 < c.quiz.length ? "Câu tiếp theo →" : "Xem kết quả →";
        n.onclick = () => { i++; i < c.quiz.length ? draw() : finish(); };
      };
    });
  }
  function finish() {
    const pct = Math.round(score / c.quiz.length * 100);
    if (P.quiz[c.id] == null || pct > P.quiz[c.id]) P.quiz[c.id] = pct;
    markStudyDay(); saveProgress(P); sfx("done");
    const msg = pct >= 80 ? "Xuất sắc! Anh đã nắm vững khoá này. 🎉"
              : pct >= 50 ? "Khá tốt! Ôn lại flashcard rồi thử lại để đạt trên 80%."
              : "Đừng nản — xem lại các bài học rồi quay lại nhé.";
    app.innerHTML = `
    <header class="page-head" style="--cc:${c.color}">
      <a class="back" href="#/course/${c.id}">← ${esc(c.title)}</a>
      <div class="ph-emoji">${pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖"}</div>
      <h1>${score}/${c.quiz.length} câu đúng (${pct}%)</h1>
      <p>${msg}</p>
    </header>
    <main class="course-actions" style="padding:20px">
      <button class="btn primary" id="retry">Làm lại quiz</button>
      <a class="btn" href="#/cards/${c.id}">🃏 Ôn flashcard</a>
      <a class="btn" href="#/">Về trang chủ</a>
    </main>`;
    document.getElementById("retry").onclick = () => { i = 0; score = 0; draw(); };
  }
  draw();
}

// ───────────────────────── Flashcards ─────────────────────────
function renderCards(cid) {
  TTS.stop();
  const c = findCourse(cid); if (!c) return renderHome();
  let i = 0, flipped = false;
  // xáo trộn thẻ để ôn hiệu quả hơn
  const cards = [...c.cards].sort(() => Math.random() - .5);
  function draw() {
    const card = cards[i];
    app.innerHTML = `
    <header class="page-head slim" style="--cc:${c.color}">
      <a class="back" href="#/course/${c.id}">← ${esc(c.title)}</a>
      <h1>Flashcard · ${i + 1}/${cards.length}</h1>
    </header>
    <main class="cards">
      <div class="flashcard ${flipped ? "flipped" : ""}" id="fc">
        <div class="fc-inner">
          <div class="fc-face fc-front"><small>CÂU HỎI · chạm để lật</small><p>${esc(card.front)}</p></div>
          <div class="fc-face fc-back" style="background:${c.color}"><small>TRẢ LỜI</small><p>${esc(card.back)}</p></div>
        </div>
      </div>
      <button class="icon-btn big" id="speakCard" title="Đọc to thẻ này">🔊</button>
      <div class="card-nav">
        <button class="btn" id="prev" ${i === 0 ? "disabled" : ""}>← Trước</button>
        <button class="btn primary" id="next">${i + 1 < cards.length ? "Thẻ sau →" : "Hoàn tất ✓"}</button>
      </div>
    </main>`;
    document.getElementById("fc").onclick = () => { flipped = !flipped; document.getElementById("fc").classList.toggle("flipped"); };
    document.getElementById("speakCard").onclick = e => {
      e.stopPropagation();
      TTS.speak((flipped ? card.back : card.front));
    };
    document.getElementById("prev").onclick = () => { if (i > 0) { i--; flipped = false; draw(); } };
    document.getElementById("next").onclick = () => {
      if (i + 1 < cards.length) { i++; flipped = false; draw(); }
      else { markStudyDay(); saveProgress(P); sfx("done"); go(`#/course/${c.id}`); }
    };
  }
  draw();
}

// ───────────────────────── Giao diện sáng/tối ─────────────────────────
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("ca-theme", dark ? "dark" : "light");
}
if (localStorage.getItem("ca-theme") === "dark") document.documentElement.classList.add("dark");

// ───────────────────────── Router ─────────────────────────
function route() {
  const h = location.hash.slice(2); // bỏ "#/"
  const [page, a, b] = h.split("/");
  window.scrollTo(0, 0);
  if (page === "course" && a) renderCourse(a);
  else if (page === "lesson" && a != null && b != null) renderLesson(a, b);
  else if (page === "quiz" && a) renderQuiz(a);
  else if (page === "cards" && a) renderCards(a);
  else renderHome();
}
window.addEventListener("hashchange", route);
route();

// ───────────────────────── PWA: service worker ─────────────────────────
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
})();
