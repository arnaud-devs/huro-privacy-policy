import { router } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { fetchNotifications } from "@/store/slices/notificationsSlice";
import { logout } from "@/store/slices/userSlice";

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    // payload.exp is in seconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // malformed token → treat as expired
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

export default function AppManager() {
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.tokens?.accessToken);
  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    if (isTokenExpired(accessToken)) {
      dispatch(logout());
      disconnectSocket();
      router.replace('/(auth)/login');
      return;
    }

    connectSocket(accessToken);
    dispatch(fetchNotifications({ limit: 20 }));
    // NOTE: expo-notifications (system banners + push token) requires a native build.
    // Run `npx expo run:android` to enable. In-app banner works without it.

  }, [accessToken]);

  return null;
}
