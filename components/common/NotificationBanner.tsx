import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "@/store/hooks";
import { AppNotification } from "@/store/slices/notificationsSlice";
import { navigateFromNotification } from "@/components/common/AppManager";

const BANNER_DURATION = 4000;

function getNotificationStyle(type: string): { icon: any; color: string; bg: string } {
  if (type.includes("MESSAGE") || type.includes("OFFER"))
    return { icon: "chatbubble-ellipses", color: "#7c3aed", bg: "#f5f3ff" };
  if (type.includes("ORDER") || type.includes("PAYMENT"))
    return { icon: "receipt", color: "#1C74E9", bg: "#eff6ff" };
  if (type.includes("BATCH") || type.includes("RIDER") || type.includes("DISPATCH"))
    return { icon: "bicycle", color: "#16a34a", bg: "#f0fdf4" };
  if (type.includes("LISTING") || type.includes("WATCHLIST"))
    return { icon: "pricetag", color: "#d97706", bg: "#fffbeb" };
  return { icon: "notifications", color: "#1C74E9", bg: "#eff6ff" };
}


export default function NotificationBanner() {
  const insets = useSafeAreaInsets();
  const items = useAppSelector((state) => state.notifications.items);
  const [current, setCurrent] = useState<AppNotification | null>(null);
  const translateY = useRef(new Animated.Value(-140)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const newest = items[0];
    if (!newest || !newest.live) return;
    if (newest.id === lastIdRef.current) return;
    lastIdRef.current = newest.id;
    setCurrent(newest);
    showBanner();
  }, [items[0]?.id]);

  function showBanner() {
    if (timerRef.current) clearTimeout(timerRef.current);
    progress.setValue(1);
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
    Animated.timing(progress, { toValue: 0, duration: BANNER_DURATION, useNativeDriver: false }).start();
    timerRef.current = setTimeout(hideBanner, BANNER_DURATION);
  }

  function hideBanner() {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, { toValue: -140, duration: 280, useNativeDriver: true }).start();
  }

  if (!current) return null;

  const style = getNotificationStyle(current.type);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: insets.top + 10,
        left: 12,
        right: 12,
        zIndex: 9999,
        transform: [{ translateY }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => { hideBanner(); navigateFromNotification({ entityType: current.entityType ?? undefined, entityId: current.entityId ?? undefined }); }}
        activeOpacity={0.97}
        style={{ backgroundColor: "#ffffff", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#f1f5f9" }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", padding: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: style.bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
            <Ionicons name={style.icon} size={22} color={style.color} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: style.color, textTransform: "uppercase", letterSpacing: 0.5, marginRight: 6 }}>
                HURO
              </Text>
              <Text style={{ fontSize: 10, color: "#94a3b8" }}>just now</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }} numberOfLines={1}>{current.title}</Text>
            <Text style={{ fontSize: 13, color: "#64748b", marginTop: 1, lineHeight: 18 }} numberOfLines={2}>{current.body}</Text>
          </View>
          <TouchableOpacity onPress={hideBanner} style={{ padding: 6, marginLeft: 4 }}>
            <Ionicons name="close" size={16} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={{
            height: 3,
            backgroundColor: style.color,
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            opacity: 0.6,
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
