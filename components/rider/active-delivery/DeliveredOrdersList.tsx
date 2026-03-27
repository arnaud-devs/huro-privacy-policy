import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface DeliveredOrdersListProps {
  deliveredOrders: { id: string; customerName: string; address: string }[];
}

export function DeliveredOrdersList({ deliveredOrders }: DeliveredOrdersListProps) {
  return (
    <>
      <View style={[styles.sectionHeaderWrap, { marginTop: 16 }]}>
        <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
        <Text style={[styles.sectionTitle, { color: "#10B981" }]}>
          DELIVERED ({deliveredOrders.length})
        </Text>
      </View>

      {deliveredOrders.map((order) => (
        <View key={order.id} style={styles.deliveredCard}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveredName}>{order.customerName}</Text>
            <Text style={styles.deliveredAddress}>{order.address}</Text>
          </View>
          <Text style={styles.deliveredBadge}>DONE</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 0.8,
  },
  deliveredCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveredName: { fontSize: 14, fontWeight: "600", color: "#10B981" },
  deliveredAddress: { fontSize: 12, color: "#6EE7B7", marginTop: 2 },
  deliveredBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
