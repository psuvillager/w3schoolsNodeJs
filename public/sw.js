self.addEventListener('install', function(event){ 
    console.log('[SW]: Service worker installed...', event); 
  }
);


self.addEventListener('activate', function(event){ 
    console.log('[SW]: Service worker activated...', event);
    return self.clients.claim();
  }
);

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

