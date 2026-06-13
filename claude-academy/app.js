// Claude Academy — logic ứng dụng (Claymorphism UI)

(() => {
"use strict";

// ───────────────────────── Người dùng (đăng nhập nhớ email) ─────────────────────────
function loadJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } }
function saveJSON(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

let USERS = loadJSON("ca-users", {});            // email -> { name, created }
let CURRENT = localStorage.getItem("ca-current"); // email đang đăng nhập

function progressKey(email) { return "ca-progress:" + email; }
let P = null;
function loadUserProgress() {
  P = loadJSON(progressKey(CURRENT), null);
  if (!P) {
    // chuyển tiến độ phiên bản cũ (trước khi có đăng nhập) sang tài khoản đầu tiên
    P = loadJSON("ca-progress-v1", null) || {};
    localStorage.removeItem("ca-progress-v1");
  }
  P.done = P.done || {};   // lessonId -> true
  P.quiz = P.quiz || {};   // courseId -> điểm % tốt nhất
  P.days = P.days || [];   // các ngày có học (yyyy-mm-dd)
  P.wrong = P.wrong || {}; // courseId -> [chỉ số câu từng trả lời sai] (cho Ôn tập thông minh)
  saveP();
}
function saveP() { if (CURRENT) saveJSON(progressKey(CURRENT), P); }

function login(name, email) {
  email = email.trim().toLowerCase();
  USERS[email] = { name: name.trim(), created: USERS[email]?.created || Date.now() };
  saveJSON("ca-users", USERS);
  CURRENT = email;
  localStorage.setItem("ca-current", email);
  loadUserProgress();
}
function logout() {
  saveP();
  CURRENT = null;
  localStorage.removeItem("ca-current");
  P = null;
}
function user() { return CURRENT ? { email: CURRENT, ...USERS[CURRENT] } : null; }

// ───────────────────────── Tiến độ & streak ─────────────────────────
// Ngày tính theo GIỜ ĐỊA PHƯƠNG (không dùng UTC) để học sáng sớm không bị ghi nhầm sang hôm trước
function dayKey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function markStudyDay() {
  const d = dayKey();
  if (!P.days.includes(d)) P.days.push(d);
}
function streak() {
  const set = new Set(P.days);
  let n = 0; const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function courseProgress(c) {
  const total = c.lessons.length;
  const done = c.lessons.filter(l => P.done[l.id]).length;
  return { done, total, pct: Math.round(done / total * 100) };
}
function totals() {
  const totalLessons = COURSES.reduce((n, c) => n + c.lessons.length, 0);
  const doneLessons = Object.keys(P.done).length;
  const quizzes = Object.values(P.quiz);
  return {
    totalLessons, doneLessons,
    pct: Math.round(doneLessons / totalLessons * 100),
    quizDone: quizzes.length,
    quizAvg: quizzes.length ? Math.round(quizzes.reduce((a, b) => a + b, 0) / quizzes.length) : 0
  };
}
// Ôn tập thông minh: ghi/xoá câu từng sai; trả lời đúng là thoát khỏi danh sách
function trackAnswer(cid, qi, ok) {
  const wl = P.wrong[cid] = P.wrong[cid] || [];
  if (ok) { const ix = wl.indexOf(qi); if (ix >= 0) wl.splice(ix, 1); }
  else if (!wl.includes(qi)) wl.push(qi);
  saveP();
}
function reviewItems() {
  const items = [];
  for (const c of COURSES) (P.wrong[c.id] || []).forEach(qi => { if (c.quiz[qi]) items.push({ c, qi }); });
  return items;
}
function nextLesson() {
  for (const c of COURSES) {
    const i = c.lessons.findIndex(l => !P.done[l.id]);
    if (i >= 0) return { c, i };
  }
  return null;
}

// ───────────────────────── Âm thanh: TTS + hiệu ứng + confetti ─────────────────────────
// Đọc theo TỪNG CÂU: trên Android Chrome lệnh pause() của TTS thường bị bỏ qua,
// nên tạm dừng = huỷ câu hiện tại và ghi nhớ vị trí; đọc tiếp = phát lại từ câu đó.
const TTS = {
  chunks: [], i: 0, playing: false, rate: 1, gen: 0,
  viVoice() { return speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith("vi")) || null; },
  _speakCurrent() {
    if (this.i >= this.chunks.length) { this.playing = false; this.chunks = []; this.i = 0; updateAudioDock(); MUSIC.onTTS(false); return; }
    const g = ++this.gen;
    const u = new SpeechSynthesisUtterance(this.chunks[this.i]);
    u.lang = "vi-VN"; u.rate = this.rate;
    const v = this.viVoice(); if (v) u.voice = v;
    u.onend = () => { if (g !== this.gen || !this.playing) return; this.i++; this._speakCurrent(); };
    u.onerror = () => { if (g !== this.gen) return; this.playing = false; updateAudioDock(); MUSIC.onTTS(false); };
    try { speechSynthesis.speak(u); }
    catch { this.playing = false; updateAudioDock(); MUSIC.onTTS(false); } // lỗi đọc → không kẹt trạng thái
  },
  speak(text) {
    this.stop();
    MUSIC.onTTS(true); // đang đọc bài → tắt nhạc nền
    this.chunks = (text.match(/[^.!?…]+[.!?…]*/g) || [text]).map(s => s.trim()).filter(Boolean);
    this.i = 0; this.playing = true;
    this._speakCurrent();
  },
  toggle(text) {
    if (this.playing) this.pause();
    else if (this.chunks.length && this.i < this.chunks.length) { MUSIC.onTTS(true); this.playing = true; this._speakCurrent(); }
    else this.speak(text);
  },
  setRate(r) { this.rate = r; if (this.playing) { this.gen++; speechSynthesis.cancel(); this._speakCurrent(); } },
  pause() { this.playing = false; this.gen++; speechSynthesis.cancel(); MUSIC.onTTS(false); },
  stop() { this.playing = false; this.gen++; this.chunks = []; this.i = 0; speechSynthesis.cancel(); MUSIC.onTTS(false); }
};
if ("speechSynthesis" in window) speechSynthesis.getVoices();

// ── Phản hồi xúc giác (rung) + âm thanh chạm — bật/tắt được trong Hồ sơ ──
const FX = {
  sound: loadJSON("ca-fx-sound", true),
  haptic: loadJSON("ca-fx-haptic", true),
  music: loadJSON("ca-fx-music", true)
};
function setFX(key, val) { FX[key] = val; saveJSON("ca-fx-" + key, val); }
function vibrate(pattern) {
  if (!FX.haptic || !navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch { /* thiết bị không hỗ trợ */ }
}

let audioCtx = null;
function ctxReady() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
// Tiếng "tách" nhẹ khi chạm nút / chuyển tab
function tap(kind) {
  if (!FX.sound) return;
  try {
    const ctx = ctxReady();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle";
    const t = ctx.currentTime;
    if (kind === "nav") { o.frequency.setValueAtTime(540, t); o.frequency.exponentialRampToValueAtTime(880, t + .07); }
    else { o.frequency.setValueAtTime(950, t); o.frequency.exponentialRampToValueAtTime(620, t + .05); }
    g.gain.setValueAtTime(.07, t);
    g.gain.exponentialRampToValueAtTime(.001, t + (kind === "nav" ? .09 : .06));
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + .1);
  } catch { /* không có audio cũng không sao */ }
}

function sfx(kind) {
  // rung theo từng loại sự kiện
  if (kind === "correct") vibrate(25);
  else if (kind === "wrong") vibrate([45, 60, 45]);
  else if (kind === "done") vibrate([15, 40, 15, 40, 40]);
  if (!FX.sound) return;
  try {
    ctxReady();
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

// ── Nhạc nền lo-fi không lời, tự sinh bằng WebAudio (không cần file nhạc) ──
// Vòng hợp âm Cmaj7 → Am7 → Fmaj7 → G6 dạng pad êm + nốt gảy pentatonic ngẫu nhiên.
// Tự TẮT khi nghe bài giảng (TTS) hoặc mở video; tự BẬT lại khi đọc xong.
const MUSIC = {
  playing: false, master: null, _gen: 0, _chordT: null, _pluckT: null,
  _ttsHold: false, videoHold: false,
  start() {
    if (!FX.music || this.playing || this._ttsHold || this.videoHold || !CURRENT) return;
    let ctx;
    try { ctx = ctxReady(); } catch { return; }
    if (ctx.state !== "running") return; // cần thao tác chạm trước (chính sách autoplay)
    this.playing = true;
    const gen = ++this._gen;
    const master = ctx.createGain();
    master.gain.setValueAtTime(.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(.05, ctx.currentTime + 2.5);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1100;
    master.connect(lp); lp.connect(ctx.destination);
    this.master = master;
    const chords = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [110.00, 130.81, 164.81, 196.00], // Am7
      [87.31, 110.00, 130.81, 164.81],  // Fmaj7
      [98.00, 123.47, 146.83, 164.81]   // G6
    ];
    let ci = 0;
    const playChord = () => {
      if (gen !== this._gen) return;
      const t = ctx.currentTime, dur = 9;
      chords[ci % chords.length].forEach(f => {
        [0, 3].forEach(det => { // 2 lớp lệch nhẹ cho âm ấm
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "sine"; o.frequency.value = f; o.detune.value = det;
          g.gain.setValueAtTime(.0001, t);
          g.gain.linearRampToValueAtTime(.5, t + 2.2);
          g.gain.setValueAtTime(.5, t + dur - 2.2);
          g.gain.linearRampToValueAtTime(.0001, t + dur);
          o.connect(g); g.connect(master);
          o.start(t); o.stop(t + dur + .1);
        });
      });
      ci++;
      this._chordT = setTimeout(playChord, (dur - 2.2) * 1000); // gối đầu cho liền mạch
    };
    const pluck = () => {
      if (gen !== this._gen) return;
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // pentatonic Đô trưởng
      const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      g.gain.setValueAtTime(.2, t);
      g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 1.2);
      this._pluckT = setTimeout(pluck, 1800 + Math.random() * 2800);
    };
    playChord();
    this._pluckT = setTimeout(pluck, 2200);
  },
  stop() {
    if (!this.playing) return;
    this.playing = false; this._gen++;
    clearTimeout(this._chordT); clearTimeout(this._pluckT);
    const m = this.master; this.master = null;
    if (m && audioCtx) {
      try {
        m.gain.cancelScheduledValues(audioCtx.currentTime);
        m.gain.setValueAtTime(Math.max(m.gain.value, .0001), audioCtx.currentTime);
        m.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .5); // tắt êm
      } catch { /* bỏ qua */ }
      setTimeout(() => { try { m.disconnect(); } catch { /* bỏ qua */ } }, 700);
    }
  },
  // cố gắng phát (gọi sau mỗi lần chạm / sau khi TTS kết thúc)
  autostart() {
    if (!FX.music || this.playing || this._ttsHold || this.videoHold || !CURRENT) return;
    let ctx;
    try { ctx = ctxReady(); } catch { return; }
    if (ctx.state === "running") this.start();
    else if (ctx.resume) ctx.resume().then(() => this.start()).catch(() => {});
  },
  // TTS bắt đầu đọc → tắt nhạc; đọc xong / tạm dừng → bật lại
  onTTS(active) {
    this._ttsHold = active;
    if (active) this.stop(); else this.autostart();
  }
};

function confetti() {
  const colors = ["#7c3aed", "#f06595", "#34c98e", "#f5a623", "#4dabf7"];
  const box = document.createElement("div");
  box.className = "confetti";
  const cx = innerWidth / 2, cy = innerHeight / 2.4;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("i");
    const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 160;
    p.style.left = cx + "px"; p.style.top = cy + "px";
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    p.style.setProperty("--dy", Math.sin(ang) * dist + 70 + "px");
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 1100);
}

// ───────────────────────── Bản quyền ─────────────────────────
const COPYRIGHT = "© 2026 Lê Văn Thảo. Bảo lưu mọi quyền.";
const CONTACT = "heodaigia1983@gmail.com";
const PHONE = "05.666668.47";

// ───────────────────────── Tiện ích ─────────────────────────
const app = document.getElementById("app");
const appbar = document.getElementById("appbar");
const bottomnav = document.getElementById("bottomnav");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
function go(h) { location.hash = h; }
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
function backRow(href, label) {
  return `<div class="back-row pop"><a class="back-btn" style="display:grid;place-items:center" href="${href}">←</a><b>${esc(label)}</b></div>`;
}

// ───────────────────────── Khung: app bar + bottom nav ─────────────────────────
let TAB = null;
function renderChrome(tab) {
  TAB = tab;
  const u = user();
  if (!u) { appbar.hidden = true; bottomnav.hidden = true; return; }
  appbar.hidden = false; bottomnav.hidden = false;
  appbar.innerHTML = `
    <div class="appbar-in">
      <a class="avatar" href="#/profile">${esc((u.name || "?")[0].toUpperCase())}</a>
      <a class="appbar-name" href="#/profile"><small>CLAUDE ACADEMY</small><b>${esc(u.name)}</b></a>
      <button class="music-btn ${FX.music ? "" : "off"}" id="musicBtn" title="Nhạc nền học tập">🎵</button>
      <a class="streak-chip" href="#/streaks">🔥 ${streak()}</a>
    </div>`;
  document.getElementById("musicBtn").onclick = () => {
    setFX("music", !FX.music);
    if (FX.music) MUSIC.autostart(); else MUSIC.stop();
    renderChrome(TAB);
  };
  const tabs = [
    ["#/", "📚", "Học", "home"],
    ["#/explore", "🧭", "Khám phá", "explore"],
    ["#/streaks", "🔥", "Chuỗi", "streaks"],
    ["#/profile", "👤", "Hồ sơ", "profile"]
  ];
  bottomnav.innerHTML = tabs.map(([href, ic, lb, id]) =>
    `<button class="nav-item ${tab === id ? "active" : ""}" data-href="${href}"><span class="ni">${ic}</span>${lb}</button>`).join("");
  bottomnav.querySelectorAll(".nav-item").forEach(b => b.onclick = () => go(b.dataset.href));
}

// ───────────────────────── Đăng nhập ─────────────────────────
function renderLogin() {
  TTS.stop();
  renderChrome(null);
  const known = Object.entries(USERS);
  app.innerHTML = `
  <div class="login-wrap screen">
    <div class="login-card clay shimmer">
      <div class="login-logo">🎓</div>
      <h1>Claude Academy</h1>
      <p>Học nhanh 7 khoá Claude của Anthropic — có âm thanh, minh hoạ, quiz và flashcard. Đăng nhập để app nhớ tiến độ của bạn.</p>
      <div class="field"><label>Tên của bạn</label><input id="inName" placeholder="VD: Lê Văn Thảo" autocomplete="name"></div>
      <div class="field"><label>Email</label><input id="inMail" type="email" placeholder="ten@gmail.com" autocomplete="email" inputmode="email"></div>
      <div class="login-err" id="loginErr"></div>
      <button class="btn btn-primary pressable" id="loginBtn">Bắt đầu học 🚀</button>
      ${known.length ? `
      <div class="known-users">
        <small style="font-size:11px;font-weight:800;color:var(--muted)">— HOẶC HỌC TIẾP VỚI —</small>
        ${known.map(([em, info]) => `
          <button class="known-user pressable" data-em="${esc(em)}">
            <span class="avatar">${esc((info.name || "?")[0].toUpperCase())}</span>
            <span style="text-align:left">${esc(info.name)}<br><small>${esc(em)}</small></span>
          </button>`).join("")}
      </div>` : ""}
      <p class="foot-note" style="padding-top:16px">${COPYRIGHT}<br>Liên hệ: <a href="mailto:${CONTACT}" style="color:var(--violet);font-weight:700">${CONTACT}</a> · ☎ <a href="tel:${PHONE.replace(/\./g, "")}" style="color:var(--violet);font-weight:700">${PHONE}</a></p>
    </div>
  </div>`;
  const err = document.getElementById("loginErr");
  document.getElementById("loginBtn").onclick = () => {
    const name = document.getElementById("inName").value.trim();
    const mail = document.getElementById("inMail").value.trim();
    if (name.length < 2) { err.textContent = "Vui lòng nhập tên của bạn."; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { err.textContent = "Email chưa đúng định dạng (vd: ten@gmail.com)."; return; }
    login(name, mail); sfx("done");
    go("#/"); route();
  };
  app.querySelectorAll(".known-user").forEach(b => b.onclick = () => {
    const em = b.dataset.em;
    login(USERS[em].name, em); sfx("done");
    go("#/"); route();
  });
}

// ───────────────────────── Tab Học (trang chủ) ─────────────────────────
function renderHome() {
  TTS.stop(); renderChrome("home");
  const t = totals();
  const nx = nextLesson();
  const R = 38, CIRC = 2 * Math.PI * R;
  app.innerHTML = `
  <div class="screen">
    <div class="greet pop">
      <h1>Chào ${esc(user().name)} 👋</h1>
      <p>${nx ? "Hôm nay học gì tiếp nhỉ?" : "Bạn đã hoàn thành tất cả bài học — quá đỉnh!"}</p>
    </div>
    <div class="progress-hero clay shimmer pop" style="--d:.05s">
      <div class="ring">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="9"/>
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="url(#gr)" stroke-width="9" stroke-linecap="round"
            stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC * (1 - t.pct / 100)}"/>
          <defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#f06595"/>
          </linearGradient></defs>
        </svg>
        <b>${t.pct}%</b>
      </div>
      <div class="ph-stats">
        <div class="ph-row"><span>Bài đã học</span><b>${t.doneLessons}/${t.totalLessons}</b></div>
        <div class="ph-row"><span>Quiz đã làm</span><b>${t.quizDone}/${COURSES.length}</b></div>
        <div class="ph-row"><span>Chuỗi ngày</span><b>🔥 ${streak()}</b></div>
      </div>
    </div>
    ${nx ? `
    <h2 class="sec-title pop" style="--d:.1s">Học tiếp ngay <small>bài kế tiếp</small></h2>
    <a class="course-card clay shimmer pressable pop" style="--cc:${nx.c.color};--d:.12s" href="#/lesson/${nx.c.id}/${nx.i}">
      <div class="cc-icon">${nx.c.emoji}</div>
      <div class="cc-main">
        <div class="cc-tag">${esc(nx.c.title)}</div>
        <h3>${esc(nx.c.lessons[nx.i].title)}</h3>
        <p>Bài ${nx.i + 1}/${nx.c.lessons.length} · ${esc(nx.c.lessons[nx.i].time)} · nghe được 🔊</p>
      </div>
      <span class="lr-go">›</span>
    </a>` : ""}
    ${reviewItems().length ? `
    <h2 class="sec-title pop" style="--d:.13s">Ôn tập thông minh <small>cá nhân hoá</small></h2>
    <a class="course-card clay shimmer pressable pop" style="--cc:#f5841f;--d:.14s" href="#/review">
      <div class="cc-icon">🧠</div>
      <div class="cc-main">
        <div class="cc-tag">Luyện điểm yếu</div>
        <h3>${reviewItems().length} câu bạn từng trả lời sai</h3>
        <p>Trả lời đúng là câu đó thoát khỏi danh sách — xoá sạch điểm yếu trước khi thi.</p>
      </div>
      <span class="lr-go">›</span>
    </a>` : ""}
    ${trackSection("academy", "📘 Giáo trình chính thức", "Anthropic Academy", .15)}
    ${trackSection("power", "⚡ Giáo trình thực chiến", "Power User", .2)}
    <p class="foot-note">Hoàn thành khoá tương ứng tại anthropic.skilljar.com để nhận chứng chỉ chính thức 🎓<br>${COPYRIGHT}</p>
  </div>`;
}

// Một nhóm giáo trình trên trang chủ (lọc theo track)
function trackSection(track, title, badge, delay) {
  const list = COURSES.filter(c => (c.track || "academy") === track);
  if (!list.length) return "";
  return `
    <h2 class="sec-title pop" style="--d:${delay}s">${title} <small>${list.length} khoá · ${esc(badge)}</small></h2>
    <div class="course-grid">
      ${list.map((c, i) => {
        const pr = courseProgress(c);
        return `
        <a class="course-card clay shimmer pressable pop" style="--cc:${c.color};--d:${delay + .03 + i * .05}s" href="#/course/${c.id}">
          <div class="cc-icon">${c.emoji}</div>
          <div class="cc-main">
            <div class="cc-tag">${esc(c.level)} · ${esc(c.duration)}</div>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.subtitle)}</p>
            <div class="cc-bar"><div class="track"><i style="width:${pr.pct}%"></i></div><small>${pr.done}/${pr.total}</small></div>
          </div>
        </a>`;
      }).join("")}
    </div>`;
}

// ───────────────────────── Tab Khám phá ─────────────────────────
function renderExplore() {
  TTS.stop(); renderChrome("explore");
  app.innerHTML = `
  <div class="screen">
    <div class="greet pop"><h1>Khám phá 🧭</h1><p>Lộ trình, kỳ thi chứng chỉ và tài nguyên chính thức.</p></div>

    <h2 class="sec-title pop" style="--d:.05s">Lộ trình học gợi ý</h2>
    <div class="info-card clay shimmer pop" style="--d:.08s">
      <h3>🚀 7 ngày làm chủ Claude</h3>
      <ol>
        <li><b>Ngày 1–2:</b> Claude 101 + AI Fluency (nền tảng cho mọi người).</li>
        <li><b>Ngày 3:</b> Prompt Engineering — kỹ năng nhân đôi hiệu quả.</li>
        <li><b>Ngày 4–5:</b> Claude Code 101 + Claude Platform 101 (dành cho kỹ thuật).</li>
        <li><b>Ngày 6:</b> MCP — kết nối Claude với thế giới.</li>
        <li><b>Ngày 7:</b> Agent Skills + ôn flashcard toàn bộ, làm lại các quiz dưới 80%.</li>
      </ol>
    </div>

    <h2 class="sec-title pop" style="--d:.12s">Kỳ thi chứng chỉ Claude 🎓</h2>
    <div class="info-card clay shimmer pop" style="--d:.15s">
      <h3>Thi miễn phí — nhận chứng chỉ chính thức của Anthropic</h3>
      <p>Mỗi khoá trên <b>anthropic.skilljar.com</b> có bài kiểm tra cuối khoá. Vượt qua là nhận chứng chỉ (certificate) chia sẻ được lên LinkedIn. Mẹo: học xong một khoá ở đây, đạt quiz ≥ 80% rồi đăng ký thi ngay khi kiến thức còn nóng.</p>
    </div>
    <div class="course-grid" style="margin-top:12px">
      ${COURSES.map((c, i) => {
        const best = P.quiz[c.id];
        const ready = best != null && best >= 80;
        return `
        <div class="cert-row clay pressable pop" style="--d:${.18 + i * .05}s">
          <span class="ce">${c.emoji}</span>
          <span class="cert-main"><b>${esc(c.title)}</b><small>${best != null ? `Quiz tốt nhất: ${best}%` : "Chưa làm quiz"} ${ready ? "· Sẵn sàng thi!" : ""}</small></span>
          <a class="cert-link ${ready ? "done" : ""}" href="${c.examUrl}" target="_blank" rel="noopener">${ready ? "Thi ngay 🎓" : "Trang thi ↗"}</a>
        </div>`;
      }).join("")}
    </div>

    <h2 class="sec-title pop">Tài nguyên chính thức</h2>
    <div class="info-card clay shimmer pop">
      <h3>📚 Học sâu hơn</h3>
      <ul>
        <li><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener"><b>anthropic.skilljar.com</b></a> — Anthropic Academy: toàn bộ khoá học + chứng chỉ.</li>
        <li><a href="https://docs.claude.com" target="_blank" rel="noopener"><b>docs.claude.com</b></a> — tài liệu chính thức về Claude, API, Claude Code.</li>
        <li><a href="https://www.anthropic.com/learn" target="_blank" rel="noopener"><b>anthropic.com/learn</b></a> — trung tâm tài nguyên học tập.</li>
        <li><a href="https://modelcontextprotocol.io" target="_blank" rel="noopener"><b>modelcontextprotocol.io</b></a> — trang chủ chuẩn MCP.</li>
      </ul>
    </div>
  </div>`;
}

// ───────────────────────── Tab Chuỗi (streaks) ─────────────────────────
function renderStreaks() {
  TTS.stop(); renderChrome("streaks");
  const t = totals();
  const st = streak();
  const daySet = new Set(P.days);
  const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  let week = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const lit = daySet.has(dayKey(d));
    week += `<div class="day-dot ${lit ? "lit" : ""}"><i>${lit ? "🔥" : "·"}</i>${labels[d.getDay()]}</div>`;
  }
  const fullCourses = COURSES.filter(c => courseProgress(c).pct === 100).length;
  const badges = [
    ["🌱", "Khởi đầu", t.doneLessons >= 1],
    ["📖", "Bền bỉ", t.doneLessons >= 10],
    ["🔥", "3 ngày liền", st >= 3],
    ["🏅", "Quiz ≥80%", Object.values(P.quiz).some(s => s >= 80)],
    ["🎓", "Xong 1 khoá", fullCourses >= 1],
    ["👑", "Bậc thầy", fullCourses === COURSES.length && Object.values(P.quiz).filter(s => s >= 80).length === COURSES.length]
  ];
  app.innerHTML = `
  <div class="screen">
    <div class="streak-hero clay shimmer pop">
      <span class="flame">🔥</span>
      <h1>${st} ngày liên tiếp</h1>
      <p>${st === 0 ? "Học một bài hôm nay để nhóm lửa nhé!" : st < 3 ? "Giữ lửa mỗi ngày — 15 phút là đủ!" : "Tuyệt vời, đừng để lửa tắt!"}</p>
      <div class="week-row">${week}</div>
    </div>
    <div class="stat-grid">
      <div class="stat-card clay pop" style="--d:.06s"><b>${t.doneLessons}</b><span>bài đã học</span></div>
      <div class="stat-card clay pop" style="--d:.1s"><b>${t.pct}%</b><span>tổng tiến độ</span></div>
      <div class="stat-card clay pop" style="--d:.14s"><b>${t.quizDone}/${COURSES.length}</b><span>quiz đã làm</span></div>
      <div class="stat-card clay pop" style="--d:.18s"><b>${t.quizAvg}%</b><span>điểm quiz trung bình</span></div>
    </div>
    <h2 class="sec-title pop" style="--d:.2s">Huy hiệu</h2>
    <div class="badge-grid">
      ${badges.map(([e, n, ok], i) => `<div class="badge clay pop ${ok ? "" : "locked"}" style="--d:${.22 + i * .04}s"><span class="be">${e}</span><b>${n}</b></div>`).join("")}
    </div>
  </div>`;
}

// ───────────────────────── Tab Hồ sơ ─────────────────────────
function renderProfile() {
  TTS.stop(); renderChrome("profile");
  const u = user();
  const t = totals();
  const since = new Date(u.created).toLocaleDateString("vi-VN");
  app.innerHTML = `
  <div class="screen">
    <div class="profile-head clay shimmer pop">
      <div class="avatar">${esc((u.name || "?")[0].toUpperCase())}</div>
      <h1>${esc(u.name)}</h1>
      <p>${esc(u.email)}</p>
      <p style="margin-top:4px">Học viên từ ${since} · ${t.doneLessons} bài · 🔥 ${streak()} ngày</p>
    </div>
    <h2 class="sec-title pop" style="--d:.06s">Chứng chỉ của bạn</h2>
    <div class="course-grid">
      ${COURSES.map((c, i) => {
        const pr = courseProgress(c);
        const best = P.quiz[c.id];
        const ready = pr.pct === 100 && best != null && best >= 80;
        return `
        <div class="cert-row clay pop" style="--d:${.08 + i * .04}s">
          <span class="ce">${ready ? "🏆" : c.emoji}</span>
          <span class="cert-main"><b>${esc(c.title)}</b><small>${pr.pct}% bài học${best != null ? ` · quiz ${best}%` : ""}</small></span>
          <a class="cert-link ${ready ? "done" : ""}" href="${c.examUrl}" target="_blank" rel="noopener">${ready ? "Thi lấy chứng chỉ" : "Xem khoá ↗"}</a>
        </div>`;
      }).join("")}
    </div>
    <h2 class="sec-title pop">Cài đặt trải nghiệm</h2>
    <div class="action-stack">
      <button class="btn pressable" id="musicTg">${FX.music ? "🎵 Nhạc nền học tập: BẬT" : "🎵 Nhạc nền học tập: TẮT"}</button>
      <button class="btn pressable" id="soundTg">${FX.sound ? "🔊 Âm thanh chạm: BẬT" : "🔇 Âm thanh chạm: TẮT"}</button>
      <button class="btn pressable" id="hapticTg">${FX.haptic ? "📳 Rung phản hồi: BẬT" : "📴 Rung phản hồi: TẮT"}</button>
    </div>
    <p class="foot-note" style="text-align:left;padding:8px 4px 0">🎵 Nhạc lo-fi êm tự sinh trong app, không lời — tự tắt khi nghe bài giảng hoặc xem video, đọc xong tự bật lại. Bật/tắt nhanh bằng nút 🎵 trên thanh trên cùng.</p>
    <div class="action-stack" style="margin-top:12px">
      <button class="btn pressable" id="themeBtn">🌓 Đổi giao diện sáng/tối</button>
      <button class="btn btn-ghost pressable" id="logoutBtn">Đăng xuất</button>
    </div>
    <h2 class="sec-title pop">Về ứng dụng</h2>
    <div class="info-card clay shimmer pop">
      <h3>🎓 Claude Academy</h3>
      <p>Ứng dụng học nhanh các khoá Claude của Anthropic Academy bằng tiếng Việt.</p>
      <p style="margin-top:8px"><b>${COPYRIGHT}</b></p>
      <p>Liên hệ tác giả: <a href="mailto:${CONTACT}" style="color:var(--violet);font-weight:700">${CONTACT}</a></p>
      <p>Điện thoại: <a href="tel:${PHONE.replace(/\./g, "")}" style="color:var(--violet);font-weight:700">☎ ${PHONE}</a></p>
      <p style="margin-top:8px">Nội dung biên soạn theo đề cương khoá học công khai của Anthropic Academy. Claude và Anthropic là thương hiệu của Anthropic PBC.</p>
    </div>
    <p class="foot-note">Tiến độ được lưu theo email trên thiết bị này — lần sau đăng nhập đúng email là học tiếp.</p>
  </div>`;
  document.getElementById("musicTg").onclick = () => {
    setFX("music", !FX.music);
    if (FX.music) MUSIC.autostart(); else MUSIC.stop();
    renderProfile();
  };
  document.getElementById("soundTg").onclick = () => {
    setFX("sound", !FX.sound);
    if (FX.sound) tap("nav"); // nghe thử ngay khi bật
    renderProfile();
  };
  document.getElementById("hapticTg").onclick = () => {
    setFX("haptic", !FX.haptic);
    if (FX.haptic) vibrate([15, 40, 15]); // rung thử ngay khi bật
    renderProfile();
  };
  document.getElementById("themeBtn").onclick = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("ca-theme", dark ? "dark" : "light");
  };
  document.getElementById("logoutBtn").onclick = () => { logout(); renderLogin(); };
}

// ───────────────────────── Trang khoá học ─────────────────────────
function renderCourse(cid) {
  TTS.stop(); renderChrome("home");
  const c = findCourse(cid); if (!c) return renderHome();
  const pr = courseProgress(c);
  const hero = ArtLib[c.lessons[0].art] || "";
  app.innerHTML = `
  <div class="screen" style="--cc:${c.color}">
    ${backRow("#/", "Thư viện khoá học")}
    <div class="course-hero clay shimmer pop">
      <div class="hero-art">${hero}</div>
      <h1>${esc(c.title)}</h1>
      <p>${esc(c.subtitle)}</p>
      <div class="hero-meta">
        <span class="chip vio">${esc(c.level)}</span>
        <span class="chip">${esc(c.duration)}</span>
        <span class="chip">${pr.done}/${pr.total} bài</span>
        ${P.quiz[c.id] != null ? `<span class="chip vio">quiz ${P.quiz[c.id]}%</span>` : ""}
      </div>
      <div class="cc-bar" style="margin-top:14px"><div class="track"><i style="width:${pr.pct}%"></i></div><small>${pr.pct}%</small></div>
    </div>
    <h2 class="sec-title pop" style="--d:.08s">Lộ trình bài học</h2>
    <div class="course-grid" style="grid-template-columns:1fr">
      ${c.lessons.map((l, i) => `
      <a class="lesson-row clay pressable pop ${P.done[l.id] ? "done" : ""}" style="--d:${.1 + i * .05}s" href="#/lesson/${c.id}/${i}">
        <span class="lr-num">${P.done[l.id] ? "✓" : i + 1}</span>
        <span class="lr-main"><b>${esc(l.title)}</b><small>${esc(l.time)} · 🔊 nghe được · ${(l.art2 ? 2 : 1)} minh hoạ</small></span>
        <span class="lr-go">›</span>
      </a>`).join("")}
    </div>
    ${c.videos.length ? `
    <h2 class="sec-title pop">🎬 Video minh hoạ <small>từ Anthropic</small></h2>
    ${c.videos.map(v => `
    <div class="video-card clay shimmer pressable pop" data-vid="${v.id}" role="button" tabindex="0">
      <div class="video-thumb">
        <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${esc(v.title)}" loading="lazy">
        <span class="video-play">▶</span>
      </div>
      <div class="video-meta"><b>${esc(v.title)}</b><small>${esc(v.by)} · tiếng Anh — bật được phụ đề tiếng Việt</small></div>
    </div>`).join("")}
    <p class="foot-note" style="padding:8px 4px 14px;text-align:left">💡 Phụ đề tiếng Việt: trong video bấm ⚙️ → Phụ đề (Subtitles) → Tự động dịch (Auto-translate) → Tiếng Việt. Cần có mạng để xem.</p>` : ""}
    <div class="action-stack">
      <button class="btn btn-primary pressable" id="quizBtn">📝 Làm quiz (${c.quiz.length} câu)</button>
      <button class="btn pressable" id="cardBtn">🃏 Ôn flashcard (${c.cards.length} thẻ)</button>
    </div>
    <div class="exam-cta clay shimmer pop" style="--d:.2s">
      <h3>🎓 Mục tiêu: chứng chỉ chính thức</h3>
      <p>Học hết bài + quiz đạt 80% là bạn đủ sức vượt kỳ kiểm tra của khoá này trên Anthropic Academy.</p>
      <a class="cert-link" href="${c.examUrl}" target="_blank" rel="noopener">Trang đăng ký thi ↗</a>
    </div>
  </div>`;
  document.getElementById("quizBtn").onclick = () => go(`#/quiz/${c.id}`);
  document.getElementById("cardBtn").onclick = () => go(`#/cards/${c.id}`);
  // Nhúng YouTube khi người dùng bấm vào ảnh xem trước (giữ trang nhẹ, không tải sẵn player).
  // Tham số cc_lang_pref=vi ưu tiên phụ đề tiếng Việt nếu video có; hl=vi để giao diện player tiếng Việt.
  app.querySelectorAll(".video-card").forEach(card => {
    card.onclick = () => {
      if (card.dataset.loaded) return;
      card.dataset.loaded = "1";
      MUSIC.videoHold = true; MUSIC.stop(); // xem video → tắt nhạc nền
      TTS.stop();
      const id = card.dataset.vid;
      card.querySelector(".video-thumb").innerHTML =
        `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=vi&hl=vi"
          title="Video bài giảng" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>`;
    };
  });
}

// ───────────────────────── Bài học ─────────────────────────
function renderLesson(cid, idx) {
  TTS.stop(); renderChrome("home");
  const c = findCourse(cid); if (!c) return renderHome();
  idx = +idx;
  const l = c.lessons[idx]; if (!l) return renderCourse(cid);
  const next = c.lessons[idx + 1];
  const mid = Math.ceil(l.sections.length / 2);
  const sectionsHtml = l.sections.map((s, si) => `
    ${si === mid && l.art2 && ArtLib[l.art2] ? `<figure class="lesson-art clay pop">${ArtLib[l.art2]}</figure>` : ""}
    <section>
      ${s.h ? `<h2>${esc(s.h)}</h2>` : ""}
      ${(s.p || []).map(p => `<p>${esc(p)}</p>`).join("")}
      ${s.list ? `<ul>${s.list.map(it => `<li>${esc(it)}</li>`).join("")}</ul>` : ""}
    </section>`).join("");
  app.innerHTML = `
  <div class="screen" style="--cc:${c.color}">
    ${backRow(`#/course/${c.id}`, `${c.title} · Bài ${idx + 1}/${c.lessons.length}`)}
    <div class="audio-dock clay pop">
      <button class="play-orb" id="playBtn">▶</button>
      <div class="ad-label" id="adLabel">Nghe bài giảng — giọng tiếng Việt</div>
      <select class="rate-sel" id="rateSel">
        <option value="0.85">0.85×</option><option value="1" selected>1×</option>
        <option value="1.25">1.25×</option><option value="1.5">1.5×</option>
      </select>
    </div>
    <h1 class="pop" style="font-size:22px;font-weight:800;margin:0 2px 14px">${esc(l.title)}</h1>
    <figure class="lesson-art clay shimmer pop" style="--d:.05s">${ArtLib[l.art] || ""}</figure>
    <div class="lesson-body pop" style="--d:.1s">${sectionsHtml}</div>
    <div class="takeaway-card clay shimmer">
      <h3>🎯 Điểm cần nhớ</h3>
      <ul>${l.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary pressable" id="doneBtn">${P.done[l.id] ? "✓ Đã hoàn thành" : "Hoàn thành bài học ✓"}</button>
      <button class="btn pressable" id="nextBtn">${next ? "Bài tiếp theo →" : "Làm quiz của khoá →"}</button>
    </div>
  </div>`;

  const playBtn = document.getElementById("playBtn");
  const supported = "speechSynthesis" in window;
  if (!supported) document.getElementById("adLabel").textContent = "Thiết bị không hỗ trợ đọc giọng nói";
  playBtn.onclick = () => {
    if (!supported) return;
    TTS.rate = +document.getElementById("rateSel").value;
    TTS.toggle(lessonSpeechText(l)); // đọc / tạm dừng / đọc tiếp từ đúng câu đang dở
    updateAudioDock();
  };
  document.getElementById("rateSel").onchange = e => TTS.setRate(+e.target.value);
  const advance = () => { if (next) go(`#/lesson/${c.id}/${idx + 1}`); else go(`#/quiz/${c.id}`); };
  document.getElementById("doneBtn").onclick = () => {
    if (!P.done[l.id]) {
      P.done[l.id] = true; markStudyDay(); saveP();
      sfx("done"); confetti();
      setTimeout(advance, 650);
    } else advance();
  };
  document.getElementById("nextBtn").onclick = advance;
}
function updateAudioDock() {
  const b = document.getElementById("playBtn");
  const lab = document.getElementById("adLabel");
  if (!b) return;
  b.textContent = TTS.playing ? "⏸" : "▶";
  b.classList.toggle("playing", TTS.playing);
  const paused = !TTS.playing && TTS.chunks.length && TTS.i < TTS.chunks.length;
  if (lab) lab.textContent = TTS.playing ? "Đang đọc… chạm để tạm dừng" : paused ? "Đang tạm dừng — chạm để đọc tiếp" : "Nghe bài giảng — giọng tiếng Việt";
}

// ───────────────────────── Quiz ─────────────────────────
function renderQuiz(cid) {
  TTS.stop(); renderChrome("home");
  const c = findCourse(cid); if (!c) return renderHome();
  let i = 0, score = 0, answered = false;
  function draw() {
    const q = c.quiz[i];
    // xáo trộn thứ tự đáp án mỗi lần hiển thị — tránh học thuộc vị trí thay vì kiến thức
    const order = q.options.map((_, k) => k).sort(() => Math.random() - .5);
    app.innerHTML = `
    <div class="screen" style="--cc:${c.color}">
      ${backRow(`#/course/${c.id}`, `Quiz · ${esc(c.title)}`)}
      <div class="cc-bar pop"><div class="track"><i style="width:${Math.round(i / c.quiz.length * 100)}%"></i></div><small>câu ${i + 1}/${c.quiz.length}</small></div>
      <p class="quiz-q pop" style="--d:.04s">${esc(q.q)}</p>
      <div class="opt-stack">
        ${order.map((o, k) => `<button class="opt-btn clay pressable pop" style="--d:${.07 + k * .05}s" data-k="${o}">${esc(q.options[o])}</button>`).join("")}
      </div>
      <div id="explBox"></div>
    </div>`;
    answered = false;
    app.querySelectorAll(".opt-btn").forEach(btn => {
      btn.onclick = () => {
        if (answered) return; answered = true;
        const k = +btn.dataset.k;
        const ok = k === q.a;
        trackAnswer(c.id, i, ok);
        if (ok) { score++; sfx("correct"); } else sfx("wrong");
        app.querySelectorAll(".opt-btn").forEach(b => {
          const j = +b.dataset.k;
          if (j === q.a) b.classList.add("right");
          else if (j === k) b.classList.add("wrong");
          b.disabled = true;
        });
        document.getElementById("explBox").innerHTML = `
          <div class="expl-card clay pop"><b>${ok ? "✅ Chính xác!" : "❌ Chưa đúng."}</b> ${esc(q.expl)}</div>
          <button class="btn btn-primary pressable pop" id="nextQ">${i + 1 < c.quiz.length ? "Câu tiếp theo →" : "Xem kết quả 🎉"}</button>`;
        document.getElementById("nextQ").onclick = () => { i++; i < c.quiz.length ? draw() : finish(); };
      };
    });
  }
  function finish() {
    const pct = Math.round(score / c.quiz.length * 100);
    if (P.quiz[c.id] == null || pct > P.quiz[c.id]) P.quiz[c.id] = pct;
    markStudyDay(); saveP(); sfx("done");
    const passed = pct >= 80;
    if (passed) confetti();
    app.innerHTML = `
    <div class="screen" style="--cc:${c.color}">
      ${backRow(`#/course/${c.id}`, esc(c.title))}
      <div class="result-hero clay shimmer pop">
        <span class="big-emoji">${passed ? "🏆" : pct >= 50 ? "💪" : "📖"}</span>
        <h1>${score}/${c.quiz.length} câu đúng — ${pct}%</h1>
        <p>${passed ? "Xuất sắc! Bạn đã sẵn sàng cho kỳ thi chính thức." : pct >= 50 ? "Khá tốt! Ôn flashcard rồi làm lại để đạt trên 80%." : "Đừng nản — xem lại bài học rồi quay lại nhé."}</p>
      </div>
      ${passed ? `
      <div class="exam-cta clay shimmer pop" style="--d:.1s">
        <h3>🎓 Đăng ký thi chứng chỉ Claude ngay!</h3>
        <p>Kiến thức đang nóng hổi — vào Anthropic Academy hoàn thành khoá «${esc(c.title)}» và làm bài kiểm tra để nhận chứng chỉ chính thức (miễn phí, khoe được lên LinkedIn).</p>
        <a class="cert-link done" href="${c.examUrl}" target="_blank" rel="noopener">Đến trang thi chính thức ↗</a>
      </div>` : ""}
      <div class="action-stack" style="margin-top:14px">
        <button class="btn ${passed ? "" : "btn-primary"} pressable" id="retryBtn">Làm lại quiz</button>
        <button class="btn pressable" id="cardsBtn">🃏 Ôn flashcard</button>
      </div>
    </div>`;
    document.getElementById("retryBtn").onclick = () => { i = 0; score = 0; draw(); };
    document.getElementById("cardsBtn").onclick = () => go(`#/cards/${c.id}`);
  }
  draw();
}

// ───────────────────────── Ôn tập thông minh (câu từng sai) ─────────────────────────
function renderReview() {
  TTS.stop(); renderChrome("home");
  const items = reviewItems().sort(() => Math.random() - .5);
  if (!items.length) {
    app.innerHTML = `
    <div class="screen">
      ${backRow("#/", "Trang chủ")}
      <div class="result-hero clay shimmer pop">
        <span class="big-emoji">🏆</span>
        <h1>Không còn câu nào sai!</h1>
        <p>Bạn đã xoá sạch điểm yếu. Làm thêm quiz các khoá để tiếp tục luyện, hoặc đi thi chứng chỉ thôi!</p>
      </div>
      <div class="action-stack" style="margin-top:14px">
        <a class="btn btn-primary pressable" href="#/">Về trang chủ</a>
        <a class="btn pressable" href="#/explore">🎓 Trang thi chứng chỉ</a>
      </div>
    </div>`;
    return;
  }
  let i = 0, score = 0, answered = false;
  function draw() {
    const { c, qi } = items[i];
    const q = c.quiz[qi];
    const order = q.options.map((_, k) => k).sort(() => Math.random() - .5);
    app.innerHTML = `
    <div class="screen" style="--cc:${c.color}">
      ${backRow("#/", "Ôn tập thông minh")}
      <div class="cc-bar pop"><div class="track"><i style="width:${Math.round(i / items.length * 100)}%"></i></div><small>câu ${i + 1}/${items.length}</small></div>
      <div class="hero-meta pop" style="justify-content:flex-start;margin-top:10px"><span class="chip vio">${c.emoji} ${esc(c.title)}</span></div>
      <p class="quiz-q pop" style="--d:.04s">${esc(q.q)}</p>
      <div class="opt-stack">
        ${order.map((o, k) => `<button class="opt-btn clay pressable pop" style="--d:${.07 + k * .05}s" data-k="${o}">${esc(q.options[o])}</button>`).join("")}
      </div>
      <div id="explBox"></div>
    </div>`;
    answered = false;
    app.querySelectorAll(".opt-btn").forEach(btn => {
      btn.onclick = () => {
        if (answered) return; answered = true;
        const k = +btn.dataset.k;
        const ok = k === q.a;
        trackAnswer(c.id, qi, ok); // đúng → câu này thoát khỏi danh sách ôn
        if (ok) { score++; sfx("correct"); } else sfx("wrong");
        app.querySelectorAll(".opt-btn").forEach(b => {
          const j = +b.dataset.k;
          if (j === q.a) b.classList.add("right");
          else if (j === k) b.classList.add("wrong");
          b.disabled = true;
        });
        document.getElementById("explBox").innerHTML = `
          <div class="expl-card clay pop"><b>${ok ? "✅ Chính xác — câu này rời khỏi danh sách ôn!" : "❌ Chưa đúng — câu này sẽ quay lại lần sau."}</b> ${esc(q.expl)}</div>
          <button class="btn btn-primary pressable pop" id="nextQ">${i + 1 < items.length ? "Câu tiếp theo →" : "Xem kết quả 🎉"}</button>`;
        document.getElementById("nextQ").onclick = () => { i++; i < items.length ? draw() : finish(); };
      };
    });
  }
  function finish() {
    markStudyDay(); saveP(); sfx("done");
    const left = reviewItems().length;
    if (!left) confetti();
    app.innerHTML = `
    <div class="screen">
      ${backRow("#/", "Trang chủ")}
      <div class="result-hero clay shimmer pop">
        <span class="big-emoji">${left ? "💪" : "🏆"}</span>
        <h1>Đúng ${score}/${items.length} câu</h1>
        <p>${left ? `Còn ${left} câu cần luyện tiếp — mỗi vòng sẽ ngắn dần cho đến khi sạch điểm yếu.` : "Sạch điểm yếu! Bạn đã sẵn sàng cho kỳ thi chứng chỉ. 🎉"}</p>
      </div>
      <div class="action-stack" style="margin-top:14px">
        ${left ? `<button class="btn btn-primary pressable" id="againBtn">Luyện vòng nữa (${left} câu)</button>` : `<a class="btn btn-primary pressable" href="#/explore">🎓 Đến trang thi chứng chỉ</a>`}
        <a class="btn pressable" href="#/">Về trang chủ</a>
      </div>
    </div>`;
    const ab = document.getElementById("againBtn");
    if (ab) ab.onclick = () => renderReview();
  }
  draw();
}

// ───────────────────────── Flashcards ─────────────────────────
function renderCards(cid) {
  TTS.stop(); renderChrome("home");
  const c = findCourse(cid); if (!c) return renderHome();
  let i = 0, flipped = false;
  const cards = [...c.cards].sort(() => Math.random() - .5);
  function draw() {
    const card = cards[i];
    app.innerHTML = `
    <div class="screen" style="--cc:${c.color}">
      ${backRow(`#/course/${c.id}`, `Flashcard · ${i + 1}/${cards.length}`)}
      <div class="cc-bar pop"><div class="track"><i style="width:${Math.round((i + 1) / cards.length * 100)}%"></i></div><small>${i + 1}/${cards.length}</small></div>
      <div class="fc-stage pop ${flipped ? "flipped" : ""}" id="fc" style="--d:.05s">
        <div class="fc-inner">
          <div class="fc-face"><small>CÂU HỎI · CHẠM ĐỂ LẬT</small><p>${esc(card.front)}</p></div>
          <div class="fc-face back"><small>TRẢ LỜI</small><p>${esc(card.back)}</p></div>
        </div>
      </div>
      <button class="btn btn-ghost pressable" style="margin-top:14px" id="againBtn">🔁 Chưa thuộc — cho ôn lại ở cuối bộ</button>
      <div class="fc-nav">
        <button class="btn pressable" style="padding:13px" id="speakBtn">🔊</button>
        <button class="btn pressable" id="prevBtn" ${i === 0 ? "disabled" : ""}>← Trước</button>
        <button class="btn btn-primary pressable" id="nextBtn">${i + 1 < cards.length ? "Thẻ sau →" : "Hoàn tất ✓"}</button>
      </div>
    </div>`;
    const advance = () => {
      if (i + 1 < cards.length) { i++; flipped = false; draw(); }
      else { markStudyDay(); saveP(); sfx("done"); confetti(); setTimeout(() => go(`#/course/${c.id}`), 650); }
    };
    document.getElementById("fc").onclick = () => { flipped = !flipped; document.getElementById("fc").classList.toggle("flipped"); };
    document.getElementById("speakBtn").onclick = () => TTS.speak(flipped ? card.back : card.front);
    document.getElementById("prevBtn").onclick = () => { if (i > 0) { i--; flipped = false; draw(); } };
    document.getElementById("againBtn").onclick = () => { cards.push(card); advance(); };
    document.getElementById("nextBtn").onclick = advance;
  }
  draw();
}

// ───────────────────────── Giao diện sáng/tối ─────────────────────────
if (localStorage.getItem("ca-theme") === "dark") document.documentElement.classList.add("dark");

// ───────────────────────── Router ─────────────────────────
function route() {
  window.scrollTo(0, 0);
  MUSIC.videoHold = false; // rời trang có video → cho phép nhạc nền trở lại
  if (!CURRENT || !USERS[CURRENT]) return renderLogin();
  if (!P) loadUserProgress();
  const h = location.hash.slice(2);
  const [page, a, b] = h.split("/");
  if (page === "course" && a) renderCourse(a);
  else if (page === "lesson" && a != null && b != null) renderLesson(a, b);
  else if (page === "quiz" && a) renderQuiz(a);
  else if (page === "cards" && a) renderCards(a);
  else if (page === "review") renderReview();
  else if (page === "explore") renderExplore();
  else if (page === "streaks") renderStreaks();
  else if (page === "profile") renderProfile();
  else renderHome();
}
window.addEventListener("hashchange", route);
route();

// ───────────────────────── Phản hồi chạm toàn cục ─────────────────────────
// Mọi nút, link, menu khi chạm đều rung nhẹ + tiếng "tách" tức thì.
document.addEventListener("pointerdown", e => {
  const el = e.target.closest("button, a, select, .pressable, .fc-stage");
  if (el && !el.disabled) {
    const isNav = el.classList.contains("nav-item");
    vibrate(isNav ? 12 : 8);
    tap(isNav ? "nav" : "tap");
  }
  // nhạc nền chỉ được phép phát sau thao tác chạm đầu tiên (chính sách autoplay của trình duyệt)
  MUSIC.autostart();
}, { passive: true });

// trạng thái chỉ-đọc phục vụ kiểm thử tự động
window.__ca = { get music() { return { playing: MUSIC.playing, enabled: FX.music, ttsHold: MUSIC._ttsHold, videoHold: MUSIC.videoHold }; } };

// ───────────────────────── PWA: service worker ─────────────────────────
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
})();
