import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrderById, OrderStatus } from "@/store/slices/ordersSlice";

const STATUS_STEPS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PREPARING",
  "READY_FOR_PICKUP",
  "IN_DELIVERY",
  "DELIVERED",
];

function stepLabel(status: OrderStatus): string {
  return {
    PENDING_PAYMENT: "Pending Payment",
    PAID: "Payment Confirmed",
    PREPARING: "Preparing Order",
    READY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    IN_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
  }[status] ?? status;
}

function statusColor(status: OrderStatus) {
  if (status === "DELIVERED") return { bg: "#dcfce7", text: "#16a34a" };
  if (status === "CANCELLED" || status === "EXPIRED") return { bg: "#fee2e2", text: "#dc2626" };
  return { bg: "#eff6ff", text: "#1C74E9" };
}

function fmt(n: number) {
  return (n ?? 0).toLocaleString();
}

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { orderDetail, isLoadingDetail, detailError } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [orderId]);

  if (isLoadingDetail) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-slate-900 text-center mr-7">Order Details</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      </SafeAreaView>
    );
  }

  if (detailError || !orderDetail) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center" edges={["top"]}>
        <Text className="text-base text-slate-500 mb-4">{detailError ?? "Order not found"}</Text>
        <TouchableOpacity onPress={() => orderId && dispatch(fetchOrderById(orderId))}
          className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const color = statusColor(orderDetail.status);
  const total = (orderDetail.subtotal ?? 0) + (orderDetail.deliveryFee ?? 0);
  const firstItem = orderDetail.items?.[0];
  const placedAt = new Date(orderDetail.createdAt).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  // Build timeline steps
  const currentIdx = STATUS_STEPS.indexOf(orderDetail.status);
  const timelineSteps = STATUS_STEPS.map((s, i) => ({
    label: stepLabel(s),
    time: i <= currentIdx ? (i === currentIdx ? "Current" : "Done") : "Pending",
    status: i < currentIdx ? "done" : i === currentIdx ? "active" : "pending",
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 text-center mr-7">
          Order Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Summary card */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          <View className="flex-row items-center justify-between mb-2">
            <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
              <Text style={[styles.statusText, { color: color.text }]}>
                {stepLabel(orderDetail.status)}
              </Text>
            </View>
            <Text className="text-base font-bold text-primary">
              RWF {fmt(total)}
            </Text>
          </View>

          <Text className="text-xl font-bold text-slate-900">
            #{orderDetail.pickupSignature}
          </Text>
          <Text className="text-xs text-slate-500 mt-0.5 mb-4">
            Placed on {placedAt}
          </Text>

          {firstItem ? (
            <View className="flex-row items-center bg-slate-50 rounded-2xl p-3">
              <Image
                source={firstItem.product?.imageUrls?.[0] ? { uri: firstItem.product.imageUrls[0] } : undefined}
                style={styles.productImage}
                contentFit="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                  {firstItem.product?.name ?? "Product"}
                  {(orderDetail.items?.length ?? 0) > 1 ? ` +${orderDetail.items!.length - 1} more` : ""}
                </Text>
                <Text className="text-xs text-slate-500 mt-0.5">
                  Qty: {firstItem.quantity}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Price breakdown */}
          <View className="mt-4 pt-4 border-t border-slate-100">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-slate-500">Subtotal</Text>
              <Text className="text-sm text-slate-900">RWF {fmt(orderDetail.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-slate-500">Delivery Fee</Text>
              <Text className="text-sm text-slate-900">RWF {fmt(orderDetail.deliveryFee)}</Text>
            </View>
          </View>
        </View>

        {/* QR Code — shown when order is out for delivery */}
        {(orderDetail.status === "IN_DELIVERY" || orderDetail.status === "PICKED_UP") &&
          orderDetail.pickupSignature && (
            <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-slate-100 items-center">
              <View className="flex-row items-center mb-3">
                <Ionicons name="qr-code-outline" size={18} color="#1C74E9" />
                <Text className="text-base font-bold text-slate-900 ml-2">
                  Delivery QR Code
                </Text>
              </View>
              <Text className="text-xs text-slate-500 text-center mb-5 leading-5">
                Show this QR code to your rider to confirm delivery.
              </Text>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={orderDetail.pickupSignature}
                  size={200}
                  color="#0F172A"
                  backgroundColor="white"
                />
              </View>
              <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>Code</Text>
                <Text style={styles.codeValue}>{orderDetail.pickupSignature}</Text>
              </View>
            </View>
          )}

        {/* Tracking timeline */}
        {orderDetail.status !== "CANCELLED" && orderDetail.status !== "EXPIRED" && (
          <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Tracking Status
            </Text>
            {timelineSteps.map((step, index) => {
              const isLast = index === timelineSteps.length - 1;
              return (
                <View key={index} className="flex-row">
                  <View className="items-center mr-4" style={styles.dotCol}>
                    <View style={[
                      styles.dot,
                      step.status === "done" && styles.dotDone,
                      step.status === "active" && styles.dotActive,
                      step.status === "pending" && styles.dotPending,
                    ]}>
                      {step.status === "done" && <Ionicons name="checkmark" size={12} color="white" />}
                    </View>
                    {!isLast && <View style={[styles.connector,
                      step.status === "pending" && { backgroundColor: "#e2e8f0" }]} />}
                  </View>
                  <View className="pb-5 flex-1">
                    <Text className="text-sm font-bold"
                      style={{ color: step.status === "pending" ? "#94a3b8" : "#0f172a" }}>
                      {step.label}
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Delivery location */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={18} color="#0f172a" />
            <Text className="text-base font-bold text-slate-900 ml-2">Delivery Location</Text>
          </View>
          <Text className="text-base font-bold text-slate-900 mt-1">
            {orderDetail.snapshotZoneName}
          </Text>
          {orderDetail.customAddress ? (
            <Text className="text-sm text-slate-500 mt-1">{orderDetail.customAddress}</Text>
          ) : null}
        </View>

        {/* Payment info */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          <View className="flex-row items-center mb-3">
            <Ionicons name="card-outline" size={18} color="#0f172a" />
            <Text className="text-base font-bold text-slate-900 ml-2">Payment</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm text-slate-500">Name</Text>
            <Text className="text-sm font-semibold text-slate-900">{orderDetail.snapshotName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-slate-500">Phone</Text>
            <Text className="text-sm font-semibold text-slate-900">{orderDetail.snapshotPhone}</Text>
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  productImage: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#f1f5f9" },
  dotCol: { width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dotDone: { backgroundColor: "#1C74E9" },
  dotActive: { backgroundColor: "#1C74E9" },
  dotPending: { backgroundColor: "#e2e8f0" },
  connector: { width: 2, flex: 1, backgroundColor: "#1C74E9", marginTop: 2, marginBottom: 2, minHeight: 16 },
  qrWrapper: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    gap: 8,
  },
  codeLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  codeValue: { fontSize: 22, fontWeight: "800", color: "#1C74E9", letterSpacing: 4 },
});
