import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { fetchNotifications } from "@/store/slices/notificationsSlice";
import { logout } from "@/store/slices/userSlice";
import { registerFCMToken, removeFCMToken } from "@/services/pushNotificationService";

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function navigateFromNotification(data: { entityType?: string; entityId?: string }) {
  if (!data?.entityType || !data?.entityId) return;

  const role = store.getState().user.user?.role;
  const isRider = role === 'RIDER';

  switch (data.entityType) {
    case "conversation":
      router.push({ pathname: "/chat", params: { conversationId: data.entityId } });
      break;
    case "order":
      if (isRider) {
        router.push({ pathname: "/(rider)/order-detail", params: { orderId: data.entityId } });
      } else {
        router.push("/(tabs)/orders");
      }
      break;
    case "batch":
      router.push({ pathname: "/(rider)/batch-detail", params: { batchId: data.entityId } });
      break;
    case "listing":
      router.push({ pathname: "/product-details", params: { id: data.entityId } });
      break;
    default:
      router.push("/notifications");
  }
}

function setupFCMTapHandlers() {
  try {
    const messaging = require('@react-native-firebase/messaging').default;

    // App opened from QUIT state by tapping a notification
    messaging().getInitialNotification().then((remoteMessage: any) => {
      if (remoteMessage?.data) {
        console.log('[FCM] Opened from quit state:', remoteMessage.data);
        navigateFromNotification(remoteMessage.data);
      }
    });

    // App opened from BACKGROUND state by tapping a notification
    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      if (remoteMessage?.data) {
        console.log('[FCM] Opened from background:', remoteMessage.data);
        navigateFromNotification(remoteMessage.data);
      }
    });
  } catch {
    // Firebase not available in Expo Go
  }
}

export default function AppManager() {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.tokens?.accessToken);
  const prevTokenRef = useRef<string | null>(null);

  // Set up FCM tap handlers once on mount (works regardless of auth state)
  useEffect(() => {
    setupFCMTapHandlers();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      // Logged out — remove FCM token from backend using the previous access token
      if (prevTokenRef.current) {
        removeFCMToken(prevTokenRef.current);
      }
      prevTokenRef.current = null;
      disconnectSocket();
      return;
    }

    if (isTokenExpired(accessToken)) {
      dispatch(logout());
      disconnectSocket();
      router.replace('/(auth)/login');
      return;
    }

    prevTokenRef.current = accessToken;
    connectSocket(accessToken);
    dispatch(fetchNotifications({ limit: 20 }));
    registerFCMToken(accessToken);
  }, [accessToken]);

  return null;
}
