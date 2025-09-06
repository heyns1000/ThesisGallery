import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Smartphone,
  BarChart3,
  Settings,
  Play,
  Square,
  Gift,
  Target,
  Globe,
  Zap
} from 'lucide-react';
import { googleAdMob } from '@/services/google-admob';
import { analyticsService } from '@/services/firebase-analytics';
import { useQuery } from '@tanstack/react-query';

export default function AdMobDashboard() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [testBannerLoaded, setTestBannerLoaded] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [adMetrics, setAdMetrics] = useState<any>({});

  // Fetch AdMob revenue data
  const { data: revenueData } = useQuery({
    queryKey: ['/api/analytics/admob/revenue'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch AdMob performance data
  const { data: performanceData } = useQuery({
    queryKey: ['/api/analytics/admob/performance'],
    refetchInterval: 30000
  });

  useEffect(() => {
    // Initialize AdMob service
    const initializeAdMob = async () => {
      try {
        const initialized = await googleAdMob.initialize();
        setIsInitialized(initialized);
        
        if (initialized) {
          // Get current metrics
          const metrics = googleAdMob.getAdMetrics();
          setAdMetrics(metrics);
          
          // Track page view
          analyticsService.trackPageView('/admob-dashboard', 'AdMob Revenue Dashboard');
        }
      } catch (error) {
        console.error('Failed to initialize AdMob:', error);
      }
    };

    initializeAdMob();
  }, []);

  const loadTestBanner = async () => {
    if (!isInitialized) return;
    
    setIsLoadingAd(true);
    try {
      const success = await googleAdMob.loadBannerAd('test-banner-container', 'medium_rectangle');
      setTestBannerLoaded(success);
      
      if (success) {
        // Update metrics
        const metrics = googleAdMob.getAdMetrics();
        setAdMetrics(metrics);
      }
    } catch (error) {
      console.error('Failed to load test banner:', error);
    } finally {
      setIsLoadingAd(false);
    }
  };

  const showTestInterstitial = async () => {
    if (!isInitialized) return;
    
    try {
      // Load then show interstitial
      const loaded = await googleAdMob.loadInterstitialAd();
      if (loaded) {
        await googleAdMob.showInterstitialAd();
        
        // Update metrics
        const metrics = googleAdMob.getAdMetrics();
        setAdMetrics(metrics);
      }
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  };

  const showTestRewarded = async () => {
    if (!isInitialized) return;
    
    try {
      const loaded = await googleAdMob.loadRewardedAd();
      if (loaded) {
        await googleAdMob.showRewardedAd((reward) => {
          console.log('Reward earned:', reward);
          
          // Track reward in analytics
          analyticsService.logCustomEvent({
            name: 'ad_reward_earned',
            parameters: {
              reward_amount: reward.amount,
              reward_type: reward.type
            }
          });
        });
        
        // Update metrics
        const metrics = googleAdMob.getAdMetrics();
        setAdMetrics(metrics);
      }
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
    }
  };

  const loadTestNative = async () => {
    if (!isInitialized) return;
    
    try {
      const success = await googleAdMob.loadNativeAd('native-ad-container');
      if (success) {
        // Update metrics
        const metrics = googleAdMob.getAdMetrics();
        setAdMetrics(metrics);
      }
    } catch (error) {
      console.error('Failed to load native ad:', error);
    }
  };

  const getRevenueCard = (title: string, value: number, change?: number, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toFixed(2)}</div>
        {change !== undefined && (
          <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );

  const getMetricCard = (title: string, value: string | number, icon: React.ReactNode, suffix?: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && <span className="text-sm text-gray-500 ml-1">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="admob-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Smartphone className="w-8 h-8 text-green-500" />
            AdMob Revenue Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Google AdMob advertising revenue and performance analytics for Fruitful Global Hub
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isInitialized ? "default" : "secondary"} className={isInitialized ? "bg-green-500" : ""}>
            {isInitialized ? "Active" : "Initializing"}
          </Badge>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      {revenueData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getRevenueCard('Total Revenue', revenueData.totalRevenue, 22.4, <DollarSign className="h-4 w-4 text-green-500" />)}
          {getRevenueCard('Daily Revenue', revenueData.dailyRevenue, 15.6, <TrendingUp className="h-4 w-4 text-blue-500" />)}
          {getMetricCard('Total Impressions', revenueData.totalImpressions, <Eye className="h-4 w-4 text-purple-500" />)}
          {getMetricCard('CTR', revenueData.overallCTR, <MousePointer className="h-4 w-4 text-orange-500" />, '%')}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="testing">Ad Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Ad Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue by Ad Type
                </CardTitle>
                <CardDescription>
                  Performance breakdown across different ad formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData?.revenueByAdType && (
                  <div className="space-y-3">
                    {Object.entries(revenueData.revenueByAdType).map(([type, revenue]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            type === 'banner' ? 'bg-blue-500' :
                            type === 'interstitial' ? 'bg-green-500' :
                            type === 'rewarded' ? 'bg-purple-500' : 'bg-orange-500'
                          }`} />
                          <span className="capitalize">{type}</span>
                        </div>
                        <span className="font-semibold">${(revenue as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performing Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Top Countries
                </CardTitle>
                <CardDescription>
                  Revenue by geographic region
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceData?.topCountries && (
                  <div className="space-y-3">
                    {performanceData.topCountries.slice(0, 5).map((country: any, index: number) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </span>
                          <span>{country.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${country.revenue.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{country.share.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Trend (Last 7 Days)
              </CardTitle>
              <CardDescription>
                Daily advertising revenue and impression trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueData?.dailyTrends && (
                <div className="space-y-2">
                  {revenueData.dailyTrends.map((day: any) => (
                    <div key={day.date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{day.impressions.toLocaleString()} impressions</span>
                        <span className="font-semibold">${day.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData?.metrics && (
              <>
                {getMetricCard('Fill Rate', performanceData.metrics.fillRate, <Target className="h-4 w-4 text-green-500" />, '%')}
                {getMetricCard('eCPM', performanceData.metrics.ecpm, <DollarSign className="h-4 w-4 text-blue-500" />, '$')}
                {getMetricCard('Clicks', performanceData.metrics.clicks, <MousePointer className="h-4 w-4 text-purple-500" />)}
              </>
            )}
          </div>

          {/* Performance Comparison */}
          {performanceData?.comparison && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>
                  Changes compared to previous period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(performanceData.comparison).map(([metric, data]: [string, any]) => (
                    <div key={metric} className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 capitalize">{metric}</div>
                      <div className="text-2xl font-bold my-1">
                        {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
                      </div>
                      <div className={`text-xs flex items-center justify-center gap-1 ${
                        data.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.trend === 'up' ? '↗' : '↘'} {Math.abs(data.change).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Ad Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Test different ad formats to optimize revenue for the Fruitful Global Hub platform. All test ads are safe and use Google's official test ad units.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ad Format Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Test Ad Formats
                </CardTitle>
                <CardDescription>
                  Test different ad types to see their performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={loadTestBanner} 
                  disabled={!isInitialized || isLoadingAd}
                  className="w-full"
                  data-testid="button-test-banner"
                >
                  <Square className="w-4 h-4 mr-2" />
                  {isLoadingAd ? 'Loading...' : 'Test Banner Ad'}
                </Button>
                
                <Button 
                  onClick={showTestInterstitial} 
                  disabled={!isInitialized}
                  variant="outline"
                  className="w-full"
                  data-testid="button-test-interstitial"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Test Interstitial Ad
                </Button>
                
                <Button 
                  onClick={showTestRewarded} 
                  disabled={!isInitialized}
                  variant="outline"
                  className="w-full"
                  data-testid="button-test-rewarded"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Test Rewarded Ad
                </Button>
                
                <Button 
                  onClick={loadTestNative} 
                  disabled={!isInitialized}
                  variant="outline"
                  className="w-full"
                  data-testid="button-test-native"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Test Native Ad
                </Button>
              </CardContent>
            </Card>

            {/* Ad Containers */}
            <Card>
              <CardHeader>
                <CardTitle>Live Ad Preview</CardTitle>
                <CardDescription>
                  Test ads will appear in these containers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner Ad Container */}
                <div>
                  <div className="text-sm font-medium mb-2">Banner Ad</div>
                  <div 
                    id="test-banner-container" 
                    className="min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
                    data-testid="banner-ad-container"
                  >
                    {testBannerLoaded ? null : 'Click "Test Banner Ad" to load'}
                  </div>
                </div>

                {/* Native Ad Container */}
                <div>
                  <div className="text-sm font-medium mb-2">Native Ad</div>
                  <div 
                    id="native-ad-container" 
                    className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500"
                    data-testid="native-ad-container"
                  >
                    Click "Test Native Ad" to load
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Metrics */}
          {Object.keys(adMetrics).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Session Metrics</CardTitle>
                <CardDescription>
                  Real-time metrics from your ad testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(adMetrics).map(([adType, metrics]: [string, any]) => (
                    <div key={adType} className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-gray-600 capitalize mb-2">{adType} Ads</div>
                      <div className="space-y-1">
                        <div className="text-lg font-bold">{metrics.impressions}</div>
                        <div className="text-xs text-gray-500">Impressions</div>
                        <div className="text-sm">${metrics.revenue.toFixed(4)}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                AdMob Configuration
              </CardTitle>
              <CardDescription>
                Current AdMob settings and configuration for Fruitful Global Hub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Test Mode</label>
                  <div className="text-lg">
                    <Badge variant={isInitialized ? "default" : "secondary"}>
                      {isInitialized ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Integration Status</label>
                  <div className="text-lg">
                    <Badge variant={isInitialized ? "default" : "destructive"}>
                      {isInitialized ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  AdMob is currently running in test mode with Google's official test ad units. 
                  Revenue shown is simulated for demonstration purposes. To enable real ads, 
                  configure your actual AdMob app ID and ad unit IDs in the environment variables.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}