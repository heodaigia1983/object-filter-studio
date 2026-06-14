// Service worker — cho phép học offline sau lần mở đầu tiên
const CACHE = "claude-academy-v20";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./data-thucchien.js",
  "./art.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", e => {
  // KHÔNG skipWaiting tự động: bản mới «chờ» để app hiện banner cho người học chủ động cập nhật.
  // cache:"reload" buộc tải mới hoàn toàn từ máy chủ (bỏ qua HTTP cache cũ) để bản cập nhật thật sự mới.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// App gửi lệnh khi người học bấm «Cập nhật ngay» → kích hoạt bản mới
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

// Cache-first, cập nhật ngầm từ mạng khi có.
// Font Google (cross-origin) cũng được cache để dùng offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const cacheable = url.origin === location.origin ||
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request)
        .then(res => {
          if ((res.ok || res.type === "opaque") && cacheable) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
