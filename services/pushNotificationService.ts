import { Platform } from 'react-native';
import { API_BASE_URL } from '@/store/config';
import { store } from '@/store/store';
import { prependNotification } from '@/store/slices/notificationsSlice';

// Lazy-load Firebase Messaging v22 modular API
function getFirebaseMessaging() {
  try {
    return require('@react-native-firebase/messaging');
  } catch {
    return null;
  }
}

// Stores the current FCM token so logout can delete it
let _currentFCMToken: string | null = null;
export function getCurrentFCMToken(): string | null {
  return _currentFCMToken;
}

// ─── Register token ────────────────────────────────────────────────────────

export async function registerFCMToken(accessToken: string): Promise<void> {
  const firebase = getFirebaseMessaging();
  if (!firebase) {
    console.log('[FCM] Firebase not available (Expo Go or native module missing)');
    return;
  }

  try {
    const { getMessaging, getToken, onTokenRefresh, onMessage, setBackgroundMessageHandler } = firebase;
    const messagingInstance = getMessaging();

    // iOS: request permission
    if (Platform.OS === 'ios') {
      const { requestPermission } = firebase;
      const authStatus = await requestPermission(messagingInstance);
      const granted = authStatus === 1 || authStatus === 2;
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
    const token = await getToken(messagingInstance);
    console.log('[FCM] Token:', token);
    _currentFCMToken = token;

    // Register with backend
    await postTokenToBackend(token, accessToken);

    // Re-register if Firebase rotates the token
    onTokenRefresh(messagingInstance, async (newToken: string) => {
      console.log('[FCM] Token refreshed');
      _currentFCMToken = newToken;
      await postTokenToBackend(newToken, accessToken);
    });

    // Foreground messages — Firebase does NOT auto-show these, handle manually
    onMessage(messagingInstance, async (remoteMessage: any) => {
      console.log('[FCM] Foreground message:', JSON.stringify(remoteMessage));
      const title = remoteMessage.notification?.title ?? remoteMessage.data?.title ?? 'HURO';
      const body = remoteMessage.notification?.body ?? remoteMessage.data?.body ?? '';

      // Dispatch to Redux so the in-app banner fires
      store.dispatch(prependNotification({
        id: `fcm-${Date.now()}`,
        userId: '',
        type: remoteMessage.data?.type ?? 'SYSTEM',
        title,
        body,
        entityType: remoteMessage.data?.entityType ?? null,
        entityId: remoteMessage.data?.entityId ?? null,
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString(),
      }));
    });

    // Background message handler — system tray handles display automatically
    setBackgroundMessageHandler(messagingInstance, async () => {});
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
    console.log('[FCM] Backend registration status:', response.status, data.message);
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

