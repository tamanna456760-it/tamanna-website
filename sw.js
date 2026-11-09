const CACHE_NAME = "tamanna-ai-shell-v3";
const APP_SHELL = ["./", "./index.html", "./admin/", "./css/style.css", "./css/admin.css", "./css/settings.css", "./css/auth.css", "./js/chat.js", "./js/auth.js", "./manifest.webmanifest", "./assets/tamanna-ai-official-logo.jpg", "./404.html"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
 const request=event.request;if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(request).then(response=>{if(response.ok&&response.type==="basic"){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)));}return response;}).catch(async()=>{const cached=await caches.match(request);if(cached)return cached;if(request.mode==="navigate"){const shell=await caches.match("./index.html");if(shell)return shell;}return Response.error();}));
});
