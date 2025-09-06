import admin from 'firebase-admin';
import { getMessaging, Message, MulticastMessage, BatchResponse } from 'firebase-admin/messaging';

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "fruitful-global-hub",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "demo-key-id",
  private_key: (process.env.FIREBASE_PRIVATE_KEY || "demo-private-key").replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@fruitful-global-hub.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "123456789012345678901",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40fruitful-global-hub.iam.gserviceaccount.com"
};

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || "fruitful-global-hub"
  });
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  clickAction?: string;
  data?: { [key: string]: string };
}

export interface PushNotificationTarget {
  token?: string;
  tokens?: string[];
  topic?: string;
  condition?: string;
}

export class FirebaseAdminService {
  private static instance: FirebaseAdminService;
  private messaging = getMessaging();

  private constructor() {}

  static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService();
    }
    return FirebaseAdminService.instance;
  }

  // Send notification to single device
  async sendToDevice(token: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const message: Message = {
        token: token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.icon
        },
        data: payload.data || {},
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/badge-72.png',
            clickAction: payload.clickAction,
            requireInteraction: true,
            tag: 'fruitful-notification'
          },
          fcmOptions: {
            link: payload.clickAction || '/'
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent message:', response);
      return true;
    } catch (error) {
      console.error('Error sending message to device:', error);
      return false;
    }
  }

  // Send notification to multiple devices
  async sendToMultipleDevices(tokens: string[], payload: NotificationPayload): Promise<BatchResponse> {
    try {
      const message: MulticastMessage = {
        tokens: tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.icon
        },
        data: payload.data || {},
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/badge-72.png',
            clickAction: payload.clickAction,
            requireInteraction: true,
            tag: 'fruitful-notification'
          },
          fcmOptions: {
            link: payload.clickAction || '/'
          }
        }
      };

      const response = await this.messaging.sendEachForMulticast(message);
      console.log('Successfully sent multicast message:', response);
      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }

  // Send notification to topic subscribers
  async sendToTopic(topic: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const message: Message = {
        topic: topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.icon
        },
        data: payload.data || {},
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/badge-72.png',
            clickAction: payload.clickAction,
            requireInteraction: true,
            tag: 'fruitful-notification'
          },
          fcmOptions: {
            link: payload.clickAction || '/'
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent topic message:', response);
      return true;
    } catch (error) {
      console.error('Error sending topic message:', error);
      return false;
    }
  }

  // Send personalized notification based on user segments
  async sendPersonalizedNotification(
    userSegment: 'seedling_learners' | 'banimal_customers' | 'ecosystem_users' | 'all_users',
    payload: NotificationPayload,
    customData?: { [key: string]: string }
  ): Promise<boolean> {
    try {
      const message: Message = {
        condition: this.getConditionForSegment(userSegment),
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.icon
        },
        data: {
          ...payload.data,
          ...customData,
          segment: userSegment,
          sent_at: new Date().toISOString()
        },
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/badge-72.png',
            clickAction: payload.clickAction,
            requireInteraction: true,
            tag: `fruitful-${userSegment}`
          },
          fcmOptions: {
            link: payload.clickAction || '/'
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log(`Successfully sent personalized message to ${userSegment}:`, response);
      return true;
    } catch (error) {
      console.error(`Error sending personalized message to ${userSegment}:`, error);
      return false;
    }
  }

  // Send abandoned cart notification
  async sendAbandonedCartNotification(
    userToken: string,
    cartData: {
      itemCount: number;
      totalValue: number;
      cartId: string;
      customerName?: string;
    }
  ): Promise<boolean> {
    const payload: NotificationPayload = {
      title: '🛒 Don\'t forget your items!',
      body: `You have ${cartData.itemCount} items waiting in your cart. Complete your purchase to support our 140 seedlings! 🌱`,
      icon: '/cart-icon.png',
      badge: '/cart-badge.png',
      clickAction: `/banimal-platform?cart=${cartData.cartId}`,
      data: {
        type: 'abandoned_cart',
        cart_id: cartData.cartId,
        item_count: cartData.itemCount.toString(),
        total_value: cartData.totalValue.toString(),
        customer_name: cartData.customerName || '',
        notification_time: new Date().toISOString()
      }
    };

    return await this.sendToDevice(userToken, payload);
  }

  // Send seedling milestone notification
  async sendSeedlingMilestoneNotification(
    tokens: string[],
    seedlingData: {
      seedlingId: string;
      language: string;
      milestone: 'first_word' | 'kindness_mastery' | 'cultural_understanding';
    }
  ): Promise<BatchResponse> {
    const milestoneMessages = {
      first_word: `just learned their first kindness words in ${seedlingData.language}! 🌟`,
      kindness_mastery: `has mastered kindness expressions in ${seedlingData.language}! 💝`,
      cultural_understanding: `now understands the cultural wisdom of ${seedlingData.language}! 🌍`
    };

    const payload: NotificationPayload = {
      title: `🌱 ${seedlingData.seedlingId} Achievement!`,
      body: `${seedlingData.seedlingId} ${milestoneMessages[seedlingData.milestone]}`,
      icon: '/seedling-icon.png',
      badge: '/seedling-badge.png',
      clickAction: `/seedling-language-learning?seedling=${seedlingData.seedlingId}`,
      data: {
        type: 'seedling_milestone',
        seedling_id: seedlingData.seedlingId,
        language: seedlingData.language,
        milestone: seedlingData.milestone,
        achievement_time: new Date().toISOString()
      }
    };

    return await this.sendToMultipleDevices(tokens, payload);
  }

  // Send push permission reminder
  async sendPermissionReminder(userToken: string, userName?: string): Promise<boolean> {
    const payload: NotificationPayload = {
      title: '🔔 Stay Connected with Our Seedlings',
      body: `${userName ? `Hi ${userName}! ` : ''}Enable notifications to get updates on seedling progress, ecosystem news, and special offers from our global family! 🌍💚`,
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      clickAction: '/notifications/settings',
      data: {
        type: 'permission_reminder',
        user_name: userName || '',
        reminder_time: new Date().toISOString()
      }
    };

    return await this.sendToDevice(userToken, payload);
  }

  // Subscribe user to topic
  async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    try {
      const response = await this.messaging.subscribeToTopic(tokens, topic);
      console.log('Successfully subscribed to topic:', response);
      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  // Unsubscribe user from topic
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    try {
      const response = await this.messaging.unsubscribeFromTopic(tokens, topic);
      console.log('Successfully unsubscribed from topic:', response);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }

  // Helper method to get condition for user segments
  private getConditionForSegment(segment: string): string {
    const conditions = {
      seedling_learners: "'seedling_learners' in topics",
      banimal_customers: "'banimal_customers' in topics",
      ecosystem_users: "'ecosystem_users' in topics",
      all_users: "'all_users' in topics"
    };

    return conditions[segment as keyof typeof conditions] || "'all_users' in topics";
  }

  // Validate FCM token
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.messaging.send({
        token: token,
        data: { test: 'true' }
      }, true); // dry run
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
}

export const firebaseAdmin = FirebaseAdminService.getInstance();