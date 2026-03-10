import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function SearchBar() {
  return (
    <View className="flex-row items-center bg-white rounded-2xl px-4 h-[50px] mb-6 border border-slate-200">
      <Ionicons name="search-outline" size={20} color="#8D94A2" className="mr-2.5" />
      <TextInput
        className="flex-1 text-sm text-slate-900"
        placeholder="Search snacks, chargers, stationery..."
        placeholderTextColor="#A0A5B1"
      />
    </View>
  );
}
