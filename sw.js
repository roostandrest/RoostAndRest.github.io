const CACHE_NAME = 'roost-live-v555';
const RUNTIME_CACHE = 'roost-runtime-v535';

const CORE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './style.css',
  './config.js',
  './manifest.json',
  './assets/logo.svg',
  './assets/logo.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/signature-stamp.svg',
  './js/core.js',
  './js/user-audit.js',
  './js/airbnb-audit-data.js',
  './js/dashboard.js',
  './js/calendar.js',
  './js/bookings.js',
  './js/smart-bookings.js',
  './js/html2canvas.min.js',
  './js/booking-receipt.js',
  './js/gst-invoice.js',
  './js/ca-audit-pack.js',
  './js/properties.js',
  './js/employees.js',
  './js/expenses.js',
  './js/store.js',
  './js/maintenance.js',
  './js/investors.js',
  './js/sop.js',
  './js/whatsapp.js',
  './js/whatsapp-hub.js',
  './js/reconciliation.js',
  './js/notifications.js',
  './js/claims.js',
  './js/uhhs-od-manager.js',
  './js/company-advances.js',
  './js/analytics.js',
  './js/showcase-data.js',
  './js/command-palette.js',
  './js/help-guide.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (e) {
          // Silent fallback - ignore precache missing individual assets
        }
      }
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Only GET
  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  const url = new URL(req.url);

  // Supabase REST: Network first, cache last-good response for offline
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    // Realtime WebSocket - always network
    if (url.pathname.includes('realtime')) {
      event.respondWith(fetch(req));
      return;
    }
    // REST API: network first, fallback to cache
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200 && req.method === 'GET') {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              try { cache.put(req, clone); } catch(e) {}
            });
          }
          return res;
        })
        .catch(() => {
          return caches.match(req).then(cached => {
            if (cached) {
              console.log('📴 Serving from cache:', url.pathname);
              return cached;
            }
            return new Response(JSON.stringify({ offline: true, data: [] }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // HTML navigation & document requests: ALWAYS Network-first so updates are received immediately
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => {
              try { cache.put(req, clone); } catch(e) {}
            });
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('/admin.html')))
    );
    return;
  }

  // JS Scripts & Versioned assets: Network-first to always run latest logic
  if (url.pathname.endsWith('.js') || url.search.includes('v=')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => {
              try { cache.put(req, clone); } catch(e) {}
            });
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || new Response('Offline', { status: 503 })))
    );
    return;
  }

  // Other static assets (images, css): cache first
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => {
              try { cache.put(req, clone); } catch(e) {}
            });
          }
          return res;
        })
        .catch(() => cached || new Response('Offline', { status: 503 }));
      return cached || fetchPromise;
    })
  );
});

// ═══════════════════════════════════════════════════════════
// 🔔 PWA NATIVE PUSH & NOTIFICATION HANDLING
// ═══════════════════════════════════════════════════════════

self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { title: 'Roost & Rest Alert', body: event.data.text() };
    }
  }

  const title = data.title || 'Roost And Rest Stays';
  const options = {
    body: data.body || data.message || 'New update from Roost And Rest CRM',
    icon: data.icon || '/assets/icon-192.png',
    badge: '/assets/logo.png',
    tag: data.tag || ('roost-notif-' + Date.now()),
    data: data,
    vibrate: [100, 50, 100],
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open CRM' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const d = event.notification.data || {};
  let targetUrl = '/admin.html';
  if (d.page === 'bookings' || d.entityType === 'booking') {
    targetUrl = '/admin.html#bookings';
  } else if (d.page === 'store') {
    targetUrl = '/admin.html#store';
  } else if (d.page === 'expenses') {
    targetUrl = '/admin.html#expenses';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('admin.html') && 'focus' in client) {
          if (d.entityId) {
            client.postMessage({ type: 'OPEN_NOTIFICATION_TARGET', data: d });
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NATIVE_NOTIF') {
    const n = event.data.payload || {};
    self.registration.showNotification(n.title || 'Roost And Rest Stays', {
      body: n.body || n.message || '',
      icon: n.icon || '/assets/icon-192.png',
      badge: '/assets/logo.png',
      tag: n.tag || ('uhhs-' + Date.now()),
      data: n,
      vibrate: [100, 50, 100],
      requireInteraction: false
    });
  }
});

