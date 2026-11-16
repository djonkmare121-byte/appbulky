const V='appbulky-v2-0',SHELL=['./','./index.html','./manifest.webmanifest','./logo.png','./icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method!=='GET'||u.origin!==location.origin)return; // POST & GAS tidak pernah disentuh SW
if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{const c=y.clone();caches.open(V).then(h=>h.put(r,c));return y})))});
