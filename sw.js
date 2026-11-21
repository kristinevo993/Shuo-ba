/* Service worker: lưu sẵn app + mọi file mp3 trong máy để chạy offline.
   - Trang, dữ liệu, icon: lấy bản đã lưu ngay (mở nhanh, chạy offline), đồng thời tải bản mới
     ở nền → sửa code / thêm bài sẽ hiện ra ở LẦN MỞ APP SAU.
   - mp3: lấy bản đã lưu; chưa có thì tải về rồi lưu.
   - Mỗi lần mở app, trang gửi "sync": đọc lessons.json và tải về các mp3 còn thiếu.
   Đổi số phiên bản (v1 → v2) chỉ khi muốn xoá sạch bộ nhớ cũ. */
const SHELL = "shuoba-shell-v1", AUDIO = "shuoba-audio-v1", FONTS = "shuoba-fonts-v1";
const SHELL_FILES = ["./", "index.html", "lessons.json", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
const LEVELS = ["1A", "1B", "2"];
const abs = p => new URL(p, self.registration.scope).href;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL)
    .then(c => c.addAll(SHELL_FILES.map(f => new Request(f, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => ![SHELL, AUDIO, FONTS].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* ---- tải các mp3 còn thiếu ---- */
let syncing = null;
async function syncAudio() {
  let data;
  try { data = await (await fetch(abs("lessons.json"), { cache: "no-cache" })).json(); }
  catch (e) { const r = await caches.match(abs("lessons.json")); if (!r) return { total: 0, added: 0, failed: 0 }; data = await r.json(); }
  const urls = [];
  for (const t of data.topics) for (const s of t.situations) for (const L of LEVELS)
    if (s[L]) for (const lang of ["zh", "vi"]) urls.push(abs(`audio/${lang}/${s.id}_${L}.mp3`));
  const cache = await caches.open(AUDIO);
  const missing = [];
  for (const u of urls) if (!(await cache.match(u))) missing.push(u);
  let added = 0, failed = 0, i = 0;
  const worker = async () => {
    while (i < missing.length) {
      const u = missing[i++];
      try { const r = await fetch(u); if (!r.ok) throw 0; await cache.put(u, r); added++; }
      catch (e) { failed++; }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return { total: urls.length, added, failed };
}
self.addEventListener("message", e => {
  if (e.data !== "sync") return;
  syncing = syncing || syncAudio().finally(() => { syncing = null; });
  e.waitUntil(syncing.then(res => e.source && e.source.postMessage({ type: "synced", ...res })));
});

/* ---- iPhone phát audio bằng cách xin từng khúc (Range) → cắt khúc từ file đã lưu ---- */
async function withRange(req, resp) {
  const range = req.headers.get("range");
  if (!range) return resp;
  const buf = await resp.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return resp;
  let start, end;
  if (m[1] === "" ) { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  else { start = Number(m[1]); end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1; }
  if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: { "Content-Type": "audio/mpeg", "Content-Range": `bytes ${start}-${end}/${size}`,
               "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" }
  });
}
async function audioResponse(req) {
  const url = req.url.split("?")[0];
  const cache = await caches.open(AUDIO);
  let resp = await cache.match(url);
  if (!resp) {
    resp = await fetch(url);              // tải nguyên file (không Range) để lưu
    if (resp.ok) await cache.put(url, resp.clone());
    else return resp;
  }
  return withRange(req, resp);
}

/* ---- trang, dữ liệu, icon: dùng bản đã lưu, cập nhật ở nền ---- */
async function shellResponse(e) {
  const req = e.request;
  const cache = await caches.open(SHELL);
  const key = req.mode === "navigate" ? abs("./") : req.url.split("?")[0];
  const cached = await cache.match(key);
  const fresh = fetch(req.mode === "navigate" ? abs("./") : req, { cache: "no-cache" })
    .then(r => { if (r.ok) return cache.put(key, r.clone()).then(() => r); return r; });
  if (cached) { e.waitUntil(fresh.catch(() => {})); return cached; }
  return fresh;
}

/* ---- phông chữ Google: lưu lại sau lần tải đầu ---- */
async function fontResponse(req) {
  const cache = await caches.open(FONTS);
  const cached = await cache.match(req);
  if (cached) return cached;
  const r = await fetch(req);
  if (r.ok || r.type === "opaque") cache.put(req, r.clone());
  return r;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith(".mp3")) e.respondWith(audioResponse(req));
    else e.respondWith(shellResponse(e));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(fontResponse(req));
  }
});
