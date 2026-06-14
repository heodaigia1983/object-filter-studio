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
  P.mock = P.mock || {};   // scope -> điểm % thi thử tốt nhất
  P.notes = P.notes || {}; // lessonId -> ghi chú cá nhân
  P.activity = P.activity || {}; // yyyy-mm-dd -> số hoạt động (bài/quiz) trong ngày
  P.srs = P.srs || {}; // "courseId:idx" -> { ease, interval, due, reps } cho ôn tập ngắt quãng
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
function bumpActivity() { // đếm hoạt động trong ngày cho đồ thị tiến độ
  const d = dayKey();
  P.activity[d] = (P.activity[d] || 0) + 1;
}
// chuẩn hoá chuỗi: bỏ dấu tiếng Việt + chữ thường (cho tìm kiếm không dấu)
function normalize(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u0111/g, "d");
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
  // Một nốt PIANO: cộng nhiều hài âm + bao âm đánh-rồi-tắt dần như dây đàn thật
  _note(ctx, dest, freq, t, dur, vel) {
    const partials = [[1, 1.0, 1.0], [2, 0.5, 0.7], [3, 0.28, 0.5], [4, 0.14, 0.4], [5, 0.07, 0.3]];
    for (const [mult, g, decay] of partials) {
      const o = ctx.createOscillator(), gain = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq * mult;
      const peak = g * vel, end = t + dur * decay;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(peak, t + 0.006);          // gõ phím: lên rất nhanh
      gain.gain.exponentialRampToValueAtTime(0.0001, end);          // ngân tắt dần
      o.connect(gain); gain.connect(dest);
      o.start(t); o.stop(end + 0.05);
    }
  },
  start() {
    if (!FX.music || this.playing || this._ttsHold || this.videoHold || !CURRENT) return;
    let ctx;
    try { ctx = ctxReady(); } catch { return; }
    if (ctx.state !== "running") return; // cần thao tác chạm trước (chính sách autoplay)
    this.playing = true;
    const gen = ++this._gen;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 2.5); // vào nhẹ nhàng
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 2600; // bớt chói, ấm như piano thu trong phòng
    // tiếng vang nhẹ tạo không gian
    const delay = ctx.createDelay(); delay.delayTime.value = 0.36;
    const fb = ctx.createGain(); fb.gain.value = 0.26;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
    this.master = master;
    // Cao độ các nốt (Hz)
    const N = { C2:65.41,G2:98.00,A2:110.00,F2:87.31,
      C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196.00,A3:220.00,B3:246.94,
      C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,B4:493.88,
      C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880.00 };
    // Vòng hợp âm du dương C–G–Am–F (8 ô nhịp), mỗi ô: [bass, các nốt hợp âm]
    const chords = [
      [N.C2,[N.C3,N.E3,N.G3]], [N.G2,[N.D3,N.G3,N.B3]], [N.A2,[N.C3,N.E3,N.A3]], [N.F2,[N.C3,N.F3,N.A3]],
      [N.C2,[N.C3,N.E3,N.G3]], [N.G2,[N.D3,N.G3,N.B3]], [N.A2,[N.C3,N.E3,N.A3]], [N.F2,[N.C3,N.F3,N.A3]]
    ];
    // Giai điệu gốc tự soạn (không vướng bản quyền). Mỗi nốt: [cao độ, số phách]
    const melody = [
      [[N.E4,1],[N.G4,1],[N.C5,1.5],[N.B4,.5]],
      [[N.D5,1],[N.B4,1],[N.G4,2]],
      [[N.C5,1],[N.E5,1],[N.D5,1.5],[N.C5,.5]],
      [[N.A4,1],[N.C5,1],[N.F4,2]],
      [[N.G4,1],[N.E4,1],[N.G4,1],[N.A4,1]],
      [[N.B4,2],[N.D5,2]],
      [[N.E5,1.5],[N.D5,.5],[N.C5,1],[N.A4,1]],
      [[N.F4,1],[N.A4,1],[N.C5,3]]
    ];
    const BEAT = 0.82, BAR = BEAT * 4; // ~73 nhịp/phút, êm dịu
    let bi = 0;
    const playBar = () => {
      if (gen !== this._gen) return;
      const t = ctx.currentTime + 0.05;
      const [bass, tones] = chords[bi % chords.length];
      this._note(ctx, master, bass, t, BAR * 0.96, 0.16);                                  // bass giữ nhịp
      tones.forEach((f, k) => this._note(ctx, master, f, t + k * 0.13, BAR * 0.9, 0.07));   // đệm hợp âm nhẹ
      let beat = 0;                                                                         // GIAI ĐIỆU nổi lên trên
      for (const [f, dur] of melody[bi % melody.length]) {
        this._note(ctx, master, f, t + beat * BEAT, dur * BEAT * 0.95, 0.17);
        beat += dur;
      }
      bi++;
      this._chordT = setTimeout(playBar, BAR * 1000);
    };
    playBar();
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
        m.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .6); // tắt êm
      } catch { /* bỏ qua */ }
      setTimeout(() => { try { m.disconnect(); } catch { /* bỏ qua */ } }, 800);
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
  const colors = ["#d9734e", "#e08a63", "#4f9d77", "#d8943a", "#c96440"];
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
const APP_VERSION = "2.9.0"; // hiện trong Hồ sơ; đổi mỗi lần phát hành để app báo cập nhật

// Tài nguyên của tác giả (playlist video + thư mục tài liệu Drive)
const AUTHOR_PLAYLIST = "PLZDO3QBqL6cKq07P5sVfay2Ih6GXslCDb";
const AUTHOR_DRIVE = "https://drive.google.com/drive/folders/14skzT5zgxc7UqC9VPGo0q2EzHv0OVvYa";
// 30 video của tác giả, phân nhóm theo chủ đề khớp từng khoá học (gắn từ ảnh playlist)
const AUTHOR_VIDEOS = [
  { group: "Nhập môn & lộ trình", course: "claude-101", items: [
    ["Cuộc trò chuyện đầu tiên — Công thức Bối cảnh", "6:15"], ["Chat, Cowork hay Code", "6:00"],
    ["Tự học với Claude", "8:47"], ["Lộ trình 30 ngày biến Claude thành đồng nghiệp", "5:29"] ] },
  { group: "Tư duy cộng tác — Khung 4D", course: "ai-fluency", items: [
    ["Hiểu Cỗ Máy & Khung 4D", "6:06"], ["Khung 4D: Hợp tác với AI — Giao việc (Delegation)", "6:23"],
    ["Pre Session 2: Vòng lặp D–D — Phản định (Discernment)", "7:33"] ] },
  { group: "Viết & Prompt", course: "tc-writing", items: [
    ["Email Tiếng Việt — Viết Đúng Tông Giọng", "6:16"], ["Thương hiệu từ Zero & Audit", "5:17"] ] },
  { group: "Văn phòng AI: Excel, Tài liệu, Artifacts", course: "tc-office", items: [
    ["Excel Không Kỹ Thuật", "5:36"], ["Đọc tài liệu trong 15 phút", "7:31"], ["Explainer Video", "7:05"],
    ["Artifacts — 4 Loại cho 80% Nhu Cầu", "6:24"], ["Projects & Artifacts", "6:32"], ["Trước buổi 3: Bàn làm việc Claude — Artifacts", "4:55"] ] },
  { group: "Claude Cowork", course: "tc-cowork", items: [
    ["Cowork là gì", "8:16"], ["Cowork: Giao việc", "4:44"], ["Làm chủ Claude Cowork 1", "4:17"],
    ["Làm chủ Claude Cowork", "5:58"], ["Làm chủ Claude Cowork — Tập 3", "6:49"], ["Vòng Lặp Nhiệm Vụ Cowork", "4:18"] ] },
  { group: "Projects", course: "claude-101", items: [
    ["Chuyên gia Claude Projects", "4:15"], ["Khi nào nên tách một Project?", "4:15"] ] },
  { group: "Skills, Connectors & Research", course: "tc-extend", items: [
    ["Kỹ năng Đóng gói Quy trình", "6:08"], ["Skill Builder Masterclass", "4:54"], ["Skills & Research", "5:24"],
    ["Chế độ Research — Đào sâu", "4:35"], ["Từ Họp Hành đến Hành Động — Connectors", "6:43"] ] },
  { group: "Sự nghiệp & ứng dụng nâng cao", course: "tc-career", items: [
    ["AI + Sự nghiệp: Vượt xa CV", "4:57"], ["AI Agentic 2026", "5:20"], ["Trò chuyện Claude chuyên nghiệp", "6:17"] ] }
];
// Tài liệu PDF trong thư mục Drive, phân nhóm theo chủ đề khớp từng khoá (đọc từ ảnh thư mục)
const AUTHOR_DOCS = [
  { group: "Nền tảng & Tư duy AI (Khung 4D)", course: "ai-fluency", items: [
    "The_Claude_Blueprint.pdf", "Decoding_AI.pdf", "Claude_Fluency_Roadmap.pdf", "The_4D_AI_Blueprint.pdf",
    "4D_AI_Fluency_Blueprint.pdf", "AI_Fluency_4D.pdf", "Strategic_AI_Fluency.pdf", "Nonprofit_AI_Fluency.pdf" ] },
  { group: "Prompt & Giao việc", course: "tc-writing", items: [
    "Prompting_Mastery.pdf", "From_Chat_to_Delegation.pdf" ] },
  { group: "Claude Code & Engineering", course: "claude-code", items: [
    "Mastering_Claude_Code.pdf", "Claude_Engineering_Blueprint.pdf" ] },
  { group: "MCP & Subagents", course: "mcp", items: [
    "MCP_The_AI_USB-C.pdf", "Advanced_MCP_Architecture.pdf", "Subagent_Architecture.pdf" ] },
  { group: "Skills", course: "agent-skills", items: [
    "Mastering_Agent_Skills.pdf", "Claude_Skills_Blueprint.pdf", "Modular_Skills_and_Research.pdf" ] },
  { group: "Cowork & Tự động hoá", course: "tc-cowork", items: [
    "Mastering_Claude_Cowork.pdf", "Architecting_AI_Workspaces.pdf", "AI_Automation_Mastery.pdf" ] },
  { group: "Thiết kế với Claude", course: "tc-office", items: [
    "Claude_Design_Mastery.pdf" ] },
  { group: "Agentic & nâng cao", course: "tc-career", items: [
    "Mastering_Agentic_AI.pdf" ] }
];

// ── Cài đặt PWA (thêm vào màn hình chính) ──
let deferredPrompt = null; // sự kiện cài đặt do trình duyệt cung cấp (Android/desktop)
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function platformGuess() {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); deferredPrompt = e;
  const b = document.getElementById("installBar"); if (b) b.hidden = false;
});
window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  localStorage.setItem("ca-installed", "1");
  const b = document.getElementById("installBar"); if (b) b.hidden = true;
});

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
      <a class="music-btn" href="#/search" title="Tìm kiếm" aria-label="Tìm kiếm">🔍</a>
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
    ${installHintHTML()}
    <div class="progress-hero clay shimmer pop" style="--d:.05s">
      <div class="ring">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="var(--surface-2)" stroke-width="9"/>
          <circle cx="44" cy="44" r="${R}" fill="none" stroke="url(#gr)" stroke-width="9" stroke-linecap="round"
            stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC * (1 - t.pct / 100)}"/>
          <defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#d9734e"/><stop offset="1" stop-color="#e08a63"/>
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
    ${(() => { const due = srsDue().length; return due ? `
    <h2 class="sec-title pop" style="--d:.115s">Ôn tập ngắt quãng <small>nhớ lâu</small></h2>
    <a class="course-card clay shimmer pressable pop" style="--cc:#0d9488;--d:.12s" href="#/srs">
      <div class="cc-icon">🔁</div>
      <div class="cc-main">
        <div class="cc-tag">Spaced repetition</div>
        <h3>${due} thẻ đến hạn ôn hôm nay</h3>
        <p>Ôn đúng lúc sắp quên — cách khoa học nhất để nhớ lâu cho kỳ thi.</p>
      </div>
      <span class="lr-go">›</span>
    </a>` : ""; })()}
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
  const ih = document.getElementById("installHint");
  if (ih) {
    ih.querySelector("[data-act=open]").onclick = () => go("#/install");
    ih.querySelector("[data-act=dismiss]").onclick = () => { localStorage.setItem("ca-install-hidden", "1"); ih.remove(); };
  }
}

// Banner gợi ý cài app lên màn hình chính (ẩn nếu đã cài hoặc đã tắt)
function installHintHTML() {
  if (isStandalone() || localStorage.getItem("ca-installed") === "1" || localStorage.getItem("ca-install-hidden") === "1") return "";
  return `
    <div class="install-hint clay pop" id="installHint" style="--d:.04s">
      <span class="ih-ico">📲</span>
      <div class="ih-body"><b>Cài Claude Academy lên máy</b><small>Mở toàn màn hình như app thật, học cả khi offline.</small></div>
      <button class="ih-btn" data-act="open">Cài đặt</button>
      <button class="ih-x" data-act="dismiss" aria-label="Đóng">✕</button>
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
    <div class="greet pop"><h1>Khám phá 🧭</h1><p>Thi thử, lộ trình, kỳ thi chứng chỉ và tài nguyên chính thức.</p></div>

    <a class="course-card clay shimmer pressable pop" style="--cc:#d9734e;--d:.03s" href="#/mock">
      <div class="cc-icon">📝</div>
      <div class="cc-main">
        <div class="cc-tag">Mô phỏng phòng thi</div>
        <h3>Thi thử chứng chỉ</h3>
        <p>Trộn câu hỏi nhiều khoá, bấm giờ, chấm đạt/rớt 80%.${P.mock && Object.keys(P.mock).length ? ` Tốt nhất: ${Math.max(...Object.values(P.mock))}%` : ""}</p>
      </div>
      <span class="lr-go">›</span>
    </a>

    <a class="course-card clay shimmer pressable pop" style="--cc:#4f9d77;--d:.045s" href="#/library">
      <div class="cc-icon">📚</div>
      <div class="cc-main">
        <div class="cc-tag">Tài liệu tác giả</div>
        <h3>Thư viện video & PDF</h3>
        <p>Playlist video + kho tài liệu Claude của thầy Lê Văn Thảo.</p>
      </div>
      <span class="lr-go">›</span>
    </a>

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
  // đồ thị hoạt động 7 ngày
  const acts = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); acts.push({ n: P.activity[dayKey(d)] || 0, lb: labels[d.getDay()] }); }
  const maxAct = Math.max(1, ...acts.map(a => a.n));
  const chart = acts.map(a => {
    const h = a.n ? Math.max(12, Math.round(a.n / maxAct * 76)) : 4;
    return `<div class="bar-col"><span class="bar-n">${a.n || ""}</span><div class="bar-fill" style="height:${h}px"></div><span class="bar-lb">${a.lb}</span></div>`;
  }).join("");
  const weekTotal = acts.reduce((s, a) => s + a.n, 0);
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
    <h2 class="sec-title pop" style="--d:.2s">Hoạt động 7 ngày <small>${weekTotal} lượt</small></h2>
    <div class="chart clay pop" style="--d:.22s">${chart}</div>
    <h2 class="sec-title pop" style="--d:.24s">Huy hiệu</h2>
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
          ${ready ? `<a class="cert-link done" href="#/cert/${c.id}">🏆 Chứng nhận</a>` : `<a class="cert-link" href="#/course/${c.id}">Xem khoá ›</a>`}
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
    <div class="fs-control clay pop" style="margin-top:12px">
      <span>🔤 Cỡ chữ bài học</span>
      <div class="fs-btns">
        <button class="${fontScale==='sm'?'on':''}" data-fs="sm">A</button>
        <button class="${fontScale==='md'?'on':''}" data-fs="md">A</button>
        <button class="${fontScale==='lg'?'on':''}" data-fs="lg">A</button>
        <button class="${fontScale==='xl'?'on':''}" data-fs="xl">A</button>
      </div>
    </div>
    <button class="btn pressable" id="reminderBtn" style="margin-top:12px">${P.reminder ? "🔔 Nhắc học mỗi ngày: BẬT" : "🔕 Nhắc học mỗi ngày: TẮT"}</button>
    <p class="foot-note" style="text-align:left;padding:6px 4px 0">🔔 Khi bật, app sẽ nhắc bạn học nếu hôm nay chưa học (hiển thị khi bạn mở app — trình duyệt không cho hẹn giờ nền cố định).</p>
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
      <p style="margin-top:8px"><b>Phiên bản:</b> v${APP_VERSION}${isStandalone() ? " · đã cài trên máy ✅" : ""}</p>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary pressable" id="installBtn">📲 Cài đặt / Hướng dẫn cài</button>
      <button class="btn pressable" id="updateBtn">🔄 Kiểm tra cập nhật</button>
    </div>
    <h2 class="sec-title pop">Sao lưu tiến độ</h2>
    <div class="action-stack">
      <button class="btn pressable" id="backupBtn">⬇️ Tải tệp sao lưu</button>
      <button class="btn pressable" id="restoreBtn">⬆️ Khôi phục từ tệp</button>
      <input type="file" id="restoreFile" accept="application/json,.json" hidden>
    </div>
    <p class="foot-note" style="text-align:left;padding:8px 4px 0">Tiến độ lưu theo email trên máy này. Muốn chuyển sang máy/điện thoại khác: tải tệp sao lưu rồi khôi phục ở thiết bị mới.</p>
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
  app.querySelectorAll("[data-fs]").forEach(btn => btn.onclick = () => { setFontScale(btn.dataset.fs); renderProfile(); });
  document.getElementById("reminderBtn").onclick = async () => {
    if (!P.reminder) {
      if ("Notification" in window && Notification.permission === "default") { try { await Notification.requestPermission(); } catch {} }
      P.reminder = true;
    } else P.reminder = false;
    saveP(); renderProfile();
  };
  document.getElementById("themeBtn").onclick = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("ca-theme", dark ? "dark" : "light");
  };
  document.getElementById("logoutBtn").onclick = () => { logout(); renderLogin(); };
  document.getElementById("installBtn").onclick = () => go("#/install");
  document.getElementById("updateBtn").onclick = () => checkForUpdate(true);
  document.getElementById("backupBtn").onclick = () => {
    const data = { app: "claude-academy", v: APP_VERSION, exportedAt: new Date().toISOString(), user: user(), progress: P };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = `ClaudeAcademy-saoluu-${dayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Đã tải tệp sao lưu ✓");
  };
  const rf = document.getElementById("restoreFile");
  document.getElementById("restoreBtn").onclick = () => rf.click();
  rf.onchange = () => {
    const f = rf.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (d.app !== "claude-academy" || !d.progress) throw new Error("sai định dạng");
        if (!confirm("Khôi phục sẽ ghi đè tiến độ hiện tại trên máy này. Tiếp tục?")) return;
        if (d.user && d.user.email) { USERS[d.user.email] = { name: d.user.name, created: d.user.created || Date.now() }; saveJSON("ca-users", USERS); CURRENT = d.user.email; localStorage.setItem("ca-current", CURRENT); }
        P = d.progress; saveP();
        toast("Khôi phục thành công ✓"); setTimeout(() => { route(); }, 700);
      } catch (e) { toast("Tệp không hợp lệ ❌"); }
    };
    reader.readAsText(f);
  };
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
    <div class="note-card clay">
      <label for="noteArea">📝 Ghi chú của bạn <small id="noteSaved"></small></label>
      <textarea id="noteArea" placeholder="Ghi lại ý quan trọng, câu hỏi, hoặc liên hệ thực tế của riêng bạn…">${esc(P.notes[l.id] || "")}</textarea>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary pressable" id="doneBtn">${P.done[l.id] ? "✓ Đã hoàn thành" : "Hoàn thành bài học ✓"}</button>
      <button class="btn pressable" id="nextBtn">${next ? "Bài tiếp theo →" : "Làm quiz của khoá →"}</button>
    </div>
  </div>`;

  const noteArea = document.getElementById("noteArea");
  let noteT = null;
  noteArea.oninput = () => {
    clearTimeout(noteT);
    noteT = setTimeout(() => {
      const v = noteArea.value.trim();
      if (v) P.notes[l.id] = v; else delete P.notes[l.id];
      saveP();
      const s = document.getElementById("noteSaved"); if (s) { s.textContent = "đã lưu ✓"; setTimeout(() => { if (s) s.textContent = ""; }, 1500); }
    }, 500);
  };

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
      P.done[l.id] = true; markStudyDay(); bumpActivity(); saveP();
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
    markStudyDay(); bumpActivity(); saveP(); sfx("done");
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

// ───────────────────────── Hướng dẫn cài đặt (PWA) ─────────────────────────
function renderInstall() {
  TTS.stop(); renderChrome("home");
  const plat = platformGuess();
  const done = isStandalone();
  const guides = {
    android: { ico: "🤖", name: "Android (Chrome)", steps: [
      "Mở trang này bằng trình duyệt <b>Chrome</b>.",
      "Bấm nút <b>⋮</b> (ba chấm) ở góc trên bên phải.",
      "Chọn <b>«Thêm vào Màn hình chính»</b> (Add to Home screen).",
      "Bấm <b>Thêm/Cài đặt</b> — biểu tượng 🎓 xuất hiện như một app thật."
    ]},
    ios: { ico: "🍎", name: "iPhone / iPad (Safari)", steps: [
      "Mở trang này bằng trình duyệt <b>Safari</b> (không phải Chrome).",
      "Bấm nút <b>Chia sẻ</b> (hình ô vuông có mũi tên đi lên).",
      "Kéo xuống chọn <b>«Thêm vào MH chính»</b> (Add to Home Screen).",
      "Bấm <b>Thêm</b> ở góc trên — app sẽ nằm trên màn hình chính."
    ]},
    desktop: { ico: "💻", name: "Máy tính (Chrome/Edge)", steps: [
      "Mở trang bằng <b>Chrome</b> hoặc <b>Edge</b>.",
      "Nhìn cuối thanh địa chỉ, bấm biểu tượng <b>cài đặt</b> (màn hình có mũi tên ⊕).",
      "Hoặc menu <b>⋮ → Cài đặt Claude Academy</b>.",
      "Bấm <b>Cài đặt</b> — app mở trong cửa sổ riêng."
    ]}
  };
  const order = [plat, ...Object.keys(guides).filter(p => p !== plat)];
  app.innerHTML = `
  <div class="screen">
    ${backRow("#/", "Trang chủ")}
    <div class="course-hero clay shimmer pop">
      <div class="ph-emoji" style="font-size:46px">📲</div>
      <h1>Cài đặt ứng dụng</h1>
      <p>${done ? "✅ Bạn đã cài app rồi — đang chạy ở chế độ toàn màn hình!" : "Cài Claude Academy lên thiết bị để mở nhanh, toàn màn hình và học cả khi không có mạng."}</p>
      ${deferredPrompt && !done ? `<button class="btn btn-primary pressable" id="nativeInstall" style="margin-top:14px">⬇️ Cài đặt ngay</button>` : ""}
    </div>
    ${done ? "" : order.map((p, i) => {
      const g = guides[p];
      return `
      <div class="info-card clay shimmer pop" style="--d:${.06 + i * .05}s">
        <h3>${g.ico} ${g.name}${i === 0 ? ' <span class="chip vio" style="--cc:#d9734e">thiết bị của bạn</span>' : ""}</h3>
        <ol style="padding-left:20px;margin-top:8px">
          ${g.steps.map(s => `<li style="margin-bottom:6px;font-size:14px;font-weight:500;color:var(--ink)">${s}</li>`).join("")}
        </ol>
      </div>`;
    }).join("")}
    <div class="info-card clay pop">
      <h3>💡 Vì sao nên cài?</h3>
      <ul style="padding-left:20px;margin-top:6px">
        <li>Mở bằng một chạm, không cần gõ địa chỉ.</li>
        <li>Chạy toàn màn hình, không có thanh trình duyệt.</li>
        <li>Học được cả khi offline (sau lần mở đầu có mạng).</li>
        <li>Tự báo khi có bản cập nhật mới.</li>
      </ul>
    </div>
    <p class="foot-note">Phiên bản hiện tại: v${APP_VERSION}</p>
  </div>`;
  const ni = document.getElementById("nativeInstall");
  if (ni) ni.onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const r = await deferredPrompt.userChoice;
    if (r && r.outcome === "accepted") localStorage.setItem("ca-installed", "1");
    deferredPrompt = null;
    go("#/");
  };
}

// ───────────────────────── Thư viện của tác giả (video + tài liệu) ─────────────────────────
function renderLibrary() {
  TTS.stop(); renderChrome("explore");
  app.innerHTML = `
  <div class="screen">
    ${backRow("#/explore", "Khám phá")}
    <div class="course-hero clay shimmer pop">
      <div class="ph-emoji" style="font-size:46px">📚</div>
      <h1>Thư viện của tác giả</h1>
      <p>Bộ video và tài liệu về Claude do thầy Lê Văn Thảo tổng hợp — xem ngay trong app.</p>
    </div>

    <h2 class="sec-title pop" style="--d:.05s">🎬 Playlist video</h2>
    <div class="video-card clay shimmer pressable pop" id="plCard" role="button" tabindex="0" style="--d:.06s">
      <div class="video-thumb" id="plThumb">
        <div class="pl-panel"><span class="video-play">▶</span><b>Phát toàn bộ playlist</b><small>Các video Claude của tác giả · phụ đề tiếng Việt bật được</small></div>
      </div>
      <div class="video-meta"><b>Playlist: Claude — Lê Văn Thảo</b><small>Phát liên tục trong app · cần có mạng</small></div>
    </div>
    <a class="cert-row clay pressable pop" style="--d:.09s" href="https://youtube.com/playlist?list=${AUTHOR_PLAYLIST}" target="_blank" rel="noopener">
      <span class="ce">▶️</span><span class="cert-main"><b>Mở trên YouTube</b><small>Xem ngoài app, lưu vào tài khoản của bạn</small></span><span class="cert-link">Mở ↗</span>
    </a>

    <h2 class="sec-title pop" style="--d:.1s">🗂️ Mục lục video theo chủ đề <small>${AUTHOR_VIDEOS.reduce((n,g)=>n+g.items.length,0)} video</small></h2>
    ${AUTHOR_VIDEOS.map((g, i) => {
      const c = findCourse(g.course);
      return `
      <div class="vidgroup clay pop" style="--cc:${c ? c.color : "#d9734e"};--d:${.11 + i * .03}s">
        <div class="vg-head">
          <b>${esc(g.group)}</b>
          ${c ? `<a class="vg-link" href="#/course/${c.id}">${c.emoji} Học khoá</a>` : ""}
        </div>
        <ul class="vg-list">
          ${g.items.map(([t, d]) => `<li><span>${esc(t)}</span><i>${d}</i></li>`).join("")}
        </ul>
      </div>`;
    }).join("")}
    <p class="foot-note" style="text-align:left;padding:6px 4px 10px">▶️ Mở trình phát playlist ở trên để xem các video này. Muốn em gắn đúng từng video vào từng bài học (bấm là phát ngay trong bài), anh gửi em link chia sẻ của từng video nhé.</p>

    <h2 class="sec-title pop" style="--d:.12s">📄 Tài liệu PDF <small>${AUTHOR_DOCS.reduce((n,g)=>n+g.items.length,0)} tài liệu</small></h2>
    <a class="cert-row clay shimmer pressable pop" style="--d:.125s" href="${AUTHOR_DRIVE}" target="_blank" rel="noopener">
      <span class="ce">📁</span>
      <span class="cert-main"><b>Mở kho tài liệu (Google Drive)</b><small>Toàn bộ PDF + video — bấm để mở thư mục</small></span>
      <span class="cert-link">Mở ↗</span>
    </a>
    ${AUTHOR_DOCS.map((g, i) => {
      const c = findCourse(g.course);
      return `
      <div class="vidgroup docgroup clay pop" style="--cc:${c ? c.color : "#d9734e"};--d:${.13 + i * .03}s">
        <div class="vg-head">
          <b>${esc(g.group)}</b>
          ${c ? `<a class="vg-link" href="#/course/${c.id}">${c.emoji} Học khoá</a>` : ""}
        </div>
        <ul class="vg-list">
          ${g.items.map(t => `<li><span>${esc(t.replace(/_/g, " ").replace(/\.pdf$/i, ""))}</span><i>PDF</i></li>`).join("")}
        </ul>
      </div>`;
    }).join("")}
    <p class="foot-note" style="text-align:left;padding:10px 4px 0">💡 Tài liệu mở trong thư mục Drive (cần đặt chia sẻ «Bất kỳ ai có đường liên kết»). Muốn em gắn nút mở thẳng từng PDF, anh gửi link chia sẻ của từng tệp nhé.</p>
  </div>`;
  const card = document.getElementById("plCard");
  if (card) card.onclick = () => {
    if (card.dataset.loaded) return; card.dataset.loaded = "1";
    MUSIC.videoHold = true; MUSIC.stop(); TTS.stop();
    document.getElementById("plThumb").innerHTML =
      `<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=${AUTHOR_PLAYLIST}&autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=vi&hl=vi"
        title="Playlist video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  };
}

// ───────────────────────── Tìm kiếm ─────────────────────────
let searchIndex = null;
function buildSearchIndex() {
  if (searchIndex) return searchIndex;
  searchIndex = [];
  for (const c of COURSES) c.lessons.forEach((l, i) => {
    const parts = [c.title, l.title];
    l.sections.forEach(s => { if (s.h) parts.push(s.h); (s.p || []).forEach(p => parts.push(p)); (s.list || []).forEach(x => parts.push(x)); });
    (l.takeaways || []).forEach(t => parts.push(t));
    searchIndex.push({ c, i, l, hay: normalize(parts.join(" ")) });
  });
  return searchIndex;
}
function renderSearch() {
  TTS.stop(); renderChrome(null);
  app.innerHTML = `
  <div class="screen">
    ${backRow("#/", "Trang chủ")}
    <div class="search-box clay pop">
      <span>🔍</span>
      <input id="searchInput" type="search" placeholder="Tìm bài học, chủ đề… (vd: hooks, excel, prompt)" autocomplete="off" autofocus>
    </div>
    <div id="searchResults"></div>
  </div>`;
  const input = document.getElementById("searchInput");
  const box = document.getElementById("searchResults");
  const run = () => {
    const q = normalize(input.value.trim());
    if (q.length < 2) { box.innerHTML = `<p class="foot-note" style="text-align:left;padding:14px 4px">Gõ ít nhất 2 ký tự để tìm trong ${COURSES.reduce((n,c)=>n+c.lessons.length,0)} bài học.</p>`; return; }
    const hits = buildSearchIndex().filter(x => x.hay.includes(q)).slice(0, 30);
    if (!hits.length) { box.innerHTML = `<p class="foot-note" style="text-align:left;padding:14px 4px">Không tìm thấy «${esc(input.value.trim())}». Thử từ khoá khác nhé.</p>`; return; }
    box.innerHTML = `<p class="ph-meta pop" style="margin:8px 2px">${hits.length} kết quả</p>` + hits.map((x, k) => `
      <a class="lesson-row clay pressable pop ${P.done[x.l.id] ? "done" : ""}" style="--cc:${x.c.color};--d:${Math.min(k*.03,.4)}s" href="#/lesson/${x.c.id}/${x.i}">
        <span class="lr-num">${P.done[x.l.id] ? "✓" : "📖"}</span>
        <span class="lr-main"><b>${esc(x.l.title)}</b><small>${esc(x.c.emoji + " " + x.c.title)}</small></span>
        <span class="lr-go">›</span>
      </a>`).join("");
  };
  input.oninput = run; run();
}

// ───────────────────────── Chứng nhận hoàn thành ─────────────────────────
function courseDone(c) {
  const pr = courseProgress(c);
  return pr.pct === 100 && P.quiz[c.id] != null && P.quiz[c.id] >= 80;
}
function renderCert(cid) {
  TTS.stop(); renderChrome("profile");
  const c = findCourse(cid); if (!c) return renderProfile();
  const u = user();
  const date = new Date().toLocaleDateString("vi-VN");
  const eligible = courseDone(c);
  app.innerHTML = `
  <div class="screen">
    ${backRow("#/profile", "Hồ sơ")}
    ${eligible ? `
    <div class="certificate clay pop" id="certCard">
      <div class="cert-deco">🎓</div>
      <small>CHỨNG NHẬN HOÀN THÀNH</small>
      <h2>${esc(c.title)}</h2>
      <p class="cert-name">${esc(u.name)}</p>
      <p class="cert-sub">đã hoàn thành toàn bộ bài học và đạt ${P.quiz[c.id]}% bài kiểm tra</p>
      <div class="cert-foot"><span>Claude Academy VN</span><span>${date}</span></div>
    </div>
    <div class="action-stack">
      <button class="btn btn-primary pressable" id="dlCert">⬇️ Tải ảnh chứng nhận</button>
      <a class="btn btn-gold pressable" href="${c.examUrl}" target="_blank" rel="noopener">🎓 Thi lấy chứng chỉ chính thức ↗</a>
    </div>
    <p class="foot-note">Đây là chứng nhận nội bộ của Claude Academy VN để ghi nhận nỗ lực học tập. Chứng chỉ chính thức do Anthropic cấp tại anthropic.skilljar.com.</p>
    ` : `
    <div class="result-hero clay shimmer pop">
      <span class="big-emoji">🔒</span>
      <h1>Chưa mở khoá chứng nhận</h1>
      <p>Hoàn thành tất cả bài học của «${esc(c.title)}» và đạt quiz từ 80% để nhận chứng nhận hoàn thành.</p>
    </div>
    <a class="btn btn-primary pressable" href="#/course/${c.id}" style="margin-top:14px">Tiếp tục học khoá này</a>`}
  </div>`;
  const dl = document.getElementById("dlCert");
  if (dl) dl.onclick = () => downloadCertificate(c, u.name, date);
}
function downloadCertificate(c, name, date) {
  const W = 1200, H = 800, cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  // nền
  x.fillStyle = "#efeafb"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#ffffff"; roundRect(x, 50, 50, W - 100, H - 100, 32); x.fill();
  x.lineWidth = 8; x.strokeStyle = c.color || "#d9734e"; roundRect(x, 50, 50, W - 100, H - 100, 32); x.stroke();
  x.textAlign = "center";
  x.fillStyle = c.color || "#d9734e"; x.font = "120px serif"; x.fillText("🎓", W / 2, 230);
  x.fillStyle = "#7a7295"; x.font = "bold 30px system-ui,sans-serif"; x.fillText("CHỨNG NHẬN HOÀN THÀNH", W / 2, 300);
  x.fillStyle = "#2a2440"; x.font = "bold 56px system-ui,sans-serif"; wrapText(x, c.title, W / 2, 380, W - 220, 60);
  x.fillStyle = "#b5532f"; x.font = "italic bold 64px Georgia,serif"; x.fillText(name, W / 2, 520);
  x.fillStyle = "#2a2440"; x.font = "28px system-ui,sans-serif";
  x.fillText(`đã hoàn thành toàn bộ bài học · đạt ${P.quiz[c.id]}% bài kiểm tra`, W / 2, 580);
  x.fillStyle = "#7a7295"; x.font = "26px system-ui,sans-serif";
  x.textAlign = "left"; x.fillText("Claude Academy VN", 110, H - 110);
  x.textAlign = "right"; x.fillText(date, W - 110, H - 110);
  cv.toBlob(blob => {
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = `ChungNhan-${normalize(c.title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    sfx("done");
  });
}
function roundRect(x, rx, ry, w, h, r) { x.beginPath(); x.moveTo(rx + r, ry); x.arcTo(rx + w, ry, rx + w, ry + h, r); x.arcTo(rx + w, ry + h, rx, ry + h, r); x.arcTo(rx, ry + h, rx, ry, r); x.arcTo(rx, ry, rx + w, ry, r); x.closePath(); }
function wrapText(ctx, text, cx, cy, maxW, lh) {
  const words = text.split(" "); let line = "", y = cy;
  for (const w of words) { const test = line + w + " "; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line.trim(), cx, y); line = w + " "; y += lh; } else line = test; }
  ctx.fillText(line.trim(), cx, y);
}

// ───────────────────────── Thi thử (Mock Exam) ─────────────────────────
let mockTimer = null;
const MOCK_SCOPES = {
  all:     { label: "Toàn bộ chương trình", filter: () => true },
  academy: { label: "Giáo trình chính thức", filter: c => (c.track || "academy") === "academy" },
  power:   { label: "Giáo trình thực chiến", filter: c => c.track === "power" }
};
function mockPool(scope) {
  const pool = [];
  for (const c of COURSES) if (MOCK_SCOPES[scope].filter(c))
    c.quiz.forEach((q, qi) => pool.push({ c, qi, q }));
  return pool;
}
function renderMockSetup() {
  TTS.stop(); renderChrome("explore");
  app.innerHTML = `
  <div class="screen">
    ${backRow("#/explore", "Khám phá")}
    <div class="course-hero clay shimmer pop">
      <div class="ph-emoji" style="font-size:46px">📝</div>
      <h1>Thi thử chứng chỉ</h1>
      <p>Mô phỏng phòng thi: câu hỏi trộn ngẫu nhiên từ nhiều khoá, có bấm giờ, chấm đạt/rớt ở mốc 80%. Luyện cho quen áp lực trước khi thi thật.</p>
    </div>
    <h2 class="sec-title pop" style="--d:.06s">Chọn phạm vi đề</h2>
    <div class="action-stack">
      ${Object.entries(MOCK_SCOPES).map(([k, v], i) => {
        const n = mockPool(k).length;
        const best = P.mock[k];
        return `<button class="btn ${i === 0 ? "btn-primary" : ""} pressable" data-scope="${k}">${esc(v.label)} · ${Math.min(20, n)} câu${best != null ? ` · tốt nhất ${best}%` : ""}</button>`;
      }).join("")}
    </div>
    <div class="info-card clay pop" style="--d:.16s">
      <h3>📋 Luật thi thử</h3>
      <ul style="padding-left:20px;margin-top:6px">
        <li>20 câu (hoặc ít hơn nếu phạm vi nhỏ), trộn ngẫu nhiên.</li>
        <li>Bấm giờ 1 phút/câu — hết giờ tự nộp bài.</li>
        <li>Không hiện đúng/sai ngay; xem kết quả & giải thích ở cuối.</li>
        <li>Đạt từ 80% là «Đỗ». Câu sai tự vào mục Ôn tập thông minh.</li>
      </ul>
    </div>
  </div>`;
  app.querySelectorAll("[data-scope]").forEach(b => b.onclick = () => go(`#/mock/${b.dataset.scope}`));
}
function renderMock(scope) {
  TTS.stop(); renderChrome("explore");
  if (!MOCK_SCOPES[scope]) return renderMockSetup();
  const pool = mockPool(scope).sort(() => Math.random() - .5).slice(0, 20);
  const total = pool.length;
  const answers = new Array(total).fill(-1);
  let i = 0;
  let remaining = total * 60; // 1 phút/câu
  clearInterval(mockTimer);
  mockTimer = setInterval(() => {
    remaining--;
    const el = document.getElementById("mockClock");
    if (el) { const m = Math.floor(remaining / 60), s = remaining % 60; el.textContent = `⏱ ${m}:${String(s).padStart(2, "0")}`; el.classList.toggle("low", remaining <= 60); }
    if (remaining <= 0) { clearInterval(mockTimer); finish(); }
  }, 1000);

  function draw() {
    const { q } = pool[i];
    const order = q.options.map((_, k) => k).sort(() => Math.random() - .5);
    app.innerHTML = `
    <div class="screen">
      <div class="mock-bar">
        <button class="back-btn" id="mockQuit" style="width:38px;height:38px">✕</button>
        <div class="track" style="flex:1"><i style="width:${Math.round(i / total * 100)}%"></i></div>
        <span class="mock-clock" id="mockClock">⏱ ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")}</span>
      </div>
      <p class="ph-meta pop" style="margin:4px 2px 0">Câu ${i + 1}/${total}</p>
      <p class="quiz-q pop" style="--d:.04s">${esc(q.q)}</p>
      <div class="opt-stack">
        ${order.map((o, k) => `<button class="opt-btn clay pressable pop ${answers[i] === o ? "chosen" : ""}" style="--d:${.06 + k * .04}s" data-k="${o}">${esc(q.options[o])}</button>`).join("")}
      </div>
      <div class="action-stack" style="margin-top:16px">
        <button class="btn btn-primary pressable" id="mockNext">${i + 1 < total ? "Câu tiếp theo →" : "Nộp bài ✓"}</button>
        ${i > 0 ? `<button class="btn pressable" id="mockPrev">← Câu trước</button>` : ""}
      </div>
    </div>`;
    app.querySelectorAll(".opt-btn").forEach(btn => btn.onclick = () => {
      answers[i] = +btn.dataset.k;
      app.querySelectorAll(".opt-btn").forEach(b => b.classList.toggle("chosen", +b.dataset.k === answers[i]));
    });
    document.getElementById("mockNext").onclick = () => { if (i + 1 < total) { i++; draw(); } else finish(); };
    const pv = document.getElementById("mockPrev"); if (pv) pv.onclick = () => { i--; draw(); };
    document.getElementById("mockQuit").onclick = () => { clearInterval(mockTimer); go("#/explore"); };
  }

  function finish() {
    clearInterval(mockTimer);
    let score = 0;
    pool.forEach((item, k) => {
      const ok = answers[k] === item.q.a;
      if (ok) score++;
      trackAnswer(item.c.id, item.qi, ok); // câu sai vào Ôn tập thông minh
    });
    const pct = Math.round(score / total * 100);
    const pass = pct >= 80;
    if (P.mock[scope] == null || pct > P.mock[scope]) P.mock[scope] = pct;
    markStudyDay(); bumpActivity(); saveP(); sfx("done");
    if (pass) confetti();
    app.innerHTML = `
    <div class="screen">
      ${backRow("#/explore", "Khám phá")}
      <div class="result-hero clay shimmer pop">
        <span class="big-emoji">${pass ? "🏆" : "📚"}</span>
        <h1>${score}/${total} đúng — ${pct}%</h1>
        <p>${pass ? "Đỗ! Bạn đã sẵn sàng cho kỳ thi thật. Đăng ký thi để lấy chứng chỉ nhé!" : "Chưa đạt mốc 80%. Xem lại các câu sai bên dưới rồi thi lại — sắp được rồi!"}</p>
      </div>
      ${pass ? `<a class="btn btn-gold pressable pop" href="https://anthropic.skilljar.com/" target="_blank" rel="noopener" style="--d:.08s">🎓 Đăng ký thi chứng chỉ chính thức ↗</a>` : ""}
      <h2 class="sec-title pop">Xem lại đáp án</h2>
      ${pool.map((item, k) => {
        const ok = answers[k] === item.q.a;
        const your = answers[k] >= 0 ? item.q.options[answers[k]] : "(bỏ trống)";
        return `
        <div class="info-card clay pop" style="--d:${.04 + k * .02}s">
          <h3 style="font-size:14px">${ok ? "✅" : "❌"} ${esc(item.q.q)}</h3>
          ${ok ? "" : `<p style="color:#c0564b"><b>Bạn chọn:</b> ${esc(your)}</p>`}
          <p style="color:var(--green,#1fa873)"><b>Đáp án đúng:</b> ${esc(item.q.options[item.q.a])}</p>
          <p style="margin-top:4px">${esc(item.q.expl)}</p>
        </div>`;
      }).join("")}
      <div class="action-stack">
        <button class="btn btn-primary pressable" id="mockRetry">Thi lại</button>
        <a class="btn pressable" href="#/review">🧠 Ôn câu sai</a>
      </div>
    </div>`;
    document.getElementById("mockRetry").onclick = () => go(`#/mock/${scope}`);
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
    markStudyDay(); bumpActivity(); saveP(); sfx("done");
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

// ───────────────────────── Ôn tập ngắt quãng (Spaced Repetition / SM-2) ─────────────────────────
const DAY = 86400000;
function allCards() {
  const out = [];
  for (const c of COURSES) c.cards.forEach((card, idx) => out.push({ c, idx, card, key: c.id + ":" + idx }));
  return out;
}
function srsDue(limitNew = 12) {
  const now = Date.now();
  const due = [], fresh = [];
  for (const it of allCards()) {
    const s = P.srs[it.key];
    if (!s) fresh.push(it);
    else if (s.due <= now) due.push(it);
  }
  return due.concat(fresh.slice(0, limitNew)); // thẻ đến hạn + một ít thẻ mới
}
function srsRate(key, grade) {
  // grade: 0 = Khó (lại), 1 = Được, 2 = Dễ
  const s = P.srs[key] || { ease: 2.5, interval: 0, due: 0, reps: 0 };
  if (grade === 0) { s.reps = 0; s.interval = 0; s.ease = Math.max(1.3, s.ease - 0.2); s.due = Date.now(); }
  else {
    if (grade === 2) s.ease += 0.15;
    s.interval = s.reps === 0 ? (grade === 2 ? 2 : 1) : s.reps === 1 ? (grade === 2 ? 5 : 3) : Math.round(s.interval * s.ease * (grade === 2 ? 1.3 : 1));
    s.reps++; s.due = Date.now() + s.interval * DAY;
  }
  P.srs[key] = s; saveP();
  return s;
}
function renderSRS() {
  TTS.stop(); renderChrome("home");
  const queue = srsDue().sort(() => Math.random() - .5);
  if (!queue.length) {
    app.innerHTML = `
    <div class="screen">${backRow("#/", "Trang chủ")}
      <div class="result-hero clay shimmer pop"><span class="big-emoji">✅</span>
        <h1>Hết thẻ đến hạn!</h1>
        <p>Bạn đã ôn xong tất cả thẻ cần ôn hôm nay. Thuật toán sẽ tự hẹn ngày ôn lại để bạn nhớ lâu nhất. Quay lại sau nhé!</p>
      </div>
      <div class="action-stack" style="margin-top:14px">
        <a class="btn btn-primary pressable" href="#/">Về trang chủ</a>
        <a class="btn pressable" href="#/mock">📝 Thi thử</a>
      </div>
    </div>`;
    return;
  }
  let flipped = false, doneCount = 0; const startN = queue.length;
  function draw() {
    if (!queue.length) { markStudyDay(); bumpActivity(); saveP(); sfx("done"); confetti();
      app.innerHTML = `<div class="screen">${backRow("#/", "Trang chủ")}
        <div class="result-hero clay shimmer pop"><span class="big-emoji">🎉</span>
        <h1>Đã ôn ${doneCount} thẻ!</h1><p>Tuyệt vời! Các thẻ khó sẽ sớm quay lại, thẻ dễ được hẹn xa hơn — đúng cách để nhớ lâu.</p></div>
        <a class="btn btn-primary pressable" href="#/" style="margin-top:14px">Hoàn tất ✓</a></div>`;
      return;
    }
    const it = queue[0];
    const isNew = !P.srs[it.key];
    app.innerHTML = `
    <div class="screen" style="--cc:${it.c.color}">
      ${backRow("#/", "Ôn tập ngắt quãng")}
      <div class="cc-bar pop"><div class="track"><i style="width:${Math.round(doneCount / (doneCount + queue.length) * 100)}%"></i></div><small>còn ${queue.length} thẻ</small></div>
      <div class="hero-meta pop" style="justify-content:flex-start;margin-top:8px"><span class="chip vio">${it.c.emoji} ${esc(it.c.title)}</span>${isNew ? '<span class="chip">thẻ mới</span>' : ''}</div>
      <div class="fc-stage pop ${flipped ? "flipped" : ""}" id="fc" style="--d:.05s">
        <div class="fc-inner">
          <div class="fc-face"><small>CÂU HỎI · CHẠM ĐỂ LẬT</small><p>${esc(it.card.front)}</p></div>
          <div class="fc-face back"><small>TRẢ LỜI</small><p>${esc(it.card.back)}</p></div>
        </div>
      </div>
      ${flipped ? `
      <p class="ph-meta pop" style="text-align:center;margin-top:14px">Bạn nhớ thẻ này thế nào?</p>
      <div class="srs-rate">
        <button class="srs-btn hard" data-g="0">😓 Khó<small>~1 phút</small></button>
        <button class="srs-btn ok" data-g="1">🙂 Được<small id="sg1"></small></button>
        <button class="srs-btn easy" data-g="2">😎 Dễ<small id="sg2"></small></button>
      </div>` : `<button class="btn btn-primary pressable" id="flipBtn" style="margin-top:16px">Lật thẻ xem đáp án</button>`}
    </div>`;
    document.getElementById("fc").onclick = () => { flipped = true; draw(); };
    const fb = document.getElementById("flipBtn"); if (fb) fb.onclick = () => { flipped = true; draw(); };
    app.querySelectorAll(".srs-btn").forEach(btn => btn.onclick = () => {
      const g = +btn.dataset.g;
      srsRate(it.key, g);
      queue.shift();
      if (g === 0) queue.splice(Math.min(3, queue.length), 0, it); // thẻ "Khó" quay lại sớm trong phiên
      else doneCount++;
      flipped = false; sfx(g === 0 ? "wrong" : "correct"); draw();
    });
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
      else { markStudyDay(); bumpActivity(); saveP(); sfx("done"); confetti(); setTimeout(() => go(`#/course/${c.id}`), 650); }
    };
    document.getElementById("fc").onclick = () => { flipped = !flipped; document.getElementById("fc").classList.toggle("flipped"); };
    document.getElementById("speakBtn").onclick = () => TTS.speak(flipped ? card.back : card.front);
    document.getElementById("prevBtn").onclick = () => { if (i > 0) { i--; flipped = false; draw(); } };
    document.getElementById("againBtn").onclick = () => { cards.push(card); advance(); };
    document.getElementById("nextBtn").onclick = advance;
  }
  draw();
}

// ───────────────────────── Giao diện sáng/tối + cỡ chữ ─────────────────────────
if (localStorage.getItem("ca-theme") === "dark") document.documentElement.classList.add("dark");
let fontScale = localStorage.getItem("ca-fontscale") || "md";
function applyFontScale() {
  document.documentElement.classList.remove("fs-sm", "fs-md", "fs-lg", "fs-xl");
  document.documentElement.classList.add("fs-" + fontScale);
}
function setFontScale(v) { fontScale = v; localStorage.setItem("ca-fontscale", v); applyFontScale(); }
applyFontScale();

// ───────────────────────── Nhắc học hằng ngày ─────────────────────────
function maybeRemind() {
  if (!P || !P.reminder) return;
  if (P.days.includes(dayKey())) return; // hôm nay đã học rồi
  const last = localStorage.getItem("ca-remind-shown:" + CURRENT);
  if (last === dayKey()) return; // chỉ nhắc 1 lần/ngày
  localStorage.setItem("ca-remind-shown:" + CURRENT, dayKey());
  const msg = streak() > 0 ? `Giữ chuỗi 🔥 ${streak()} ngày — học một bài hôm nay nhé!` : "Đến giờ học Claude rồi! Chỉ cần một bài thôi 💪";
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Claude Academy", { body: msg, icon: "./icons/icon-192.png" }); } catch {}
  }
  setTimeout(() => toast("🔔 " + msg), 1200);
}

// ───────────────────────── Router ─────────────────────────
function route() {
  window.scrollTo(0, 0);
  clearInterval(mockTimer); // dừng đồng hồ thi thử khi rời trang
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
  else if (page === "srs") renderSRS();
  else if (page === "mock") { a ? renderMock(a) : renderMockSetup(); }
  else if (page === "search") renderSearch();
  else if (page === "library") renderLibrary();
  else if (page === "cert" && a) renderCert(a);
  else if (page === "install") renderInstall();
  else if (page === "explore") renderExplore();
  else if (page === "streaks") renderStreaks();
  else if (page === "profile") renderProfile();
  else renderHome();
}
window.addEventListener("hashchange", route);
route();
maybeRemind(); // nhắc học nếu hôm nay chưa học (khi đã bật & đã đăng nhập)

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

// ───────────────────────── PWA: service worker + báo cập nhật ─────────────────────────
let swReg = null, swReloading = false, lastManualCheck = false, userWantsReload = false;

function showUpdateBanner() {
  if (document.getElementById("updateBanner")) return;
  const bar = document.createElement("div");
  bar.id = "updateBanner";
  bar.className = "update-banner";
  bar.innerHTML = `
    <span>✨ Đã có bản cập nhật mới!</span>
    <button id="ubReload">Cập nhật ngay</button>
    <button id="ubLater" aria-label="Để sau">✕</button>`;
  document.body.appendChild(bar);
  requestAnimationFrame(() => bar.classList.add("show"));
  document.getElementById("ubReload").onclick = () => {
    userWantsReload = true; // người học chủ động cập nhật → luôn tải lại khi SW mới tiếp quản
    const w = swReg && swReg.waiting;
    if (w) { w.postMessage({ type: "SKIP_WAITING" }); } else { location.reload(); }
  };
  document.getElementById("ubLater").onclick = () => bar.remove();
}

function checkForUpdate(manual) {
  lastManualCheck = !!manual;
  if (!swReg) { if (manual) toast("Bạn đang dùng bản mới nhất 👍"); return; }
  if (swReg.waiting) { showUpdateBanner(); return; }
  swReg.update().then(() => {
    setTimeout(() => {
      if (swReg.waiting) showUpdateBanner();
      else if (manual) toast("Bạn đang dùng bản mới nhất 👍");
    }, 1200);
  }).catch(() => { if (manual) toast("Không kiểm tra được — thử lại khi có mạng."); });
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2600);
}

if ("serviceWorker" in navigator && window.isSecureContext) {
  // có controller sẵn = đã từng cài SW → controllerchange sau này là CẬP NHẬT (cần tải lại).
  // Lần cài đầu tiên (controller null) thì KHÔNG tải lại để tránh reload thừa.
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("./sw.js").then(reg => {
    swReg = reg;
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner();
    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener("statechange", () => {
        // có bản mới đã cài xong trong khi vẫn còn bản cũ đang chạy
        if (sw.state === "installed" && navigator.serviceWorker.controller) showUpdateBanner();
      });
    });
  }).catch(() => {});
  // SW mới giành quyền điều khiển → tải lại để áp dụng bản mới (bỏ qua lần cài đầu)
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (swReloading) return;
    if (!hadController && !userWantsReload) return; // lần cài đầu, không do người dùng → bỏ qua
    swReloading = true; location.reload();
  });
  // chủ động kiểm tra cập nhật khi mở lại app
  document.addEventListener("visibilitychange", () => { if (!document.hidden) checkForUpdate(false); });
}
})();
