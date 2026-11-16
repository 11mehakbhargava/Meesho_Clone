/**
 * Firebase Cloud Messaging Background Service Worker
 * Handles incoming push notifications when MShoppy dropshipper tab is closed or backgrounded.
 */

/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  apiKey: 'AIzaSyBkNsdWIycbJ4GfJnmOZJWSVur_m38UNI4',
  authDomain: 'meesho-clone-d1709.firebaseapp.com',
  projectId: 'meesho-clone-d1709',
  storageBucket: 'meesho-clone-d1709.firebasestorage.app',
  messagingSenderId: '312973658415',
  appId: 'G-1XVEJNMSN0'
});

const messaging = firebase.messaging();

// 1. Background Message Listener
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Push Received:', payload);

  const title = payload.notification?.title || payload.data?.title || 'MShoppy Dropshipper Alert';
  const body = payload.notification?.body || payload.data?.body || 'New store notification received.';
  const icon = payload.notification?.icon || '/favicon.ico';
  const tag = payload.data?.tag || 'mshoppy-dropshipper-notice';
  const clickAction = payload.data?.clickAction || '/dropshipper/dashboard';

  const notificationOptions = {
    body,
    icon,
    badge: '/favicon.ico',
    tag,
    renotify: true,
    data: {
      clickAction,
      ...payload.data
    },
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(title, notificationOptions);
});

// 2. Notification Click Handler - Focus or Open Window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.clickAction || '/dropshipper/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open, focus it and navigate
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && client.url !== targetUrl) {
            return client.navigate(targetUrl);
          }
          return client;
        }
      }
      // If no tab is open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

