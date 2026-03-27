import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import CartIconButton from "@/components/common/CartIconButton";
import { useAppSelector } from "@/store/hooks";

export default function HomeHeader() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <View className="flex-row justify-between items-center mb-5 mt-2">
      <TouchableOpacity
        className="flex-row items-center"
        activeOpacity={0.7}
        onPress={() => router.push("/(tabs)/more/profile")}
      >
        <View className="w-11 h-11 rounded-full bg-slate-100 mr-3 overflow-hidden">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-full h-full"
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full bg-primary items-center justify-center">
              <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                {firstName[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-sm text-slate-500">Welcome back,</Text>
          <Text className="text-base font-bold text-primary">{firstName}</Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row items-center gap-3">
        <CartIconButton />

        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          className="w-10 h-10 rounded-full bg-white justify-center items-center border border-slate-200"
        >
          <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 4,
                right: 4,
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
      </View>
    </View>
  );
}
