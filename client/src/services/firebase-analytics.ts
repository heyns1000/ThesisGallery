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
}

export const analyticsService = FirebaseAnalyticsService.getInstance();