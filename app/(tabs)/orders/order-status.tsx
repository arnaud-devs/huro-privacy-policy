import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderTimeline, { TimelineStep } from "@/components/orders/OrderTimeline";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cancelOrder, fetchOrderById, OrderDetail, OrderStatus } from "@/store/slices/ordersSlice";

const STATUS_STEPS: { status: OrderStatus; label: string; tsKey: keyof OrderDetail }[] = [
  { status: "PENDING_PAYMENT",  label: "Order placed",        tsKey: "createdAt" },
  { status: "PAID",             label: "Payment confirmed",   tsKey: "paidAt" },
  { status: "PREPARING",        label: "Preparing order",     tsKey: "preparedAt" },
  { status: "READY_FOR_PICKUP", label: "Ready for pickup",    tsKey: "preparedAt" },
  { status: "PICKED_UP",        label: "Picked up",           tsKey: "pickedUpAt" },
  { status: "IN_DELIVERY",      label: "Out for delivery",    tsKey: "pickedUpAt" },
  { status: "DELIVERED",        label: "Delivered",           tsKey: "deliveredAt" },
];

function fmtTs(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function buildSteps(current: OrderStatus, detail: OrderDetail): TimelineStep[] {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.status === current);
  if (currentIdx === -1) {
    return STATUS_STEPS.map((s) => ({ label: s.label, time: "—", status: "pending" }));
  }
  const nextIdx = currentIdx + 1;
  return STATUS_STEPS.map((s, i) => {
    const ts = detail[s.tsKey] as string | null | undefined;
    if (i <= currentIdx) {
      return { label: s.label, time: fmtTs(ts), status: "done" };
    } else if (i === nextIdx) {
      return { label: s.label, time: "Up next", status: "active" };
    } else {
      return { label: s.label, time: "Pending", status: "pending" };
    }
  });
}

const CANCELLABLE: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PREPARING"];

function fmt(n: number | string | null | undefined) {
  return Number(n ?? 0).toLocaleString();
}

export default function OrderStatusScreen() {
  const params = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderDetail, isLoadingDetail, detailError, isCancelling, lastOrderId } =
    useAppSelector((state) => state.orders);

  const orderId = params.orderId ?? lastOrderId ?? undefined;

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [orderId]);

  function handleCancel() {
    if (!orderId) return;
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
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
    ]);
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/orders")} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Status</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoadingDetail ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      ) : detailError || !orderDetail ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{detailError ?? "Order not found"}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => orderId && dispatch(fetchOrderById(orderId))}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── ORDER INFO ── */}
          <View style={styles.card}>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderIdLabel}>
                #{orderDetail.id.slice(0, 8).toUpperCase()}
              </Text>
              <View style={[
                styles.statusBadge,
                orderDetail.status === "DELIVERED" && styles.badgeGreen,
                orderDetail.status === "CANCELLED" || orderDetail.status === "EXPIRED"
                  ? styles.badgeRed : styles.badgeBlue,
              ]}>
                <Text style={styles.statusBadgeText}>{(orderDetail.status ?? "").replace(/_/g, " ")}</Text>
              </View>
            </View>
            <Text style={styles.orderDate}>Placed on {fmtDate(orderDetail.createdAt)}</Text>

            <View style={styles.divider} />

            {/* Items */}
            {(orderDetail.items ?? []).map((item, i) => (
              <View key={i} style={[styles.itemRow, i > 0 && { marginTop: 10 }]}>
                <Image
                  source={item.product?.imageUrls?.[0] ? { uri: item.product.imageUrls[0] } : undefined}
                  style={styles.itemThumb}
                  contentFit="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product?.name ?? "Product"}
                  </Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>RWF {fmt(item.unitPrice ?? item.lineTotal)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            {/* Pricing */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>RWF {fmt(orderDetail.subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery fee</Text>
              <Text style={styles.priceValue}>RWF {fmt(orderDetail.deliveryFee)}</Text>
            </View>
            <View style={[styles.priceRow, { marginBottom: 0 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>RWF {fmt(orderDetail.payableAmount)}</Text>
            </View>
          </View>

          {/* ── BATCH & DELIVERY ── */}
          {orderDetail.batch && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>DELIVERY SLOT</Text>
              <View style={styles.batchRow}>
                <View style={styles.batchIconCircle}>
                  <Ionicons name="time-outline" size={20} color="#1C74E9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.batchSlot}>{orderDetail.batch.slotLabel}</Text>
                  <Text style={styles.batchTime}>
                    Scheduled at {fmtTs(orderDetail.batch.scheduledAt)}
                  </Text>
                </View>
              </View>

              {orderDetail.batch.riders && orderDetail.batch.riders.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <Text style={[styles.sectionLabel, { marginBottom: 10 }]}>RIDER</Text>
                  {orderDetail.batch.riders.map((rider: any, i: number) => (
                    <View key={i} style={styles.batchRow}>
                      <View style={styles.batchIconCircle}>
                        <Ionicons name="bicycle-outline" size={20} color="#1C74E9" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.batchSlot}>{rider.fullName}</Text>
                        <Text style={styles.batchTime}>{rider.phone}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {/* ── TIMELINE ── */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PROGRESS</Text>
            <OrderTimeline steps={buildSteps(orderDetail.status, orderDetail)} />
          </View>

          {/* ── PICKUP CODE / QR ── */}
          {orderDetail.pickupSignature && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>
                {orderDetail.status === "IN_DELIVERY" || orderDetail.status === "PICKED_UP"
                  ? "DELIVERY QR CODE"
                  : "PICKUP CODE"}
              </Text>

              {orderDetail.status === "IN_DELIVERY" || orderDetail.status === "PICKED_UP" ? (
                <>
                  <Text style={styles.pickupHint}>
                    Show this QR code to your rider to confirm delivery. They will scan it to mark your order as delivered.
                  </Text>
                  <View style={styles.qrContainer}>
                    <View style={styles.qrBox}>
                      <QRCode
                        value={orderDetail.pickupSignature}
                        size={200}
                        color="#0F172A"
                        backgroundColor="white"
                      />
                    </View>
                    <View style={styles.codeChip}>
                      <Text style={styles.codeChipLabel}>Code</Text>
                      <Text style={styles.codeChipValue}>{orderDetail.pickupSignature}</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.pickupHint}>
                    Show this code at the <Text style={{ fontWeight: "700" }}>{orderDetail.snapshotZoneName}</Text> pickup station.
                  </Text>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{orderDetail.pickupSignature}</Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ── CANCEL ── */}
          {CANCELLABLE.includes(orderDetail.status) && (
            <TouchableOpacity
              style={[styles.cancelBtn, isCancelling && { opacity: 0.6 }]}
              onPress={handleCancel}
              disabled={isCancelling}
              activeOpacity={0.8}
            >
              {isCancelling ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.cancelText}>Cancel Order</Text>
              )}
            </TouchableOpacity>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#0f172a" },
  scroll: { padding: 16, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { fontSize: 14, color: "#ef4444", textAlign: "center", paddingHorizontal: 24 },
  retryBtn: { backgroundColor: "#1C74E9", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "white", fontWeight: "700" },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Order ID row
  orderIdRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  orderIdLabel: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  orderDate: { fontSize: 12, color: "#94a3b8", marginBottom: 14 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeBlue: { backgroundColor: "#eff6ff" },
  badgeGreen: { backgroundColor: "#d1fae5" },
  badgeRed: { backgroundColor: "#fef2f2" },
  statusBadgeText: { fontSize: 11, fontWeight: "700", color: "#1C74E9", textTransform: "uppercase" },

  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 14 },

  // Items
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemThumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: "#f1f5f9" },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#0f172a", marginBottom: 3 },
  itemQty: { fontSize: 12, color: "#64748b" },
  itemPrice: { fontSize: 13, fontWeight: "700", color: "#0f172a" },

  // Pricing
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  priceLabel: { fontSize: 13, color: "#64748b" },
  priceValue: { fontSize: 13, color: "#0f172a" },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  totalValue: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },

  // Batch
  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: "#94a3b8",
    letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12,
  },
  batchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  batchIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center",
  },
  batchSlot: { fontSize: 14, fontWeight: "700", color: "#0f172a", marginBottom: 2 },
  batchTime: { fontSize: 12, color: "#64748b" },

  // Pickup code
  pickupHint: { fontSize: 13, color: "#64748b", marginBottom: 14, lineHeight: 20 },
  codeBox: {
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1C74E9",
    borderStyle: "dashed",
    backgroundColor: "#eff6ff",
  },
  codeText: { fontSize: 40, fontWeight: "800", color: "#0f172a", letterSpacing: 8 },

  // QR code
  qrContainer: { alignItems: "center", gap: 16 },
  qrBox: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  codeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  codeChipLabel: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  codeChipValue: { fontSize: 24, fontWeight: "800", color: "#1C74E9", letterSpacing: 4 },

  // Cancel
  cancelBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { color: "white", fontSize: 15, fontWeight: "700" },
});
