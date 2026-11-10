/* 自毁版 Service Worker：只用于清理旧缓存，不做任何离线缓存。
   任何页面都不注册它；只有浏览器按旧地址检查更新时才会取到它。
   install：立即接管；activate：只删除名字以 "kg-" 开头的缓存，然后注销自己。
   不写 fetch 处理，不强制刷新页面。 */
self.addEventListener("install", () => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith("kg-")).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
