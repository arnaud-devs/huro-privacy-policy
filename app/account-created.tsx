import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountCreatedScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 p-4 pb-6">
        <View className="flex-1 bg-white rounded-3xl shadow-sm shadow-black/5 overflow-hidden relative">
          {/* Blue top bar */}
          <View className="h-1.5 bg-primary w-full" />

          <View className="flex-1 px-6 pt-10 items-center">
            {/* Success Icon */}
            <View className="w-[100px] h-[100px] rounded-full bg-primary/10 justify-center items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-primary justify-center items-center">
                <Ionicons name="checkmark" size={40} color="white" />
              </View>
            </View>

            <Text className="text-[28px] font-bold text-slate-900 mb-4">Account Created!</Text>
            <Text className="text-base text-slate-600 text-center leading-6 mb-10">
              Welcome to <Text className="text-primary">One Campus</Text>, Alex!
              {"\n"}Your journey to a smarter campus{"\n"}life starts now.
            </Text>

            {/* ID Card */}
            <View className="flex-row items-center bg-slate-50 rounded-2xl p-4 w-full mb-10 border border-slate-100">
              <View className="w-12 h-12 rounded-full bg-rose-100 justify-center items-center mr-4">
                <Ionicons name="person" size={24} color="#64748B" style={{ marginTop: 4 }} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-slate-900 mb-1">Alex Thompson</Text>
                <Text className="text-[13px] text-slate-500">Student ID: #88294</Text>
              </View>
              <View className="bg-green-100 px-3 py-1.5 rounded-xl">
                <Text className="text-green-800 text-xs font-semibold">Active</Text>
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              className="bg-primary rounded-3xl h-[52px] w-full flex-row justify-center items-center mb-4 shadow-md shadow-primary/20"
              onPress={() => router.push("/(tabs)")}
            >
              <Text className="text-white text-base font-semibold mr-2">Go to Home</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-sm text-slate-400">
              Redirecting to dashboard in 5 seconds...
            </Text>
          </View>

          {/* Bottom overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-[100px] bg-blue-50/40" />
        </View>

        {/* Footer */}
        <View className="items-center mt-6">
          <Text className="text-sm text-slate-500">
            Need help getting started?{" "}
            <Text className="text-primary">Visit Help Center</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
