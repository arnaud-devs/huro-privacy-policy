import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="flex-row justify-between items-center mb-5 mt-2">
      <View className="flex-row items-center">
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
      </View>
      <TouchableOpacity className="w-10 h-10 rounded-full bg-white justify-center items-center border border-slate-200">
        <Ionicons name="notifications-outline" size={22} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
}
