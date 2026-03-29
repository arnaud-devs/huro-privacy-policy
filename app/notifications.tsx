import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  AppNotification,
} from "@/store/slices/notificationsSlice";

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, isFetching, unreadCount, page, totalPages } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!isFetching && page < totalPages) {
      dispatch(fetchNotifications({ page: page + 1, limit: 20 }));
    }
  }, [isFetching, page, totalPages, dispatch]);

  function handleTap(notification: AppNotification) {
    if (!notification.isRead) {
      dispatch(markNotificationRead({ notificationId: notification.id }));
    }
    navigate(notification);
  }

  function navigate(notification: AppNotification) {
    const { entityType, entityId } = notification;
    if (!entityId) return;

    switch (entityType) {
      case "order":
        router.push({ pathname: "/(tabs)/orders", params: { orderId: entityId } });
        break;
      case "conversation":
        router.push({ pathname: "/chat", params: { conversationId: entityId } });
        break;
      case "listing":
        router.push({ pathname: "/product-details", params: { id: entityId } });
        break;
      default:
        break;
    }
  }

  function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }

  function getIcon(type: string): { name: any; color: string; bg: string } {
    if (type.includes("ORDER") || type.includes("PAYMENT"))
      return { name: "receipt-outline", color: "#1C74E9", bg: "#EFF6FF" };
    if (type.includes("BATCH") || type.includes("RIDER"))
      return { name: "bicycle-outline", color: "#16a34a", bg: "#f0fdf4" };
    if (type.includes("MESSAGE") || type.includes("OFFER"))
      return { name: "chatbubble-outline", color: "#7c3aed", bg: "#f5f3ff" };
    if (type.includes("WATCHLIST"))
      return { name: "eye-outline", color: "#d97706", bg: "#fffbeb" };
    if (type.includes("ACHIEVEMENT"))
      return { name: "trophy-outline", color: "#ea580c", bg: "#fff7ed" };
    return { name: "notifications-outline", color: "#64748b", bg: "#f8fafc" };
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900">Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(markAllNotificationsRead())}
            className="px-3 py-1.5 bg-primary rounded-full"
          >
            <Text className="text-xs font-semibold text-white">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isFetching && items.length === 0 ? (
        <ActivityIndicator size="large" color="#1C74E9" style={{ marginTop: 48 }} />
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="notifications-off-outline" size={56} color="#cbd5e1" />
          <Text className="text-slate-400 mt-3 text-base">No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListFooterComponent={
            isFetching && items.length > 0 ? (
              <ActivityIndicator color="#1C74E9" style={{ marginVertical: 16 }} />
            ) : null
          }
          renderItem={({ item }) => {
            const icon = getIcon(item.type);
            return (
              <TouchableOpacity
                onPress={() => handleTap(item)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: item.isRead ? "white" : "#f0f7ff",
                  borderBottomWidth: 1,
                  borderBottomColor: "#f1f5f9",
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: icon.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    flexShrink: 0,
                  }}
                >
                  <Ionicons name={icon.name} size={22} color={icon.color} />
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: item.isRead ? "500" : "700", color: "#0f172a" }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#64748b", marginTop: 2, lineHeight: 18 }}>
                    {item.body}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>

                {/* Unread dot */}
                {!item.isRead && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#1C74E9",
                      marginTop: 6,
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
