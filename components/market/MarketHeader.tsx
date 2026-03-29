import { Text, View } from "react-native";
import CartIconButton from "@/components/common/CartIconButton";
import NotificationIconButton from "@/components/common/NotificationIconButton";

export default function MarketHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <Text className="text-xl font-extrabold text-slate-900">Market</Text>
      <View className="flex-row items-center gap-4">
        <CartIconButton />
        <NotificationIconButton />
      </View>
    </View>
  );
}
