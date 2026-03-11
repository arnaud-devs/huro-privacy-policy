import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function MarketHeader() {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <Text className="text-xl font-extrabold text-slate-900">Market</Text>

      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          className="relative"
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={26} color="#0F172A" />
          <View className="absolute -top-1 -right-1 bg-primary w-4 h-4 rounded-full items-center justify-center">
            <Text className="text-xxs text-white font-bold">2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="h-8 w-8 rounded-full border border-slate-200 items-center justify-center">
          <Ionicons name="notifications-outline" size={18} color="#0F172A" />
          <View className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
