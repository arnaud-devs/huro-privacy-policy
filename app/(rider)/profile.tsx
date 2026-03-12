import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RiderProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
      <Text className="text-lg font-bold text-slate-900">Profile</Text>
      <Text className="text-sm text-slate-500 mt-1">Coming soon</Text>
    </SafeAreaView>
  );
}
