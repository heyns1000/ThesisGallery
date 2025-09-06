import { messaging } from '@/lib/firebase-config';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';

// VAPID key for web push notifications
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'demo-vapid-key';

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private token: string | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  // Initialize Firebase Messaging
  async initialize(): Promise<boolean> {
    if (this.isInitialized || !messaging) {
      return this.isInitialized;
    }

    try {
      // Check if service worker is registered
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase Messaging:', error);
      return false;
    }
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return 'Notification' in window && messaging !== null;
  }

  // Check current permission status
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isNotificationSupported()) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      
      if (permission === 'granted') {
        await this.getRegistrationToken();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Get FCM registration token
  async getRegistrationToken(): Promise<string | null> {
    if (!messaging || !this.isInitialized) {
      console.warn('Firebase Messaging not initialized');
      return null;
    }

    try {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        console.log('FCM Registration Token:', token);
        this.token = token;
        
        // Store token for backend communication
        this.saveTokenToBackend(token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('Error getting registration token:', error);
      return null;
    }
  }

  // Save token to backend for push notifications
  private async saveTokenToBackend(token: string): Promise<void> {
    try {
      await fetch('/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      });
      console.log('Token saved to backend');
    } catch (error) {
      console.error('Error saving token to backend:', error);
    }
  }

  // Listen for foreground messages
  onForegroundMessage(callback: (payload: MessagePayload) => void): void {
    if (!messaging) {
      console.warn('Firebase Messaging not available');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show custom notification for better UX
      this.showCustomNotification({
        title: payload.notification?.title || 'Fruitful Global Hub',
        body: payload.notification?.body || 'New notification',
        icon: payload.notification?.icon || '/icon-192.png',
        data: payload.data
      });

      callback(payload);
    });
  }

  // Show custom notification
  private showCustomNotification(data: NotificationData): void {
    if (!this.isNotificationSupported() || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/badge-72.png',
      data: data.data,
      actions: data.actions,
      requireInteraction: true,
      tag: 'fruitful-global-notification'
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      // Handle click action based on data
      if (data.data?.url) {
        window.open(data.data.url, '_blank');
      }
      
      notification.close();
    };
  }

  // Send personalized notification (for admin use)
  async sendPersonalizedNotification(notification: {
    title: string;
    body: string;
    targetUsers?: string[];
    data?: any;
  }): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/send-personalized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending personalized notification:', error);
      return false;
    }
  }

  // Get current token
  getCurrentToken(): string | null {
    return this.token;
  }

  // Unsubscribe from notifications
  async unsubscribe(): Promise<boolean> {
    try {
      if (this.token) {
        await fetch('/api/notifications/unregister-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: this.token }),
        });
      }
      
      this.token = null;
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  }
}

export const messagingService = FirebaseMessagingService.getInstance();