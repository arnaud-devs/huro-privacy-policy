import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function QuickLinks() {
  return (
    <View className="flex-row gap-4 mb-8">
      <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4 shadow-sm shadow-black/5">
        <View className="w-10 h-10 rounded-xl bg-indigo-50 justify-center items-center mb-3">
          <Ionicons name="storefront-outline" size={22} color="#0F172A" />
        </View>
        <Text className="text-sm font-bold text-slate-900 mb-1">Partner Shop</Text>
        <Text className="text-xs text-slate-500 leading-4">
          Order from official shops
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1 bg-white rounded-[20px] p-4 shadow-sm shadow-black/5">
        <View className="w-10 h-10 rounded-xl bg-indigo-50 justify-center items-center mb-3">
          <Ionicons name="sync-circle-outline" size={24} color="#0F172A" />
        </View>
        <Text className="text-sm font-bold text-slate-900 mb-1">Used Market</Text>
        <Text className="text-xs text-slate-500 leading-4">
          Buy & sell with fellow students
        </Text>
      </TouchableOpacity>
    </View>
  );
}
