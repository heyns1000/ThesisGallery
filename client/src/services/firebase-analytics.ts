import { analytics } from '@/lib/firebase-config';
import { logEvent, setUserProperties, setUserId, CustomParameters } from 'firebase/analytics';

export interface AnalyticsEvent {
  name: string;
  parameters?: CustomParameters;
}

export interface UserProperties {
  [key: string]: string | number | boolean;
}

export class FirebaseAnalyticsService {
  private static instance: FirebaseAnalyticsService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): FirebaseAnalyticsService {
    if (!FirebaseAnalyticsService.instance) {
      FirebaseAnalyticsService.instance = new FirebaseAnalyticsService();
    }
    return FirebaseAnalyticsService.instance;
  }

  // Initialize analytics
  initialize(): boolean {
    if (!analytics) {
      console.warn('Firebase Analytics not available');
      return false;
    }
    
    this.isInitialized = true;
    console.log('Firebase Analytics initialized');
    return true;
  }

  // Set user ID for tracking
  setUser(userId: string): void {
    if (!this.isInitialized || !analytics) return;
    
    try {
      setUserId(analytics, userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Set user properties
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized || !analytics) return;
    
    try {
      setUserProperties(analytics, properties);
      console.log('User properties set:', properties);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Log custom event
  logCustomEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || !analytics) return;
    
    try {
      logEvent(analytics, event.name, event.parameters);
      console.log('Event logged:', event);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  // Track page views
  trackPageView(page: string, title?: string): void {
    this.logCustomEvent({
      name: 'page_view',
      parameters: {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: page
      }
    });
  }

  // Track seedling language learning events
  trackSeedlingLearning(seedlingId: string, languageCode: string, action: 'practice' | 'mastery' | 'session_start'): void {
    this.logCustomEvent({
      name: 'seedling_learning',
      parameters: {
        seedling_id: seedlingId,
        language_code: languageCode,
        action: action,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track language learning milestones
  trackLanguageMilestone(seedlingId: string, languageCode: string, milestone: 'first_word' | 'kindness_mastery' | 'cultural_understanding'): void {
    this.logCustomEvent({
      name: 'language_milestone',
      parameters: {
        seedling_id: seedlingId,
        language_code: languageCode,
        milestone_type: milestone,
        achievement_time: new Date().toISOString()
      }
    });
  }

  // Track Banimal platform interactions
  trackBanimalInteraction(action: 'product_view' | 'add_to_cart' | 'purchase' | 'search', productId?: string, value?: number): void {
    this.logCustomEvent({
      name: 'banimal_interaction',
      parameters: {
        action: action,
        product_id: productId,
        value: value,
        currency: 'USD'
      }
    });
  }

  // Track abandoned cart events
  trackAbandonedCart(cartValue: number, itemCount: number, timeSpent: number): void {
    this.logCustomEvent({
      name: 'abandoned_cart',
      parameters: {
        cart_value: cartValue,
        item_count: itemCount,
        time_spent_minutes: timeSpent,
        abandonment_time: new Date().toISOString()
      }
    });
  }

  // Track push notification interactions
  trackNotificationInteraction(action: 'received' | 'clicked' | 'dismissed', notificationType: string): void {
    this.logCustomEvent({
      name: 'notification_interaction',
      parameters: {
        action: action,
        notification_type: notificationType,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track user engagement across the platform
  trackUserEngagement(section: string, duration: number, interactionCount: number): void {
    this.logCustomEvent({
      name: 'user_engagement',
      parameters: {
        section: section,
        engagement_duration: duration,
        interaction_count: interactionCount,
        engagement_score: Math.min(100, (duration / 60) + (interactionCount * 5))
      }
    });
  }

  // Track ecosystem feature usage
  trackEcosystemFeature(feature: 'wildlife_dashboard' | 'mining_platform' | 'education_sector' | 'ai_logic_grid', action: string): void {
    this.logCustomEvent({
      name: 'ecosystem_feature_usage',
      parameters: {
        feature_name: feature,
        action: action,
        usage_time: new Date().toISOString()
      }
    });
  }

  // Track conversion events for business analytics
  trackConversion(conversionType: 'subscription' | 'purchase' | 'lead' | 'registration', value?: number): void {
    this.logCustomEvent({
      name: 'conversion',
      parameters: {
        conversion_type: conversionType,
        conversion_value: value || 0,
        currency: 'USD',
        conversion_time: new Date().toISOString()
      }
    });
  }

  // Track search behavior
  trackSearch(searchTerm: string, category?: string, resultsCount?: number): void {
    this.logCustomEvent({
      name: 'search',
      parameters: {
        search_term: searchTerm,
        search_category: category,
        results_count: resultsCount || 0
      }
    });
  }

  // Track file uploads and document processing
  trackDocumentProcessing(documentType: string, processingTime: number, success: boolean): void {
    this.logCustomEvent({
      name: 'document_processing',
      parameters: {
        document_type: documentType,
        processing_time_ms: processingTime,
        processing_success: success
      }
    });
  }

  // Track AI conversation quality
  trackAIConversation(provider: 'anthropic' | 'gemini', messageCount: number, satisfaction?: number): void {
    this.logCustomEvent({
      name: 'ai_conversation',
      parameters: {
        ai_provider: provider,
        message_count: messageCount,
        satisfaction_score: satisfaction,
        conversation_length: messageCount > 10 ? 'long' : messageCount > 3 ? 'medium' : 'short'
      }
    });
  }

  // Custom tracking for Fruitful Global specific metrics
  trackFruitfulMetric(metricName: string, value: number, context?: string): void {
    this.logCustomEvent({
      name: 'fruitful_metric',
      parameters: {
        metric_name: metricName,
        metric_value: value,
        metric_context: context,
        recorded_at: new Date().toISOString()
      }
    });
  }

  // Track AdMob advertising interactions and revenue
  trackAdMobEvent(adType: 'banner' | 'interstitial' | 'rewarded' | 'native', action: 'loaded' | 'shown' | 'clicked' | 'dismissed' | 'reward_earned', revenue?: number): void {
    this.logCustomEvent({
      name: 'admob_interaction',
      parameters: {
        ad_type: adType,
        action: action,
        revenue: revenue || 0,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track AdMob revenue metrics
  trackAdMobRevenue(dailyRevenue: number, totalRevenue: number, impressions: number, ctr: number): void {
    this.logCustomEvent({
      name: 'admob_revenue_metrics',
      parameters: {
        daily_revenue: dailyRevenue,
        total_revenue: totalRevenue,
        total_impressions: impressions,
        click_through_rate: ctr,
        recorded_date: new Date().toISOString().split('T')[0]
      }
    });
  }

  // Track Firebase push notification events with enhanced metrics
  trackPushNotificationEvent(action: 'permission_requested' | 'permission_granted' | 'permission_denied' | 'token_generated' | 'notification_sent' | 'notification_opened' | 'notification_dismissed', details?: any): void {
    this.logCustomEvent({
      name: 'push_notification_event',
      parameters: {
        action: action,
        notification_details: details ? JSON.stringify(details).substring(0, 100) : '',
        user_agent: navigator.userAgent.substring(0, 100),
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track abandoned cart recovery success
  trackAbandonedCartRecovery(cartValue: number, remindersSent: number, recoveryMethod: 'push_notification' | 'email' | 'sms'): void {
    this.logCustomEvent({
      name: 'abandoned_cart_recovery',
      parameters: {
        cart_value: cartValue,
        reminders_sent: remindersSent,
        recovery_method: recoveryMethod,
        recovery_time: new Date().toISOString()
      }
    });
  }

  // Track seedling language learning achievements with enhanced details
  trackSeedlingAchievement(seedlingId: string, languageCode: string, achievement: 'first_word' | 'kindness_mastery' | 'cultural_wisdom' | 'daily_practice', streak?: number): void {
    this.logCustomEvent({
      name: 'seedling_achievement',
      parameters: {
        seedling_id: seedlingId,
        language_code: languageCode,
        achievement_type: achievement,
        practice_streak: streak || 0,
        achievement_date: new Date().toISOString()
      }
    });
  }

  // Track comprehensive user session data
  trackUserSession(sessionData: {
    sessionDuration: number;
    pagesViewed: number;
    featuresUsed: string[];
    deviceType: string;
    connection: string;
  }): void {
    this.logCustomEvent({
      name: 'user_session_summary',
      parameters: {
        session_duration: sessionData.sessionDuration,
        pages_viewed: sessionData.pagesViewed,
        features_used: sessionData.featuresUsed.join(','),
        device_type: sessionData.deviceType,
        connection_type: sessionData.connection,
        session_end_time: new Date().toISOString()
      }
    });
  }

  // Track performance metrics for the platform
  trackPerformanceMetrics(metrics: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorCount: number;
    feature: string;
  }): void {
    this.logCustomEvent({
      name: 'performance_metrics',
      parameters: {
        page_load_time: metrics.pageLoadTime,
        api_response_time: metrics.apiResponseTime,
        error_count: metrics.errorCount,
        feature_name: metrics.feature,
        recorded_at: new Date().toISOString()
      }
    });
  }
}

export const analyticsService = FirebaseAnalyticsService.getInstance();