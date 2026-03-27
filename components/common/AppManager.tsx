import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket, setLocalNotificationHandler } from "@/services/socketService";
import { fetchNotifications } from "@/store/slices/notificationsSlice";

function navigateFromNotification(data: { entityType?: string; entityId?: string }) {
  if (!data?.entityType || !data?.entityId) return;
  switch (data.entityType) {
    case "conversation":
      router.push({ pathname: "/chat", params: { conversationId: data.entityId } });
      break;
    case "order":
      router.push("/(tabs)/orders");
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
  const listenersRef = useRef<{ remove: () => void }[]>([]);

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    connectSocket(accessToken);
    dispatch(fetchNotifications({ limit: 20 }));

    // Lazy-load expo-notifications — skipped gracefully if native build not done yet
    (async () => {
      try {
        const Notifications = await import("expo-notifications");
        const { registerForPushNotifications, showLocalNotification } = await import("@/services/pushNotificationService");

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        setLocalNotificationHandler(showLocalNotification);
        registerForPushNotifications(accessToken);

        const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data as { entityType?: string; entityId?: string };
          navigateFromNotification(data);
        });
        listenersRef.current.push(responseSub);

        Notifications.getLastNotificationResponseAsync().then((response) => {
          if (!response) return;
          const data = response.notification.request.content.data as { entityType?: string; entityId?: string };
          navigateFromNotification(data);
        });
      } catch {
        // expo-notifications unavailable — in-app banner still works
      }
    })();

    return () => {
      listenersRef.current.forEach((s) => s.remove());
      listenersRef.current = [];
    };
  }, [accessToken]);

  return null;
}
