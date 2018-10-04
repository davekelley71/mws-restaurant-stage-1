const staticCacheName = 'restaurant-cache-v32';

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
	console.log('[ServiceWorker] Installed');
	event.waitUntil(
		caches.open(cacheName).then(cache = > {
			return cache.addAll(cacheFiles);
		})
		.catch(err => {
			console.log('[ServiceWorker] Caching Error');
		})
		);
});

// Clear cache
self.addEventListener('activate' , event => {
	event.waitUntil(caches.keys().then(cacheNames => {
		return Promise.all(
			cacheNames.filter(cacheName = > {
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
			console.log(e.request + 'found in cache');
			return response;
		}
		else {
			console.log(e.request + 'was not found in cache');
			return fetch(e.request).then(response => {
				const clonedResponse = response.clone();
				caches.open('restaurant-cache-v32').then(cache => {
					cache.put(e.request, response);
				})
				return response;
			})
			.catch(err => {
				console.log.error(err);
			});
		}
	})
	);
});