import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import CartIconButton from "@/components/common/CartIconButton";
import NotificationIconButton from "@/components/common/NotificationIconButton";
import { useAppSelector } from "@/store/hooks";

export default function HomeHeader() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

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

        <NotificationIconButton />
      </View>
    </View>
  );
}
