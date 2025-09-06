import { firebaseAdmin } from './firebase-admin';
import { storage } from './storage';
import cron from 'node-cron';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    lastLogin?: number; // days ago
    activityLevel?: 'low' | 'medium' | 'high';
    features?: string[];
    interests?: string[];
    preferences?: Record<string, boolean>;
  };
  tokens: string[];
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  segment: string;
  scheduleType: 'immediate' | 'daily' | 'weekly' | 'monthly';
  scheduledAt: Date;
  data?: Record<string, string>;
  status: 'pending' | 'sent' | 'failed';
}

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  private userSegments: Map<string, UserSegment> = new Map();
  private isRunning = false;

  private constructor() {
    this.initializeDefaultSegments();
  }

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  // Initialize default user segments
  private initializeDefaultSegments(): void {
    const defaultSegments: UserSegment[] = [
      {
        id: 'seedling_enthusiasts',
        name: 'Seedling Enthusiasts',
        description: 'Users actively engaged with seedling language learning',
        criteria: {
          lastLogin: 7,
          activityLevel: 'high',
          features: ['seedling-language-learning'],
          interests: ['language-learning', 'seedlings']
        },
        tokens: []
      },
      {
        id: 'banimal_shoppers',
        name: 'Banimal Shoppers',
        description: 'Users who have shown interest in Banimal products',
        criteria: {
          lastLogin: 14,
          activityLevel: 'medium',
          features: ['banimal-platform'],
          interests: ['shopping', 'products']
        },
        tokens: []
      },
      {
        id: 'ecosystem_explorers',
        name: 'Ecosystem Explorers',
        description: 'Users exploring multiple areas of the platform',
        criteria: {
          lastLogin: 30,
          activityLevel: 'medium',
          features: ['global-view', 'wildlife-dashboard', 'education-dashboard'],
          interests: ['ecosystem', 'exploration']
        },
        tokens: []
      },
      {
        id: 'inactive_users',
        name: 'Inactive Users',
        description: 'Users who haven\'t been active recently',
        criteria: {
          lastLogin: 30,
          activityLevel: 'low'
        },
        tokens: []
      },
      {
        id: 'power_users',
        name: 'Power Users',
        description: 'Highly engaged users across multiple features',
        criteria: {
          lastLogin: 3,
          activityLevel: 'high',
          features: ['multiple']
        },
        tokens: []
      }
    ];

    defaultSegments.forEach(segment => {
      this.userSegments.set(segment.id, segment);
    });
  }

  // Start the notification scheduler
  start(): void {
    if (this.isRunning) {
      console.log('Notification scheduler already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting notification scheduler...');

    // Schedule personalized notifications every hour
    cron.schedule('0 * * * *', () => {
      this.processPersonalizedNotifications();
    });

    // Schedule daily seedling progress notifications at 9 AM
    cron.schedule('0 9 * * *', () => {
      this.sendSeedlingProgressNotifications();
    });

    // Schedule weekly ecosystem updates on Mondays at 10 AM
    cron.schedule('0 10 * * 1', () => {
      this.sendWeeklyEcosystemUpdates();
    });

    // Schedule abandoned cart reminders every 2 hours during business hours
    cron.schedule('0 */2 9-18 * * *', () => {
      this.processAbandonedCartReminders();
    });

    // Schedule re-engagement campaigns for inactive users daily at 3 PM
    cron.schedule('0 15 * * *', () => {
      this.sendReEngagementNotifications();
    });

    console.log('Notification scheduler started successfully');
  }

  // Stop the scheduler
  stop(): void {
    this.isRunning = false;
    console.log('Notification scheduler stopped');
  }

  // Add user to segment based on behavior
  addUserToSegment(userId: string, token: string, behavior: {
    lastLogin: Date;
    visitedFeatures: string[];
    activityLevel: 'low' | 'medium' | 'high';
    preferences?: Record<string, boolean>;
  }): void {
    const daysSinceLogin = Math.floor((Date.now() - behavior.lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    // Determine which segments the user belongs to
    this.userSegments.forEach(segment => {
      let matches = true;

      // Check login recency
      if (segment.criteria.lastLogin && daysSinceLogin > segment.criteria.lastLogin) {
        matches = false;
      }

      // Check activity level
      if (segment.criteria.activityLevel && behavior.activityLevel !== segment.criteria.activityLevel) {
        matches = false;
      }

      // Check feature usage
      if (segment.criteria.features) {
        const hasRequiredFeatures = segment.criteria.features.some(feature => 
          feature === 'multiple' ? 
            behavior.visitedFeatures.length >= 3 : 
            behavior.visitedFeatures.includes(feature)
        );
        if (!hasRequiredFeatures) {
          matches = false;
        }
      }

      if (matches) {
        // Add user token to segment if not already present
        if (!segment.tokens.includes(token)) {
          segment.tokens.push(token);
          console.log(`Added user ${userId} to segment: ${segment.name}`);
        }
      } else {
        // Remove user token from segment if present
        const tokenIndex = segment.tokens.indexOf(token);
        if (tokenIndex > -1) {
          segment.tokens.splice(tokenIndex, 1);
          console.log(`Removed user ${userId} from segment: ${segment.name}`);
        }
      }
    });
  }

  // Process personalized notifications based on user behavior
  private async processPersonalizedNotifications(): Promise<void> {
    console.log('Processing personalized notifications...');

    try {
      // Send notifications to seedling enthusiasts about new languages
      const seedlingSegment = this.userSegments.get('seedling_enthusiasts');
      if (seedlingSegment && seedlingSegment.tokens.length > 0) {
        await firebaseAdmin.sendPersonalizedNotification(
          'seedling_learners',
          {
            title: '🌱 New Language Adventure Awaits!',
            body: 'Discover new kindness expressions with our seedlings. Today\'s featured languages: Swahili and Portuguese! 🌍',
            icon: '/seedling-icon.png',
            clickAction: '/seedling-language-learning',
            data: {
              type: 'language_discovery',
              featured_languages: 'swahili,portuguese',
              campaign: 'daily_language_discovery'
            }
          }
        );
      }

      // Send ecosystem updates to explorers
      const explorerSegment = this.userSegments.get('ecosystem_explorers');
      if (explorerSegment && explorerSegment.tokens.length > 0) {
        await firebaseAdmin.sendPersonalizedNotification(
          'ecosystem_users',
          {
            title: '🌍 Ecosystem Growth Update',
            body: 'Our global network now spans 45 wildlife nodes and 13 US states! Explore the latest developments.',
            icon: '/ecosystem-icon.png',
            clickAction: '/global-view',
            data: {
              type: 'ecosystem_update',
              stats: 'wildlife_nodes:45,us_states:13',
              campaign: 'ecosystem_growth'
            }
          }
        );
      }

    } catch (error) {
      console.error('Error processing personalized notifications:', error);
    }
  }

  // Send daily seedling progress notifications
  private async sendSeedlingProgressNotifications(): Promise<void> {
    console.log('Sending daily seedling progress notifications...');

    try {
      // Get random seedling achievements (simulated)
      const achievements = [
        {
          seedlingId: 'Seedling-042',
          language: 'Afrikaans',
          milestone: 'kindness_mastery' as const
        },
        {
          seedlingId: 'Seedling-098',
          language: 'Mandarin',
          milestone: 'first_word' as const
        },
        {
          seedlingId: 'Seedling-156',
          language: 'Spanish',
          milestone: 'cultural_understanding' as const
        }
      ];

      const seedlingSegment = this.userSegments.get('seedling_enthusiasts');
      if (seedlingSegment && seedlingSegment.tokens.length > 0) {
        for (const achievement of achievements) {
          await firebaseAdmin.sendSeedlingMilestoneNotification(
            seedlingSegment.tokens,
            achievement
          );
        }
      }

    } catch (error) {
      console.error('Error sending seedling progress notifications:', error);
    }
  }

  // Send weekly ecosystem updates
  private async sendWeeklyEcosystemUpdates(): Promise<void> {
    console.log('Sending weekly ecosystem updates...');

    try {
      await firebaseAdmin.sendToTopic(
        'ecosystem_users',
        {
          title: '📊 Weekly Ecosystem Report',
          body: 'This week: 15 new seedling achievements, 3 wildlife nodes activated, and 1,247 kindness expressions learned! 🎉',
          icon: '/weekly-report-icon.png',
          clickAction: '/global-view',
          data: {
            type: 'weekly_report',
            week: new Date().toISOString().slice(0, 10),
            achievements: '15',
            nodes: '3',
            expressions: '1247'
          }
        }
      );

    } catch (error) {
      console.error('Error sending weekly ecosystem updates:', error);
    }
  }

  // Process abandoned cart reminders
  private async processAbandonedCartReminders(): Promise<void> {
    console.log('Processing abandoned cart reminders...');

    try {
      // This would typically fetch from your database
      // For now, we'll simulate some abandoned carts
      const abandonedCarts = [
        {
          userToken: 'sample-token-1',
          cartData: {
            itemCount: 3,
            totalValue: 89.97,
            cartId: 'cart-12345',
            customerName: 'John Doe'
          }
        }
      ];

      for (const cart of abandonedCarts) {
        await firebaseAdmin.sendAbandonedCartNotification(
          cart.userToken,
          cart.cartData
        );
      }

    } catch (error) {
      console.error('Error processing abandoned cart reminders:', error);
    }
  }

  // Send re-engagement notifications to inactive users
  private async sendReEngagementNotifications(): Promise<void> {
    console.log('Sending re-engagement notifications...');

    try {
      const inactiveSegment = this.userSegments.get('inactive_users');
      if (inactiveSegment && inactiveSegment.tokens.length > 0) {
        await firebaseAdmin.sendToMultipleDevices(
          inactiveSegment.tokens,
          {
            title: '🌱 Your Seedlings Miss You!',
            body: 'Come back and see how our 140 seedlings have grown! New languages and achievements are waiting for you. 💚',
            icon: '/welcome-back-icon.png',
            clickAction: '/',
            data: {
              type: 're_engagement',
              campaign: 'comeback_seedlings',
              incentive: 'progress_highlight'
            }
          }
        );
      }

    } catch (error) {
      console.error('Error sending re-engagement notifications:', error);
    }
  }

  // Schedule a custom notification
  scheduleNotification(notification: Omit<ScheduledNotification, 'id' | 'status'>): string {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledNotification: ScheduledNotification = {
      ...notification,
      id,
      status: 'pending'
    };

    this.scheduledNotifications.set(id, scheduledNotification);
    console.log(`Scheduled notification: ${id} for segment: ${notification.segment}`);

    return id;
  }

  // Get segment statistics
  getSegmentStats(): Record<string, { name: string; userCount: number; description: string }> {
    const stats: Record<string, { name: string; userCount: number; description: string }> = {};

    this.userSegments.forEach((segment, id) => {
      stats[id] = {
        name: segment.name,
        userCount: segment.tokens.length,
        description: segment.description
      };
    });

    return stats;
  }

  // Get scheduled notifications
  getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  // Cancel scheduled notification
  cancelNotification(notificationId: string): boolean {
    return this.scheduledNotifications.delete(notificationId);
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();