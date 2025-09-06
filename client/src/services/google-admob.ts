interface AdMobConfig {
  appId: string;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  nativeAdUnitId: string;
  testDeviceIds?: string[];
  isTestMode: boolean;
}

interface AdRequest {
  keywords?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  contentUrl?: string;
  neighboringContentUrls?: string[];
  nonPersonalizedAds?: boolean;
}

interface AdLoadOptions {
  timeout?: number;
  retryCount?: number;
  fallbackEnabled?: boolean;
}

interface AdMetrics {
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number; // Click-through rate
  ecpm: number; // Effective cost per mille
  fillRate: number;
}

export class GoogleAdMobService {
  private static instance: GoogleAdMobService;
  private isInitialized = false;
  private config: AdMobConfig;
  private loadedAds: Map<string, any> = new Map();
  private adMetrics: Map<string, AdMetrics> = new Map();

  private constructor() {
    this.config = {
      appId: import.meta.env.VITE_ADMOB_APP_ID || 'demo-app-id',
      bannerAdUnitId: import.meta.env.VITE_ADMOB_BANNER_UNIT_ID || 'ca-app-pub-3940256099942544/6300978111', // Test banner
      interstitialAdUnitId: import.meta.env.VITE_ADMOB_INTERSTITIAL_UNIT_ID || 'ca-app-pub-3940256099942544/1033173712', // Test interstitial
      rewardedAdUnitId: import.meta.env.VITE_ADMOB_REWARDED_UNIT_ID || 'ca-app-pub-3940256099942544/5224354917', // Test rewarded
      nativeAdUnitId: import.meta.env.VITE_ADMOB_NATIVE_UNIT_ID || 'ca-app-pub-3940256099942544/2247696110', // Test native
      testDeviceIds: [
        'YOUR_TEST_DEVICE_ID_HERE',
        '33BE2250B43518CCDA7DE426D04EE231' // Example test device ID
      ],
      isTestMode: import.meta.env.NODE_ENV === 'development' || import.meta.env.VITE_ADMOB_TEST_MODE === 'true'
    };
  }

  static getInstance(): GoogleAdMobService {
    if (!GoogleAdMobService.instance) {
      GoogleAdMobService.instance = new GoogleAdMobService();
    }
    return GoogleAdMobService.instance;
  }

  // Initialize AdMob (web implementation simulation)
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      console.log('Initializing Google AdMob for Fruitful Global Hub...');
      
      // Simulate AdMob initialization for web
      // In a real mobile app, this would use the actual AdMob SDK
      
      if (this.config.isTestMode) {
        console.log('AdMob running in test mode');
        console.log('Test Banner Unit ID:', this.config.bannerAdUnitId);
        console.log('Test Interstitial Unit ID:', this.config.interstitialAdUnitId);
      }

      // Initialize ad metrics tracking
      this.initializeMetricsTracking();
      
      // Simulate successful initialization
      this.isInitialized = true;
      console.log('Google AdMob initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      return false;
    }
  }

  // Load banner ad
  async loadBannerAd(
    containerId: string, 
    size: 'banner' | 'large_banner' | 'medium_rectangle' | 'full_banner' | 'leaderboard' = 'banner',
    adRequest?: AdRequest,
    options?: AdLoadOptions
  ): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('AdMob not initialized. Call initialize() first.');
      return false;
    }

    try {
      console.log(`Loading banner ad in container: ${containerId}`);
      
      // Simulate ad loading
      const adKey = `banner_${containerId}`;
      
      // Create banner ad placeholder for web
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return false;
      }

      // Create ad placeholder
      const adElement = this.createAdPlaceholder('banner', size);
      container.appendChild(adElement);
      
      // Store loaded ad reference
      this.loadedAds.set(adKey, {
        type: 'banner',
        containerId,
        size,
        element: adElement,
        loadedAt: new Date(),
        isVisible: true
      });

      // Track ad load
      this.trackAdEvent('banner', 'loaded');
      
      // Simulate ad impression after 1 second
      setTimeout(() => {
        this.trackAdEvent('banner', 'impression');
      }, 1000);

      return true;
    } catch (error) {
      console.error('Failed to load banner ad:', error);
      return false;
    }
  }

  // Load interstitial ad
  async loadInterstitialAd(adRequest?: AdRequest, options?: AdLoadOptions): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('AdMob not initialized. Call initialize() first.');
      return false;
    }

    try {
      console.log('Loading interstitial ad...');
      
      // Simulate loading time
      await this.simulateAdLoadDelay();
      
      // Store loaded interstitial
      this.loadedAds.set('interstitial', {
        type: 'interstitial',
        loadedAt: new Date(),
        isReady: true
      });

      this.trackAdEvent('interstitial', 'loaded');
      console.log('Interstitial ad loaded and ready to show');
      
      return true;
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
      return false;
    }
  }

  // Show interstitial ad
  async showInterstitialAd(): Promise<boolean> {
    const ad = this.loadedAds.get('interstitial');
    if (!ad || !ad.isReady) {
      console.warn('No interstitial ad ready to show');
      return false;
    }

    try {
      console.log('Showing interstitial ad...');
      
      // Create full-screen interstitial overlay
      const overlay = this.createInterstitialOverlay();
      document.body.appendChild(overlay);
      
      // Track impression
      this.trackAdEvent('interstitial', 'impression');
      
      // Remove ad after 5 seconds (simulated)
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          this.trackAdEvent('interstitial', 'closed');
        }
      }, 5000);

      // Mark as used
      this.loadedAds.delete('interstitial');
      
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  // Load rewarded ad
  async loadRewardedAd(adRequest?: AdRequest, options?: AdLoadOptions): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('AdMob not initialized. Call initialize() first.');
      return false;
    }

    try {
      console.log('Loading rewarded ad...');
      
      await this.simulateAdLoadDelay();
      
      this.loadedAds.set('rewarded', {
        type: 'rewarded',
        loadedAt: new Date(),
        isReady: true,
        rewardAmount: 10, // Simulate reward amount
        rewardType: 'seedling_coins'
      });

      this.trackAdEvent('rewarded', 'loaded');
      console.log('Rewarded ad loaded and ready to show');
      
      return true;
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
      return false;
    }
  }

  // Show rewarded ad
  async showRewardedAd(onRewarded?: (reward: { amount: number; type: string }) => void): Promise<boolean> {
    const ad = this.loadedAds.get('rewarded');
    if (!ad || !ad.isReady) {
      console.warn('No rewarded ad ready to show');
      return false;
    }

    try {
      console.log('Showing rewarded ad...');
      
      // Create rewarded ad overlay
      const overlay = this.createRewardedAdOverlay();
      document.body.appendChild(overlay);
      
      this.trackAdEvent('rewarded', 'impression');
      
      // Simulate watching the full ad
      const watchDuration = 30; // 30 seconds
      let timeLeft = watchDuration;
      
      const timer = setInterval(() => {
        timeLeft--;
        const progressElement = overlay.querySelector('.ad-progress');
        if (progressElement) {
          progressElement.textContent = `Watch for ${timeLeft}s to earn rewards!`;
        }
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          
          // Grant reward
          const reward = {
            amount: ad.rewardAmount,
            type: ad.rewardType
          };
          
          if (onRewarded) {
            onRewarded(reward);
          }
          
          this.trackAdEvent('rewarded', 'completed');
          this.trackAdEvent('rewarded', 'rewarded');
          
          // Show reward notification
          this.showRewardNotification(reward);
          
          // Remove overlay
          setTimeout(() => {
            if (document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
          }, 2000);
        }
      }, 1000);

      // Mark as used
      this.loadedAds.delete('rewarded');
      
      return true;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }

  // Load native ad
  async loadNativeAd(containerId: string, adRequest?: AdRequest, options?: AdLoadOptions): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('AdMob not initialized. Call initialize() first.');
      return false;
    }

    try {
      console.log(`Loading native ad in container: ${containerId}`);
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return false;
      }

      await this.simulateAdLoadDelay();
      
      // Create native ad content
      const nativeAdElement = this.createNativeAdContent();
      container.appendChild(nativeAdElement);
      
      this.loadedAds.set(`native_${containerId}`, {
        type: 'native',
        containerId,
        element: nativeAdElement,
        loadedAt: new Date(),
        isVisible: true
      });

      this.trackAdEvent('native', 'loaded');
      
      // Track impression after a delay
      setTimeout(() => {
        this.trackAdEvent('native', 'impression');
      }, 1500);

      return true;
    } catch (error) {
      console.error('Failed to load native ad:', error);
      return false;
    }
  }

  // Get ad metrics
  getAdMetrics(adType?: string): AdMetrics | Record<string, AdMetrics> {
    if (adType) {
      return this.adMetrics.get(adType) || this.getDefaultMetrics();
    }
    
    const allMetrics: Record<string, AdMetrics> = {};
    this.adMetrics.forEach((metrics, type) => {
      allMetrics[type] = metrics;
    });
    
    return allMetrics;
  }

  // Get revenue summary
  getRevenueSummary(): {
    totalRevenue: number;
    dailyRevenue: number;
    topPerformingAdType: string;
    overallCTR: number;
    totalImpressions: number;
  } {
    let totalRevenue = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let topPerformingAdType = 'banner';
    let highestRevenue = 0;

    this.adMetrics.forEach((metrics, adType) => {
      totalRevenue += metrics.revenue;
      totalImpressions += metrics.impressions;
      totalClicks += metrics.clicks;
      
      if (metrics.revenue > highestRevenue) {
        highestRevenue = metrics.revenue;
        topPerformingAdType = adType;
      }
    });

    return {
      totalRevenue,
      dailyRevenue: totalRevenue * 0.15, // Simulate daily revenue
      topPerformingAdType,
      overallCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      totalImpressions
    };
  }

  // Private helper methods

  private initializeMetricsTracking(): void {
    const adTypes = ['banner', 'interstitial', 'rewarded', 'native'];
    adTypes.forEach(adType => {
      this.adMetrics.set(adType, this.getDefaultMetrics());
    });
  }

  private getDefaultMetrics(): AdMetrics {
    return {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      ecpm: 0,
      fillRate: 95.5 // Default fill rate
    };
  }

  private trackAdEvent(adType: string, event: 'loaded' | 'impression' | 'click' | 'closed' | 'completed' | 'rewarded'): void {
    const metrics = this.adMetrics.get(adType) || this.getDefaultMetrics();
    
    switch (event) {
      case 'impression':
        metrics.impressions++;
        metrics.revenue += this.calculateRevenue(adType);
        break;
      case 'click':
        metrics.clicks++;
        break;
    }
    
    // Update CTR and eCPM
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    metrics.ecpm = metrics.impressions > 0 ? (metrics.revenue / metrics.impressions) * 1000 : 0;
    
    this.adMetrics.set(adType, metrics);
    
    console.log(`AdMob Event: ${adType} ${event}`);
    
    // Send analytics to backend
    this.sendAdAnalytics(adType, event, metrics);
  }

  private calculateRevenue(adType: string): number {
    // Simulate revenue per impression (eCPM)
    const ecpmRates = {
      banner: 0.50,
      interstitial: 3.00,
      rewarded: 5.00,
      native: 1.20
    };
    
    return (ecpmRates[adType as keyof typeof ecpmRates] || 0.50) / 1000;
  }

  private async sendAdAnalytics(adType: string, event: string, metrics: AdMetrics): Promise<void> {
    try {
      await fetch('/api/analytics/admob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adType,
          event,
          metrics,
          timestamp: new Date().toISOString(),
          platform: 'web'
        })
      });
    } catch (error) {
      console.error('Failed to send ad analytics:', error);
    }
  }

  private async simulateAdLoadDelay(): Promise<void> {
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private createAdPlaceholder(type: string, size: string): HTMLElement {
    const adElement = document.createElement('div');
    adElement.className = `admob-ad admob-${type}`;
    adElement.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 10px 0;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    `;
    
    const sizes = {
      banner: { width: '320px', height: '50px' },
      large_banner: { width: '320px', height: '100px' },
      medium_rectangle: { width: '300px', height: '250px' },
      full_banner: { width: '468px', height: '60px' },
      leaderboard: { width: '728px', height: '90px' }
    };
    
    const adSize = sizes[size as keyof typeof sizes] || sizes.banner;
    adElement.style.width = adSize.width;
    adElement.style.height = adSize.height;
    adElement.style.display = 'flex';
    adElement.style.alignItems = 'center';
    adElement.style.justifyContent = 'center';
    
    adElement.innerHTML = `
      <div>
        <div style="font-weight: bold; margin-bottom: 5px;">🌱 Fruitful Global Hub</div>
        <div style="font-size: 12px;">Support Our 140 Seedlings!</div>
      </div>
    `;
    
    // Add click tracking
    adElement.addEventListener('click', () => {
      this.trackAdEvent(type, 'click');
      window.open('https://fruitful-global-hub.com', '_blank');
    });
    
    return adElement;
  }

  private createInterstitialOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    overlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px;">
        <h2 style="color: #333; margin-bottom: 20px;">🌍 Join Our Global Mission!</h2>
        <p style="color: #666; margin-bottom: 20px;">
          Help us nurture 140 seedlings learning kindness in 111 languages across the world.
        </p>
        <div style="margin-bottom: 20px;">
          <img src="/seedling-icon.png" alt="Seedling" style="width: 80px; height: 80px;">
        </div>
        <button onclick="window.open('https://fruitful-global-hub.com', '_blank')" 
                style="background: #4CAF50; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Learn More
        </button>
      </div>
    `;
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 5000);
    
    return overlay;
  }

  private createRewardedAdOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    overlay.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 500px;">
        <h2 style="color: #333; margin-bottom: 20px;">🎁 Earn Seedling Coins!</h2>
        <p style="color: #666; margin-bottom: 20px;">
          Watch this short message about our global seedling family to earn 10 Seedling Coins!
        </p>
        <div style="margin: 20px 0;">
          <div style="font-size: 48px; margin-bottom: 10px;">🌱</div>
          <div class="ad-progress" style="font-weight: bold; color: #4CAF50;">Watch for 30s to earn rewards!</div>
        </div>
        <p style="color: #888; font-size: 14px;">
          Your support helps us teach kindness through language learning worldwide.
        </p>
      </div>
    `;
    
    return overlay;
  }

  private createNativeAdContent(): HTMLElement {
    const nativeAd = document.createElement('div');
    nativeAd.className = 'native-ad';
    nativeAd.style.cssText = `
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      background: #f9f9f9;
      cursor: pointer;
    `;
    
    nativeAd.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <img src="/seedling-icon.png" alt="Fruitful Global" style="width: 40px; height: 40px; margin-right: 12px;">
        <div>
          <div style="font-weight: bold; color: #333;">Fruitful Global Hub</div>
          <div style="color: #666; font-size: 12px;">Sponsored</div>
        </div>
      </div>
      <h3 style="color: #333; margin-bottom: 8px;">Join Our Global Seedling Family 🌱</h3>
      <p style="color: #666; margin-bottom: 12px; line-height: 1.4;">
        Support 140 seedlings learning kindness in 111 languages. Every interaction helps our global mission grow.
      </p>
      <button style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Learn More
      </button>
    `;
    
    // Add click tracking
    nativeAd.addEventListener('click', () => {
      this.trackAdEvent('native', 'click');
      window.open('https://fruitful-global-hub.com', '_blank');
    });
    
    return nativeAd;
  }

  private showRewardNotification(reward: { amount: number; type: string }): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    notification.innerHTML = `
      <div style="font-weight: bold;">🎉 Reward Earned!</div>
      <div>+${reward.amount} ${reward.type}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  // Public utility methods
  
  isAdReady(adType: 'interstitial' | 'rewarded'): boolean {
    const ad = this.loadedAds.get(adType);
    return ad?.isReady || false;
  }

  removeAd(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
    
    // Remove from tracking
    this.loadedAds.delete(`banner_${containerId}`);
    this.loadedAds.delete(`native_${containerId}`);
  }

  setTestMode(enabled: boolean): void {
    this.config.isTestMode = enabled;
    console.log(`AdMob test mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  updateConfig(newConfig: Partial<AdMobConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('AdMob configuration updated');
  }
}

export const googleAdMob = GoogleAdMobService.getInstance();