import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MarketSearchBar() {
  return (
    <View className="px-4 mt-4 pb-2">
      <View className="flex-row items-center bg-white h-12 rounded-full px-4 border border-slate-200">
        <Ionicons name="search-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="Search products or shops..."
          className="flex-1 ml-2 text-base text-slate-800"
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );
}
