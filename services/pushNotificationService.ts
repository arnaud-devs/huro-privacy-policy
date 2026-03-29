import { Platform } from 'react-native';
import { API_BASE_URL } from '@/store/config';

// Lazy-load Firebase Messaging (native module — not available in Expo Go)
let _messaging: any = null;
function getMessaging() {
  if (!_messaging) {
    try {
      _messaging = require('@react-native-firebase/messaging').default;
    } catch {
      return null;
    }
  }
  return _messaging;
}

// Stores the current FCM token so logout can delete it
let _currentFCMToken: string | null = null;
export function getCurrentFCMToken(): string | null {
  return _currentFCMToken;
}

// ─── Register token ────────────────────────────────────────────────────────

export async function registerFCMToken(accessToken: string): Promise<void> {
  const messaging = getMessaging();
  if (!messaging) {
    console.log('[FCM] Firebase not available (Expo Go or native module missing)');
    return;
  }

  try {
    // iOS: request permission
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const granted =
        authStatus === 1 /* AUTHORIZED */ ||
        authStatus === 2 /* PROVISIONAL */;
      if (!granted) {
        console.log('[FCM] iOS permission denied');
        return;
      }
    }

    // Android: ensure HIGH_IMPORTANCE channel exists
    if (Platform.OS === 'android') {
      const Notifications = require('expo-notifications');
      await Notifications.setNotificationChannelAsync('default', {
        name: 'HURO Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1C74E9',
        sound: 'default',
      });
    }

    // Get the FCM token
    const token = await messaging().getToken();
    console.log('[FCM] Token:', token);
    _currentFCMToken = token;

    // Register with backend
    await postTokenToBackend(token, accessToken);

    // Re-register if Firebase rotates the token
    messaging().onTokenRefresh(async (newToken: string) => {
      console.log('[FCM] Token refreshed');
      _currentFCMToken = newToken;
      await postTokenToBackend(newToken, accessToken);
    });

    // Background message handler — system tray handles display, we just need the hook registered
    messaging().setBackgroundMessageHandler(async () => {});
  } catch (error: any) {
    console.log('[FCM] Registration error:', error.message);
  }
}

async function postTokenToBackend(fcmToken: string, accessToken: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/device-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fcm_token: fcmToken,
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
      }),
    });
    const data = await response.json();
    console.log('[FCM] Backend registration:', data.message);
  } catch (error: any) {
    console.log('[FCM] Failed to register with backend:', error.message);
  }
}

// ─── Remove token (logout) ─────────────────────────────────────────────────

export async function removeFCMToken(accessToken: string): Promise<void> {
  const token = _currentFCMToken;
  if (!token) return;
  try {
    await fetch(`${API_BASE_URL}/notifications/device-token`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcm_token: token }),
    });
    console.log('[FCM] Token removed from backend');
    _currentFCMToken = null;
  } catch (error: any) {
    console.log('[FCM] Failed to remove token:', error.message);
  }
}

// Background message handler is registered inside registerFCMToken after Firebase is confirmed available.
