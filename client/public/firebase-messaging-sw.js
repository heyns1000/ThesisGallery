// Firebase Messaging Service Worker for Fruitful Global Master Hub
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "fruitful-global-hub.firebaseapp.com",
  projectId: "fruitful-global-hub",
  storageBucket: "fruitful-global-hub.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Fruitful Global Hub';
  const notificationOptions = {
    body: payload.notification?.body || 'New notification',
    icon: payload.notification?.icon || '/icon-192.png',
    badge: '/badge-72.png',
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-dismiss.png'
      }
    ],
    requireInteraction: true,
    tag: 'fruitful-notification',
    vibrate: [200, 100, 200]
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  // Handle different actions
  if (event.action === 'view') {
    // Open the app or specific page
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        if (clientList.length > 0) {
          clientList[0].focus();
          return clientList[0].navigate(urlToOpen);
        }
        return clients.openWindow(urlToOpen);
      })
    );
  }
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
  console.log('[firebase-messaging-sw.js] Notification closed:', event.notification.tag);
  
  // Track notification dismissal analytics
  if (event.notification.data?.trackDismissal) {
    // Send analytics event to track user engagement
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: event.notification.data.id,
        timestamp: new Date().toISOString(),
        action: 'dismissed'
      })
    }).catch(error => {
      console.error('Failed to track notification dismissal:', error);
    });
  }
});

// Handle push events for custom processing
self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] Push received:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);
      
      // Custom processing for specific notification types
      if (payload.data?.type === 'abandoned-cart') {
        // Handle abandoned cart notifications with special UI
        const notificationOptions = {
          body: `Don't forget your ${payload.data.itemCount} items! Complete your purchase and support our 140 seedlings.`,
          icon: '/cart-icon.png',
          badge: '/cart-badge.png',
          actions: [
            {
              action: 'complete-purchase',
              title: 'Complete Purchase',
              icon: '/icon-cart.png'
            },
            {
              action: 'save-for-later',
              title: 'Save for Later',
              icon: '/icon-save.png'
            }
          ],
          data: payload.data,
          tag: 'abandoned-cart',
          requireInteraction: true
        };
        
        event.waitUntil(
          self.registration.showNotification('Complete Your Purchase 🛒', notificationOptions)
        );
      } else if (payload.data?.type === 'seedling-milestone') {
        // Handle seedling language learning milestones
        const notificationOptions = {
          body: `🌱 ${payload.data.seedlingId} just mastered "${payload.data.language}"! Celebrate their kindness journey.`,
          icon: '/seedling-icon.png',
          badge: '/seedling-badge.png',
          actions: [
            {
              action: 'view-progress',
              title: 'View Progress',
              icon: '/icon-progress.png'
            },
            {
              action: 'celebrate',
              title: 'Celebrate! 🎉',
              icon: '/icon-celebrate.png'
            }
          ],
          data: payload.data,
          tag: 'seedling-milestone',
          vibrate: [200, 100, 200, 100, 200]
        };
        
        event.waitUntil(
          self.registration.showNotification('Seedling Achievement! 🌱', notificationOptions)
        );
      }
    } catch (error) {
      console.error('Error processing push event:', error);
    }
  }
});