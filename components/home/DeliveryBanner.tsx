import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "@/store/hooks";
import { Batch } from "@/store/slices/batchesSlice";

function formatCountdown(scheduledAt: string): string {
  const diff = new Date(scheduledAt).getTime() - Date.now();
  if (diff <= 0) return "Soon";
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

interface Props {
  batch: Batch | null;
}

export default function DeliveryBanner({ batch }: Props) {
  const router = useRouter();
  const itemCount = useAppSelector((state) => state.cart.itemCount);

  const handleJoinBatch = () => {
    if (itemCount === 0) {
      Alert.alert(
        "Your cart is empty",
        "Browse the market and add items before joining a batch delivery.",
        [
          { text: "Shop Now", onPress: () => router.push("/(tabs)/market") },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      router.push("/cart");
    }
  };

  if (!batch) {
    return (
      <View className="bg-primary rounded-[20px] p-5 mb-6 items-center justify-center" style={{ minHeight: 120 }}>
        <Text className="text-white text-base font-semibold opacity-80">
          No open batches right now
        </Text>
        <Text className="text-white text-xs opacity-60 mt-1">
          Check back soon for the next delivery
        </Text>
      </View>
    );
  }

  const fill = Math.min(Math.max(batch.fillPercent ?? 0, 0), 100);
  const countdown = formatCountdown(batch.scheduledAt);
  const batchShort = batch.id.slice(0, 6).toUpperCase();

  return (
    <View className="bg-primary rounded-[20px] p-5 mb-6">
      <View className="flex-row justify-between items-start mb-3">
        <View className="bg-white/20 px-2.5 py-1 rounded-lg">
          <Text className="text-white text-xxs font-bold tracking-wide">
            {batch.slotLabel.toUpperCase()} BATCH #{batchShort}
          </Text>
        </View>
        <View className="bg-[#4AA0F9] px-3 py-1.5 rounded-xl items-center">
          <Text className="text-white text-xxs opacity-90">Arrives</Text>
          <Text className="text-white text-sm font-bold">{countdown}</Text>
        </View>
      </View>

      <Text className="text-white text-xl font-bold mb-5">
        Next Campus Delivery
      </Text>

      <View className="flex-row justify-between mb-2">
        <Text className="text-white text-sm">
          {batch.slotsRemaining > 0
            ? `${batch.slotsRemaining} slots remaining`
            : "Order window closing soon"}
        </Text>
        <Text className="text-white text-sm font-bold">{fill}% Full</Text>
      </View>

      <View className="h-1.5 bg-white/30 rounded-full mb-5">
        <View
          className="h-full bg-white rounded-full"
          style={{ width: `${fill}%` }}
        />
      </View>

      <TouchableOpacity
        className="bg-white rounded-xl h-11 flex-row justify-center items-center"
        onPress={handleJoinBatch}
      >
        <Ionicons name="cart-outline" size={20} color="#1C74E9" />
        <Text className="text-primary font-bold text-base ml-2">
          Join Batch Delivery
        </Text>
      </TouchableOpacity>
    </View>
  );
}
