import { StyleSheet, Text, View } from "react-native";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
}

interface Props {
  orderId: string;
  items: OrderItem[];
  total: number;
}

export function OrderSummaryCard({ orderId, items, total }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Order Summary</Text>
      <Text style={styles.orderId}>#{orderId.slice(0, 8).toUpperCase()}</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.productName}</Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total.toLocaleString()} NGN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  orderId: { fontSize: 12, color: "#94A3B8", fontWeight: "600", marginBottom: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  itemName: { fontSize: 14, color: "#334155", fontWeight: "500" },
  itemQty: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalLabel: { fontSize: 14, color: "#0F172A", fontWeight: "700" },
  totalValue: { fontSize: 16, color: "#1C74E9", fontWeight: "800" },
});
