import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Check, 
  X, 
  Zap,
  ShoppingCart,
  Sprout,
  Globe,
  Heart,
  Info
} from 'lucide-react';
import { NotificationPermissionManager } from '@/components/NotificationPermissionManager';
import { messagingService } from '@/services/firebase-messaging';
import { analyticsService } from '@/services/firebase-analytics';

interface NotificationPreferences {
  seedlingMilestones: boolean;
  abandonedCart: boolean;
  ecosystemUpdates: boolean;
  specialOffers: boolean;
  communityEvents: boolean;
  weeklyDigest: boolean;
}

export default function NotificationSettingsPage() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    seedlingMilestones: true,
    abandonedCart: true,
    ecosystemUpdates: true,
    specialOffers: false,
    communityEvents: true,
    weeklyDigest: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    // Initialize page analytics
    analyticsService.trackPageView('/notifications/settings', 'Notification Settings');
    
    // Check current permission status
    if (messagingService.isNotificationSupported()) {
      const status = messagingService.getPermissionStatus();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        const token = messagingService.getCurrentToken();
        setFcmToken(token);
      }
    }

    // Load saved preferences
    const savedPreferences = localStorage.getItem('notification-preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }, []);

  const handlePermissionGranted = async (token: string) => {
    setFcmToken(token);
    setPermissionStatus('granted');
    
    // Subscribe to relevant topics based on preferences
    await updateTopicSubscriptions(token, preferences);
    
    setSaveMessage('Notifications enabled successfully! 🎉');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handlePermissionDenied = () => {
    setPermissionStatus('denied');
    setSaveMessage('Notifications blocked. You can enable them in browser settings.');
    setTimeout(() => setSaveMessage(''), 5000);
  };

  const updateTopicSubscriptions = async (token: string, prefs: NotificationPreferences) => {
    try {
      const subscriptions = [];
      const unsubscriptions = [];

      // Map preferences to topics
      const topicMap = {
        seedlingMilestones: 'seedling_learners',
        abandonedCart: 'banimal_customers',
        ecosystemUpdates: 'ecosystem_users',
        specialOffers: 'special_offers',
        communityEvents: 'community_events',
        weeklyDigest: 'weekly_digest'
      };

      for (const [pref, topic] of Object.entries(topicMap)) {
        if (prefs[pref as keyof NotificationPreferences]) {
          subscriptions.push(topic);
        } else {
          unsubscriptions.push(topic);
        }
      }

      // Subscribe to enabled topics
      if (subscriptions.length > 0) {
        await fetch('/api/notifications/subscribe-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokens: [token], topic: subscriptions.join(',') })
        });
      }

      // Unsubscribe from disabled topics
      if (unsubscriptions.length > 0) {
        await fetch('/api/notifications/unsubscribe-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokens: [token], topic: unsubscriptions.join(',') })
        });
      }

    } catch (error) {
      console.error('Error updating topic subscriptions:', error);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // Save to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));

    // Update topic subscriptions if notifications are enabled
    if (fcmToken) {
      setIsSaving(true);
      await updateTopicSubscriptions(fcmToken, newPreferences);
      setIsSaving(false);
      
      setSaveMessage('Preferences updated successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    }

    // Track analytics
    analyticsService.logCustomEvent({
      name: 'notification_preference_changed',
      parameters: {
        preference_type: key,
        enabled: value
      }
    });
  };

  const testNotification = async () => {
    if (!fcmToken) {
      setSaveMessage('Please enable notifications first.');
      return;
    }

    try {
      const response = await fetch('/api/notifications/send-personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🧪 Test Notification',
          body: 'This is a test notification from your Fruitful Global Hub settings!',
          targetUsers: [fcmToken],
          data: { type: 'test', url: '/notifications/settings' }
        })
      });

      if (response.ok) {
        setSaveMessage('Test notification sent! Check your device.');
        analyticsService.logCustomEvent({
          name: 'test_notification_sent',
          parameters: { source: 'settings_page' }
        });
      } else {
        setSaveMessage('Failed to send test notification.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setSaveMessage('Error sending test notification.');
    }

    setTimeout(() => setSaveMessage(''), 3000);
  };

  const getStatusBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Active</Badge>;
      case 'denied':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Blocked</Badge>;
      default:
        return <Badge variant="secondary"><Bell className="w-3 h-3 mr-1" />Not Set</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="notification-settings-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Settings className="w-8 h-8" />
            Notification Settings
          </h1>
          <p className="text-gray-600">
            Manage how you stay connected with our global seedling family and ecosystem updates
          </p>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Status
              </span>
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>
              Current notification permission and connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPermissionManager
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          </CardContent>
        </Card>

        {/* Preferences Card */}
        {permissionStatus === 'granted' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which types of notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seedling Milestones */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <Sprout className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Seedling Milestones</Label>
                    <p className="text-sm text-gray-600">
                      Get notified when seedlings achieve language learning milestones and kindness mastery
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.seedlingMilestones}
                  onCheckedChange={(value) => handlePreferenceChange('seedlingMilestones', value)}
                  data-testid="switch-seedling-milestones"
                />
              </div>

              <Separator />

              {/* Abandoned Cart */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <ShoppingCart className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Cart Reminders</Label>
                    <p className="text-sm text-gray-600">
                      Gentle reminders about items in your Banimal platform cart
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.abandonedCart}
                  onCheckedChange={(value) => handlePreferenceChange('abandonedCart', value)}
                  data-testid="switch-abandoned-cart"
                />
              </div>

              <Separator />

              {/* Ecosystem Updates */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Ecosystem Updates</Label>
                    <p className="text-sm text-gray-600">
                      Important updates about the Fruitful Global ecosystem and platform news
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.ecosystemUpdates}
                  onCheckedChange={(value) => handlePreferenceChange('ecosystemUpdates', value)}
                  data-testid="switch-ecosystem-updates"
                />
              </div>

              <Separator />

              {/* Special Offers */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Special Offers</Label>
                    <p className="text-sm text-gray-600">
                      Exclusive deals and promotional offers from our partner brands
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.specialOffers}
                  onCheckedChange={(value) => handlePreferenceChange('specialOffers', value)}
                  data-testid="switch-special-offers"
                />
              </div>

              <Separator />

              {/* Community Events */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Community Events</Label>
                    <p className="text-sm text-gray-600">
                      Invitations to community events, webinars, and global family gatherings
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.communityEvents}
                  onCheckedChange={(value) => handlePreferenceChange('communityEvents', value)}
                  data-testid="switch-community-events"
                />
              </div>

              <Separator />

              {/* Weekly Digest */}
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <Label className="text-base font-medium">Weekly Digest</Label>
                    <p className="text-sm text-gray-600">
                      Weekly summary of seedling progress, ecosystem achievements, and highlights
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.weeklyDigest}
                  onCheckedChange={(value) => handlePreferenceChange('weeklyDigest', value)}
                  data-testid="switch-weekly-digest"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Notification Card */}
        {permissionStatus === 'granted' && fcmToken && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Test Notifications
              </CardTitle>
              <CardDescription>
                Send a test notification to make sure everything is working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testNotification} disabled={isSaving} data-testid="button-test-notification">
                <Bell className="w-4 h-4 mr-2" />
                Send Test Notification
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {saveMessage && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Information Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Info className="w-5 h-5" />
              About Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 space-y-2">
            <p className="text-sm">
              🌱 <strong>Our Mission:</strong> These notifications help you stay connected with our global family of 140 protected seedlings and the growing Fruitful ecosystem.
            </p>
            <p className="text-sm">
              🔒 <strong>Privacy:</strong> Your notification preferences are stored locally and can be changed anytime. We respect your privacy and only send relevant updates.
            </p>
            <p className="text-sm">
              💚 <strong>Support:</strong> By enabling notifications, you're helping us build a more connected and caring global community centered around kindness and growth.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}