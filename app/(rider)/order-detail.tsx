import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRiderOrderDetail, markOrderDelivered } from "@/store/slices/riderSlice";

function fmt(n: number) {
  return (n ?? 0).toLocaleString();
}

function statusColor(status: string) {
  if (status === "DELIVERED") return { bg: "#dcfce7", text: "#16a34a" };
  if (status === "CANCELLED" || status === "EXPIRED") return { bg: "#fee2e2", text: "#dc2626" };
  return { bg: "#eff6ff", text: "#1C74E9" };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function RiderOrderDetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orderDetail, isLoadingOrderDetail, orderDetailError, isMarkingDelivered } = useAppSelector(
    (state) => state.rider
  );

  async function handleMarkDelivered() {
    if (!orderId) return;
    const result = await dispatch(markOrderDelivered(orderId));
    if (markOrderDelivered.fulfilled.match(result)) {
      router.back();
    } else {
      const { Alert } = await import("react-native");
      Alert.alert("Failed", (result.payload as string) || "Could not mark order as delivered.");
    }
  }

  useEffect(() => {
    if (orderId) dispatch(fetchRiderOrderDetail(orderId));
  }, [orderId]);

  if (isLoadingOrderDetail) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      </SafeAreaView>
    );
  }

  if (orderDetailError || !orderDetail) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{orderDetailError ?? "Order not found"}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => orderId && dispatch(fetchRiderOrderDetail(orderId))}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const color = statusColor(orderDetail.status);
  const allItems = orderDetail.orderItems ?? orderDetail.items ?? [];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Status + ID */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={[styles.badge, { backgroundColor: color.bg }]}>
              <Text style={[styles.badgeText, { color: color.text }]}>{orderDetail.status.replace(/_/g, " ")}</Text>
            </View>
            <Text style={styles.amount}>RWF {fmt(orderDetail.payableAmount)}</Text>
          </View>
          <Text style={styles.orderId}>#{orderDetail.id.slice(0, 8).toUpperCase()}</Text>
          {orderDetail.pickupSignature && (
            <View style={styles.signatureWrap}>
              <Ionicons name="qr-code-outline" size={16} color="#1C74E9" />
              <Text style={styles.signatureLabel}>Pickup Code: </Text>
              <Text style={styles.signatureCode}>{orderDetail.pickupSignature}</Text>
            </View>
          )}
        </View>

        {/* Customer info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CUSTOMER</Text>
          <Row label="Name" value={orderDetail.snapshotName} />
          <Row label="Phone" value={orderDetail.snapshotPhone} />
          <Row label="Zone" value={orderDetail.snapshotZoneName} />
          {orderDetail.customAddress ? (
            <Row label="Address" value={orderDetail.customAddress} />
          ) : null}
        </View>

        {/* Order items */}
        {allItems.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>ITEMS</Text>
            {allItems.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <View style={styles.itemDot} />
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.productName} × {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>RWF {fmt(item.unitPrice)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Price breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PAYMENT</Text>
          <Row label="Subtotal" value={`RWF ${fmt(orderDetail.subtotal)}`} />
          <Row label="Delivery Fee" value={`RWF ${fmt(orderDetail.deliveryFee)}`} />
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { fontWeight: "700", color: "#0f172a" }]}>Total</Text>
            <Text style={[styles.rowValue, { fontWeight: "700", color: "#1C74E9" }]}>
              RWF {fmt(orderDetail.payableAmount)}
            </Text>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {orderDetail.status !== "DELIVERED" &&
        orderDetail.status !== "CANCELLED" &&
        orderDetail.status !== "EXPIRED" && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.deliverBtn, isMarkingDelivered && { opacity: 0.6 }]}
              activeOpacity={0.85}
              disabled={isMarkingDelivered}
              onPress={handleMarkDelivered}
            >
              {isMarkingDelivered ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.deliverBtnText}>Mark as Delivered</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { color: "#64748b", fontSize: 15, textAlign: "center", marginBottom: 16 },
  retryBtn: { backgroundColor: "#1C74E9", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText: { color: "white", fontWeight: "700" },

  scroll: { padding: 16 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  amount: { fontSize: 16, fontWeight: "800", color: "#1C74E9" },
  orderId: { fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 8 },
  signatureWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#eff6ff", padding: 10, borderRadius: 10 },
  signatureLabel: { fontSize: 13, color: "#64748b", marginLeft: 6 },
  signatureCode: { fontSize: 16, fontWeight: "800", color: "#1C74E9" },

  sectionTitle: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.8, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { fontSize: 14, color: "#64748b" },
  rowValue: { fontSize: 14, color: "#0f172a", fontWeight: "600" },

  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  itemDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#1C74E9", marginRight: 10 },
  itemName: { flex: 1, fontSize: 14, color: "#0f172a", fontWeight: "500" },
  itemPrice: { fontSize: 14, color: "#64748b" },

  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },

  footer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  deliverBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deliverBtnText: { fontSize: 16, fontWeight: "700", color: "white" },
});
