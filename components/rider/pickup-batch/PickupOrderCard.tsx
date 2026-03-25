import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ItemStatus, PickupOrder } from "@/hooks/usePickupBatch";

interface Props {
  order: PickupOrder;
  isLocked: boolean;
  onToggleItem: (orderId: string, itemId: string) => void;
}

function StatusIcon({ status }: { status: ItemStatus }) {
  switch (status) {
    case "collected":
      return <Ionicons name="checkmark-circle" size={22} color="#10B981" />;
    case "out-of-stock":
      return <Ionicons name="close-circle" size={22} color="#EF4444" />;
    default:
      return <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />;
  }
}

export function PickupOrderCard({ order, isLocked, onToggleItem }: Props) {
  const router = useRouter();
  const orderCollected = order.items.filter((i) => i.status === "collected").length;
  const orderDone = orderCollected === order.items.length;

  return (
    <View style={[styles.orderCard, orderDone && styles.orderCardDone]}>
      <TouchableOpacity
        style={styles.orderHeader}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/(rider)/order-detail",
            params: { orderId: order.orderId },
          })
        }
      >
        <View>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.orderIdText}>
            #{order.orderId.slice(0, 8).toUpperCase()}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={[
              styles.orderStatusBadge,
              isLocked || orderDone
                ? { backgroundColor: "#DCFCE7" }
                : { backgroundColor: "#FEF3C7" },
            ]}
          >
            <Text
              style={[
                styles.orderStatusText,
                isLocked || orderDone ? { color: "#10B981" } : { color: "#F59E0B" },
              ]}
            >
              {isLocked ? "PICKED UP" : orderDone ? "READY" : `${orderCollected}/${order.items.length}`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </View>
      </TouchableOpacity>

      {isLocked && (
        <View style={styles.alreadyPickedBanner}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.alreadyPickedText}>
            Already picked up — cannot be modified
          </Text>
        </View>
      )}

      {order.items.map((item, idx) => (
        <TouchableOpacity
          key={`${order.orderId}-${item.id || idx}`}
          style={styles.itemRow}
          activeOpacity={isLocked ? 1 : 0.6}
          onPress={() => !isLocked && onToggleItem(order.orderId, item.id)}
        >
          <StatusIcon status={item.status} />
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
          {!isLocked && (
            <Text style={styles.tapHint}>
              {item.status === "not-collected"
                ? "Tap to collect"
                : item.status === "collected"
                ? "Tap: out of stock"
                : "Tap: reset"}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  alreadyPickedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  alreadyPickedText: { fontSize: 12, color: "#166534", fontWeight: "600", flex: 1 },
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
});
