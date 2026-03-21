import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderTimeline, { TimelineStep } from "@/components/orders/OrderTimeline";
import PickupDetails from "@/components/orders/PickupDetails";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cancelOrder, fetchOrderById, OrderStatus } from "@/store/slices/ordersSlice";

const STATUS_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT",  label: "Order placed" },
  { status: "PAID",             label: "Payment confirmed" },
  { status: "PREPARING",        label: "Preparing order" },
  { status: "READY_FOR_PICKUP", label: "Ready for pickup" },
  { status: "PICKED_UP",        label: "Picked up" },
  { status: "IN_DELIVERY",      label: "Out for delivery" },
  { status: "DELIVERED",        label: "Delivered" },
];

function buildSteps(current: OrderStatus): TimelineStep[] {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.status === current);
  if (currentIdx === -1) {
    // Status not in timeline (e.g. CANCELLED/EXPIRED) — show all as pending
    return STATUS_STEPS.map((s) => ({ label: s.label, time: "Pending", status: "pending" }));
  }
  const nextIdx = currentIdx + 1;
  return STATUS_STEPS.map((s, i) => ({
    label: s.label,
    time: i <= currentIdx ? "Done" : i === nextIdx ? "Now" : "Pending",
    status: i <= currentIdx ? "done" : i === nextIdx ? "active" : "pending",
  }));
}

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PREPARING"];

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderDetail, isLoadingDetail, detailError, isCancelling } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [orderId]);

  function handleCancel() {
    if (!orderId) return;
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const result = await dispatch(cancelOrder(orderId));
            if (cancelOrder.fulfilled.match(result)) {
              Alert.alert("Order Cancelled", "Your order has been cancelled.", [
                { text: "OK", onPress: () => router.replace("/(tabs)/orders") },
              ]);
            } else {
              Alert.alert("Cannot Cancel", (result.payload as string) || "This order cannot be cancelled.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.replace("/(tabs)/orders")} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 text-center mr-7">
          Order Status
        </Text>
      </View>

      {isLoadingDetail ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      ) : detailError || !orderDetail ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-slate-500 text-center mb-4">
            {detailError ?? "Order not found"}
          </Text>
          <TouchableOpacity
            onPress={() => orderId && dispatch(fetchOrderById(orderId))}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="mx-4 mt-4 bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <OrderTimeline steps={buildSteps(orderDetail.status)} />
          </View>

          <PickupDetails
            code={orderDetail.pickupSignature}
            location={orderDetail.snapshotZoneName}
          />

          {CANCELLABLE_STATUSES.includes(orderDetail.status) && (
            <View className="mx-4 mt-4">
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isCancelling}
                className="bg-red-500 rounded-2xl py-4 items-center"
                style={{ opacity: isCancelling ? 0.6 : 1 }}
              >
                {isCancelling ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Cancel Order</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
