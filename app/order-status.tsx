import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderTimeline, { TimelineStep } from "@/components/orders/OrderTimeline";
import PickupDetails from "@/components/orders/PickupDetails";

const ORDER_STATUS: Record<
  string,
  {
    steps: TimelineStep[];
    pickupCode: string;
    pickupLocation: string;
  }
> = {
  "1": {
    steps: [
      { label: "Order received", time: "10:00 AM", status: "done" },
      { label: "Rider collecting", time: "10:30 AM", status: "done" },
      { label: "Arrived at campus", time: "10:45 AM", status: "done" },
      { label: "Ready for pickup", time: "Just now", status: "active" },
    ],
    pickupCode: "4821",
    pickupLocation: "Main Gate",
  },
  "2": {
    steps: [
      { label: "Order received", time: "11:00 AM", status: "done" },
      { label: "Rider collecting", time: "11:20 AM", status: "done" },
      { label: "Arrived at campus", time: "pending", status: "active" },
      { label: "Ready for pickup", time: "pending", status: "pending" },
    ],
    pickupCode: "3317",
    pickupLocation: "Main Gate",
  },
};

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const status = ORDER_STATUS[orderId ?? "1"];

  if (!status) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-base text-slate-500">Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 text-center mr-7">
          Order Status
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Timeline card */}
        <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <OrderTimeline steps={status.steps} />
        </View>

        {/* Pickup Details */}
        <PickupDetails
          code={status.pickupCode}
          location={status.pickupLocation}
        />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
