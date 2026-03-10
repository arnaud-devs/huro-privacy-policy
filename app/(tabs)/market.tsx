import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MarketScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Market</Text>
    </SafeAreaView>
  );
}
