import { View, Text, TouchableOpacity } from "react-native";

export default function MarketTabs() {
  return (
    <View className="px-4 mt-2 mb-2">
      <View className="flex-row bg-slate-100 rounded-full p-1 border border-slate-200">
        <TouchableOpacity className="flex-1 bg-white rounded-full py-2 shadow-sm items-center justify-center">
          <Text className="text-primary font-bold text-sm">Shop Store</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 rounded-full py-2 items-center justify-center">
          <Text className="text-slate-500 font-semibold text-sm">Used Market</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
