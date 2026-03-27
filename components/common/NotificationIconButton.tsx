import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "@/store/hooks";

interface Props {
  size?: number;
  color?: string;
}

export default function NotificationIconButton({ size = 22, color = "#0F172A" }: Props) {
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  return (
    <TouchableOpacity
      onPress={() => router.push("/notifications")}
      style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "#ef4444",
            borderRadius: 99,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 9, fontWeight: "700" }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
