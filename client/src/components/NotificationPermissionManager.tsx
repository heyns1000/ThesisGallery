import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, Check, X, Settings, Zap } from 'lucide-react';
import { messagingService } from '@/services/firebase-messaging';
import { analyticsService } from '@/services/firebase-analytics';

interface NotificationPermissionManagerProps {
  userName?: string;
  onPermissionGranted?: (token: string) => void;
  onPermissionDenied?: () => void;
}

export function NotificationPermissionManager({
  userName,
  onPermissionGranted,
  onPermissionDenied
}: NotificationPermissionManagerProps) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check initial permission status and initialize Firebase Messaging
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        if (!messagingService.isNotificationSupported()) {
          console.log('Notifications not supported');
          return;
        }

        // Initialize Firebase Messaging
        const initialized = await messagingService.initialize();
        setIsInitialized(initialized);

        if (initialized) {
          const status = messagingService.getPermissionStatus();
          setPermissionStatus(status);

          // Get existing token if permission already granted
          if (status === 'granted') {
            const token = await messagingService.getRegistrationToken();
            setFcmToken(token);
            if (token && onPermissionGranted) {
              onPermissionGranted(token);
            }
          }

          // Show reminder if permission is default (not yet requested)
          if (status === 'default') {
            // Check if reminder was recently dismissed
            const lastDismissed = localStorage.getItem('notification-reminder-dismissed');
            const now = Date.now();
            const dismissedTime = lastDismissed ? parseInt(lastDismissed) : 0;
            const hoursSinceDismissal = (now - dismissedTime) / (1000 * 60 * 60);

            // Show reminder if never dismissed or if 24+ hours have passed
            if (!lastDismissed || hoursSinceDismissal >= 24) {
              setTimeout(() => setShowReminder(true), 3000); // Show after 3 seconds
            }
          }

          // Set up foreground message listener
          messagingService.onForegroundMessage((payload) => {
            console.log('Foreground message received:', payload);
            
            // Track analytics
            analyticsService.trackNotificationInteraction(
              'received',
              payload.data?.type || 'general'
            );
          });
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [onPermissionGranted]);

  const requestPermission = async () => {
    if (!isInitialized) {
      console.warn('Firebase Messaging not initialized');
      return;
    }

    setIsRequesting(true);

    try {
      const granted = await messagingService.requestPermission();
      const newStatus = messagingService.getPermissionStatus();
      setPermissionStatus(newStatus);

      if (granted) {
        const token = await messagingService.getRegistrationToken();
        setFcmToken(token);
        setShowReminder(false);
        
        // Track analytics
        analyticsService.trackNotificationInteraction('granted', 'permission_request');
        
        if (token && onPermissionGranted) {
          onPermissionGranted(token);
        }
      } else {
        // Track analytics
        analyticsService.trackNotificationInteraction('denied', 'permission_request');
        
        if (onPermissionDenied) {
          onPermissionDenied();
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const dismissReminder = () => {
    setShowReminder(false);
    setReminderDismissed(true);
    
    // Remember dismissal for 24 hours
    localStorage.setItem('notification-reminder-dismissed', Date.now().toString());
    
    // Track analytics
    analyticsService.trackNotificationInteraction('dismissed', 'permission_reminder');
  };

  const getPermissionBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Blocked</Badge>;
      default:
        return <Badge variant="secondary"><Bell className="w-3 h-3 mr-1" />Not Set</Badge>;
    }
  };

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <BellOff className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Friendly reminder card
  if (showReminder && !reminderDismissed && permissionStatus === 'default') {
    return (
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-4" data-testid="notification-reminder-card">
        <Zap className="h-4 w-4 text-blue-500" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-blue-800 mb-1">
              🌱 Stay Connected with Our Seedling Family!
            </p>
            <p className="text-blue-700 text-sm">
              {userName ? `Hi ${userName}! ` : ''}Get notifications about seedling milestones, special offers, and ecosystem updates. Support our 140 protected seedlings! 💚
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button 
              size="sm" 
              onClick={requestPermission}
              disabled={isRequesting}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-enable-notifications"
            >
              {isRequesting ? 'Enabling...' : 'Enable'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={dismissReminder}
              data-testid="button-dismiss-reminder"
            >
              Later
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Main notification settings card
  return (
    <Card className="w-full max-w-md" data-testid="notification-permission-manager">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getPermissionIcon()}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with seedling progress and ecosystem news
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {getPermissionBadge()}
        </div>

        {permissionStatus === 'granted' && fcmToken && (
          <div className="space-y-2">
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              You're all set! You'll receive notifications about:
            </p>
            <ul className="text-xs text-gray-600 space-y-1 ml-5">
              <li>🌱 Seedling language learning milestones</li>
              <li>🛒 Banimal platform updates & cart reminders</li>
              <li>📊 Ecosystem progress and achievements</li>
              <li>🎉 Special offers and community events</li>
            </ul>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="space-y-2">
            <p className="text-sm text-orange-600">
              Notifications are blocked. To enable them:
            </p>
            <ol className="text-xs text-gray-600 space-y-1 ml-4">
              <li>1. Click the 🔒 lock icon in your browser address bar</li>
              <li>2. Change notifications from "Block" to "Allow"</li>
              <li>3. Refresh this page</li>
            </ol>
          </div>
        )}

        {permissionStatus === 'default' && (
          <p className="text-sm text-gray-600">
            Enable notifications to stay connected with our global seedling family and never miss important updates!
          </p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {permissionStatus === 'default' && (
          <Button 
            onClick={requestPermission}
            disabled={isRequesting || !isInitialized}
            className="flex-1"
            data-testid="button-request-permission"
          >
            <Bell className="w-4 h-4 mr-2" />
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Button>
        )}
        
        {permissionStatus === 'granted' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('/notifications/settings', '_blank')}
            data-testid="button-notification-settings"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}