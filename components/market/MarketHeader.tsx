import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import CartIconButton from "@/components/common/CartIconButton";

export default function MarketHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <Text className="text-xl font-extrabold text-slate-900">Market</Text>

      <View className="flex-row items-center gap-4">
        <CartIconButton />
        <TouchableOpacity className="h-8 w-8 rounded-full border border-slate-200 items-center justify-center">
          <Ionicons name="notifications-outline" size={18} color="#0F172A" />
          <View className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
