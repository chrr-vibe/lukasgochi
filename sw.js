/* LUCASGOTCHI service worker
   - 업데이트를 올릴 때마다 아래 VERSION 숫자를 올려주세요. */
const VERSION = 'v124';
const CACHE = 'lucasgotchi-' + VERSION;
const CORE = [
  './',
  './index.html',
  './sprites.js',
  './backgrounds.js',
  './minigames.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './maskable-512.png',
  './apple-touch-icon.png',
  './favicon-64.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));   // HTTP 캐시 건너뛰고 새로 받기
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('lucasgotchi-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Firebase(친구 편지) 요청은 캐시하지 않고 그대로 네트워크로 (픽셀 폰트용 fonts.googleapis/fonts.gstatic 은 계속 캐시)
const NO_CACHE_HOST = /(^|\.)(googleapis\.com|gstatic\.com|firebaseio\.com)$|identitytoolkit/;
const FONT_HOST = /^fonts\.(googleapis|gstatic)\.com$/;

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (NO_CACHE_HOST.test(url.hostname) && !FONT_HOST.test(url.hostname)) return;   // 브라우저 기본 네트워크 처리
  if (req.method !== 'GET') return;

  // 페이지: 네트워크 우선 (새 버전 바로 반영), 오프라인이면 캐시
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache' }).then(res => {   // 브라우저 HTTP 캐시도 건너뛰고 서버에 확인
        const copy = res.clone();
        if (res.ok) caches.open(CACHE).then(c => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 매니페스트·아이콘: 네트워크 우선 (설치 정보가 옛 캐시에 묶이지 않도록), 오프라인이면 캐시
  if (url.origin === location.origin && /\.(webmanifest|png)$/.test(url.pathname)) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 스프라이트(sprites.js): 네트워크 우선 (index.html과 항상 같은 버전), 오프라인이면 캐시
  if (url.origin === location.origin && /\.js$/.test(url.pathname) && !/sw\.js$/.test(url.pathname)) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // 같은 사이트 파일: 캐시 우선
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
    return;
  }

  // 외부 파일(픽셀 폰트 등): 캐시 먼저 보여주고 뒤에서 갱신
  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
