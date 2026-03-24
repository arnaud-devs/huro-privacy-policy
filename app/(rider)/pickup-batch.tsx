import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBatchDetail,
  loadSampleBatchDetail,
  setDeliveryPhase,
  SAMPLE_ORDER_DETAILS,
} from "@/store/slices/riderSlice";

type ItemStatus = "not-collected" | "collected" | "out-of-stock";

interface PickupItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
}

interface PickupOrder {
  orderId: string;
  customerName: string;
  items: PickupItem[];
}

export default function PickupBatchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const { batchDetail, isLoadingBatchDetail, claimedOrderIds } = useAppSelector(
    (state) => state.rider
  );

  const [pickupOrders, setPickupOrders] = useState<PickupOrder[]>([]);

  useEffect(() => {
    if (batchId) {
      dispatch(fetchBatchDetail(batchId)).then((result) => {
        if (fetchBatchDetail.rejected.match(result)) {
          dispatch(loadSampleBatchDetail(batchId));
        }
      });
    }
  }, [batchId]);

  // Build pickup orders from claimed orders only
  useEffect(() => {
    const orders = batchDetail?.orders ?? [];
    const claimed = orders.filter((o) => claimedOrderIds.includes(o.id));

    const mapped: PickupOrder[] = claimed.map((order) => {
      const detail = SAMPLE_ORDER_DETAILS[order.id];
      return {
        orderId: order.id,
        customerName: detail?.snapshotName ?? `Order #${order.id.slice(0, 6).toUpperCase()}`,
        items: (order.orderItems ?? []).map((item) => ({
          id: item.id,
          name: item.productName,
          quantity: item.quantity,
          status: "not-collected" as ItemStatus,
        })),
      };
    });

    setPickupOrders(mapped);
  }, [batchDetail, claimedOrderIds]);

  const totalItems = pickupOrders.reduce(
    (sum, o) => sum + o.items.length,
    0
  );
  const collectedItems = pickupOrders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.status === "collected").length,
    0
  );
  const allCollected = totalItems > 0 && collectedItems === totalItems;

  const toggleItem = (orderId: string, itemId: string) => {
    setPickupOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) => {
            if (item.id !== itemId) return item;
            const next: ItemStatus =
              item.status === "not-collected"
                ? "collected"
                : item.status === "collected"
                ? "out-of-stock"
                : "not-collected";
            return { ...item, status: next };
          }),
        };
      })
    );
  };

  const handleStartDelivery = () => {
    const outOfStock = pickupOrders.some((o) =>
      o.items.some((i) => i.status === "out-of-stock")
    );
    const notCollected = pickupOrders.some((o) =>
      o.items.some((i) => i.status === "not-collected")
    );

    if (notCollected) {
      Alert.alert(
        "Items Not Collected",
        "Some items are still not collected. Please collect or mark them as out-of-stock before starting delivery."
      );
      return;
    }

    if (outOfStock) {
      Alert.alert(
        "Out of Stock Items",
        "Some items are out of stock. The customer will be notified. Continue with delivery?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              dispatch(setDeliveryPhase("delivering"));
              router.push("/(rider)/active-delivery");
            },
          },
        ]
      );
      return;
    }

    dispatch(setDeliveryPhase("delivering"));
    router.push("/(rider)/active-delivery");
  };

  const statusIcon = (status: ItemStatus) => {
    switch (status) {
      case "collected":
        return <Ionicons name="checkmark-circle" size={22} color="#10B981" />;
      case "out-of-stock":
        return <Ionicons name="close-circle" size={22} color="#EF4444" />;
      default:
        return <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />;
    }
  };

  if (isLoadingBatchDetail) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1C74E9" />
          <Text style={styles.loadingText}>Loading pickup...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            {collectedItems} / {totalItems} items collected
          </Text>
          <Text style={styles.progressPercent}>
            {totalItems > 0 ? Math.round((collectedItems / totalItems) * 100) : 0}%
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  totalItems > 0 ? (collectedItems / totalItems) * 100 : 0
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pickupOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="bag-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No claimed orders</Text>
            <Text style={styles.emptySubtitle}>
              Go back to batch details to claim orders first
            </Text>
          </View>
        ) : (
          pickupOrders.map((order) => {
            const orderCollected = order.items.filter(
              (i) => i.status === "collected"
            ).length;
            const orderDone = orderCollected === order.items.length;

            return (
              <View
                key={order.orderId}
                style={[styles.orderCard, orderDone && styles.orderCardDone]}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                    <Text style={styles.orderIdText}>
                      #{order.orderId.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.orderStatusBadge,
                      orderDone
                        ? { backgroundColor: "#DCFCE7" }
                        : { backgroundColor: "#FEF3C7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderStatusText,
                        orderDone
                          ? { color: "#10B981" }
                          : { color: "#F59E0B" },
                      ]}
                    >
                      {orderDone ? "READY" : `${orderCollected}/${order.items.length}`}
                    </Text>
                  </View>
                </View>

                {order.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemRow}
                    activeOpacity={0.6}
                    onPress={() => toggleItem(order.orderId, item.id)}
                  >
                    {statusIcon(item.status)}
                    <View style={styles.itemInfo}>
                      <Text
                        style={[
                          styles.itemName,
                          item.status === "collected" && styles.itemCollected,
                          item.status === "out-of-stock" && styles.itemOutOfStock,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.tapHint}>
                      {item.status === "not-collected"
                        ? "Tap to collect"
                        : item.status === "collected"
                        ? "Tap: out of stock"
                        : "Tap: reset"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Button */}
      {pickupOrders.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.deliveryBtn,
              !allCollected && styles.deliveryBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleStartDelivery}
          >
            <Ionicons
              name="bicycle-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.deliveryBtnText}>
              {allCollected ? "Start Delivery" : "Collect All Items First"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#64748B", marginTop: 12, fontSize: 14 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },

  progressSection: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  progressPercent: { fontSize: 13, color: "#1C74E9", fontWeight: "700" },
  progressTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 4,
  },

  scrollContent: { padding: 16, paddingBottom: 100 },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#64748B", marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: "#94A3B8", marginTop: 4 },

  orderCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderCardDone: {
    borderWidth: 1,
    borderColor: "#10B981",
    backgroundColor: "#FAFFFE",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  customerName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  orderIdText: { fontSize: 12, color: "#94A3B8", fontWeight: "500", marginTop: 2 },
  orderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusText: { fontSize: 11, fontWeight: "700" },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    gap: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, color: "#0F172A", fontWeight: "600" },
  itemCollected: { textDecorationLine: "line-through", color: "#10B981" },
  itemOutOfStock: { textDecorationLine: "line-through", color: "#EF4444" },
  itemQty: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  tapHint: { fontSize: 10, color: "#CBD5E1", fontWeight: "500" },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  deliveryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deliveryBtnDisabled: {
    backgroundColor: "#94A3B8",
    shadowColor: "#94A3B8",
  },
  deliveryBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
});
