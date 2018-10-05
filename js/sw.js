const staticCacheName = 'v1';

let cacheFiles = [
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/',
  '/index.html',
  '/restaurant.html',
  'css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json'
]

// cache files
self.addEventListener('install', event => {
	console.log('[ServiceWorker] installed');
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			console.log('[ServiceWorker] cache files');
			return cache.addAll(cacheFiles);
		})
		.catch(error => {
			console.log('[ServiceWorker] Error during caching' + (error));
		})
	);
});

// Clear cache
self.addEventListener('activate' , event => {
	console.log('[ServiceWorker] Activated');
	event.waitUntil(caches.keys().then(cacheNames => {
		return Promise.all(
			cacheNames.filter(cacheName => {
				return cacheName.startsWith('restaurant') && cacheName != staticCacheName;
			}).map(cacheName => {
				return caches.delete(cacheName);
			})
		);
	})
	);
});

// Fetch cached assests
self.addEventListener('fetch', e => {
	e.respondWith(caches.match(e.request).then(response => {
		if (response) {
			console.log(e.request.url + 'found in cache');
			return response;
		}
		let requestClone = e.request.clone();
		return fetch(requestClone).then(response => {
			if (!response) {
				console.log('[ServiceWorker] Fetch had no response');
				return response;
			}
			let responseClone = response.clone();
			return caches.open(staticCacheName).then(cache => {
				cache.put(e.request, responseClone);
				return response;
			})
			.catch(error => {
				console.log('[ServiceWorker] Error occured during fetch and cache');
			})
		})
	})
	);
});