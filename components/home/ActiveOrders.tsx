import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function ActiveOrders() {
  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">
          Your Active Orders
        </Text>
      </View>

      <TouchableOpacity className="bg-white rounded-2xl p-4 flex-row items-center border border-slate-200 mb-4">
        <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4">
          <Ionicons name="cube-outline" size={24} color="#16A34A" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Text className="text-[15px] font-bold text-slate-900 mr-2">
              Batch #124
            </Text>
            <View className="bg-green-100 px-2 py-1 rounded-md">
              <Text className="text-green-600 text-[10px] font-bold">
                On the way
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="location-outline" size={14} color="#1C74E9" />
            <Text className="text-[13px] font-semibold text-slate-900 ml-1.5">
              Pickup: Main Gate
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text className="text-[13px] text-slate-500 ml-1.5">
              Arrives: 12:00 PM
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#A0A5B1" />
      </TouchableOpacity>
    </>
  );
}
