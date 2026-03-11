import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function DeliveryBanner() {
  return (
    <View className="bg-primary rounded-[20px] p-5 mb-6">
      <View className="flex-row justify-between items-start mb-3">
        <View className="bg-white/20 px-2.5 py-1 rounded-lg">
          <Text className="text-white text-xxs font-bold tracking-wide">
            ACTIVE BATCH #125
          </Text>
        </View>
        <View className="bg-[#4AA0F9] px-3 py-1.5 rounded-xl items-center">
          <Text className="text-white text-xxs opacity-90">Arrives</Text>
          <Text className="text-white text-sm font-bold">1h 20m</Text>
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-5">
        Next Campus Delivery
      </Text>

      <View className="flex-row justify-between mb-2">
        <Text className="text-white text-sm">Order window closing soon</Text>
        <Text className="text-white text-sm font-bold">75% Full</Text>
      </View>

      <View className="h-1.5 bg-white/30 rounded-full mb-5">
        <View className="h-full bg-white rounded-full w-3/4" />
      </View>

      <TouchableOpacity className="bg-white rounded-xl h-11 flex-row justify-center items-center">
        <Ionicons name="cart-outline" size={20} color="#1C74E9" />
        <Text className="text-primary font-bold text-base ml-2">
          Join Batch Delivery
        </Text>
      </TouchableOpacity>
    </View>
  );
}
