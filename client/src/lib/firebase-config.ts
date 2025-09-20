import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase configuration for Fruitful Global Master Hub
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fruitful-global-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fruitful-global-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fruitful-global-hub.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Check if Firebase credentials are properly configured
const isFirebaseConfigured = (): boolean => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  return requiredEnvVars.every(envVar => {
    const value = import.meta.env[envVar];
    return value && value !== "" && !value.includes("demo-") && !value.includes("your-");
  });
};

// Initialize Firebase App with error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

const isConfigured = isFirebaseConfigured();

if (isConfigured) {
  try {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');

    // Initialize Firebase Auth
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');

    // Initialize Firestore
    db = getFirestore(app);
    console.log('Firebase Firestore initialized successfully');

    // Initialize Firebase Messaging (only if supported and in browser)
    if (typeof window !== 'undefined') {
      isMessagingSupported().then((supported) => {
        if (supported && app) {
          messaging = getMessaging(app);
          console.log('Firebase Messaging initialized successfully');
        }
      }).catch((error) => {
        console.warn('Firebase Messaging initialization failed:', error);
      });
    }

    // Initialize Firebase Analytics (only if supported and in browser)
    if (typeof window !== 'undefined') {
      isAnalyticsSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized successfully');
        }
      }).catch((error) => {
        console.warn('Firebase Analytics initialization failed:', error);
      });
    }

  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.warn('Firebase services will be disabled until proper credentials are provided');
  }
} else {
  console.warn('Firebase not configured: Missing or invalid environment variables');
  console.warn('Firebase services are disabled. Please configure your Firebase credentials in the .env file');
  console.warn('See .env.example for setup instructions');
}

// Export Firebase services with null checks
export { app, auth, db, messaging, analytics };

// Helper functions for graceful degradation
export const isFirebaseAvailable = (): boolean => app !== null;
export const isAuthAvailable = (): boolean => auth !== null;
export const isFirestoreAvailable = (): boolean => db !== null;
export const isMessagingAvailable = (): boolean => messaging !== null;
export const isAnalyticsAvailable = (): boolean => analytics !== null;

// Safe Firebase service getters
export const getFirebaseApp = (): FirebaseApp | null => app;
export const getFirebaseAuth = (): Auth | null => auth;
export const getFirebaseFirestore = (): Firestore | null => db;
export const getFirebaseMessaging = (): Messaging | null => messaging;
export const getFirebaseAnalytics = (): Analytics | null => analytics;

export default firebaseConfig;