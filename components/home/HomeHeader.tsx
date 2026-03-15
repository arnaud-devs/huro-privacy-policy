import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  const router = useRouter();
  return (
    <View className="flex-row justify-between items-center mb-5 mt-2">
      <TouchableOpacity
        className="flex-row items-center"
        activeOpacity={0.7}
        onPress={() => router.push("/(tabs)/more/profile")}
      >
        <View className="w-11 h-11 rounded-full bg-rose-100 mr-3 overflow-hidden">
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=11" }}
            className="w-full h-full"
            contentFit="cover"
          />
        </View>
        <View>
          <Text className="text-sm text-slate-500">Welcome back,</Text>
          <Text className="text-base font-bold text-primary">Alex Chen</Text>
        </View>
      </TouchableOpacity>
      <View className="flex-row items-center gap-3">
        {/* Cart icon with item count badge */}
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="w-10 h-10 rounded-full bg-white justify-center items-center border border-slate-200"
        >
          <Ionicons name="cart-outline" size={20} color="#0F172A" />
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full items-center justify-center">
            <Text style={{ fontSize: 9, color: "white", fontWeight: "700" }}>
              2
            </Text>
          </View>
        </TouchableOpacity>
        {/* Notification bell with unread dot */}
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center border border-slate-200">
          <Ionicons name="notifications-outline" size={22} color="#0F172A" />
          <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
