import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@/store/config';

export async function registerForPushNotifications(accessToken: string): Promise<string | null> {
  // Push notifications only work on real devices
  if (!Device.isDevice) {
    console.log('[Push] Skipping - not a real device');
    return null;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'HuzaGo Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1C74E9',
      sound: 'default',
    });
  }

  // Request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Push] Permission denied');
    return null;
  }

  // Get the Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  console.log('[Push] Token:', token);

  // Save token to backend
  // TODO: Update endpoint when backend adds FCM push token support
  await savePushTokenToServer(token, accessToken);

  return token;
}

async function savePushTokenToServer(token: string, accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me/push-token`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pushToken: token }),
    });
    if (response.ok) {
      console.log('[Push] Token saved to server');
    }
    // Silently ignore if endpoint doesn't exist yet
  } catch {
    // Backend doesn't support push tokens yet — token is ready for when it does
  }
}

export async function showLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
      sound: 'default',
    },
    trigger: null, // show immediately
  });
}
