/* 离线缓存：页面网络优先（保证内容最新），静态资源缓存优先 */
const V = "stroke-mi-2026-11-05b";
const ASSETS = ["./", "index.html", "data.js", "home.js", "sos.js", "../shared/site-meta.js", "../shared/app.js", "../shared/app.css", "manifest.webmanifest", "icon.svg", "icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const fresh = fetch(req).then(r => { const copy = r.clone(); caches.open(V).then(c => c.put(req, copy)); return r; });
  e.respondWith(fresh.catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
});
