import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DeliveryOrderCardProps {
  order: {
    id: string;
    customerName: string;
    address: string;
    phone: string;
    amount: number;
    items: { productName: string; quantity: number; unitPrice?: number }[];
    pickupSignature: string | null;
  };
  index: number;
  hasArrived: boolean;
  onCall: (phone: string) => void;
  onVerify: (orderId: string) => void;
}

export function DeliveryOrderCard({
  order,
  index,
  hasArrived,
  onCall,
  onVerify,
}: DeliveryOrderCardProps) {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderNumberWrap}>
          <Text style={styles.orderNumber}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderCustomer}>{order.customerName}</Text>
          <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
        </View>
        <Text style={styles.itemBadge}>{order.items.length} items</Text>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={15} color="#64748B" />
          <Text style={styles.detailText}>{order.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={15} color="#64748B" />
          <Text style={styles.detailText}>{order.phone}</Text>
        </View>

        {/* Items list */}
        {order.items.length > 0 && (
          <View style={styles.itemsList}>
            {order.items.map((item, i) => (
              <View key={i} style={styles.itemLine}>
                <View style={styles.itemDot} />
                <Text style={styles.itemLineName} numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text style={styles.itemLineQty}>×{item.quantity}</Text>
                <Text style={styles.itemLinePrice}>
                  RWF {(item.unitPrice ?? 0).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total</Text>
              <Text style={styles.amountValue}>
                RWF {order.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Pickup signature code */}
        {order.pickupSignature && (
          <View style={styles.signatureRow}>
            <Ionicons name="key-outline" size={15} color="#1C74E9" />
            <Text style={styles.signatureLabel}>Pickup Code:</Text>
            <Text style={styles.signatureCode}>{order.pickupSignature}</Text>
          </View>
        )}
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => onCall(order.phone)}
        >
          <Ionicons name="call" size={16} color="#10B981" />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.verifyBtn, !hasArrived && styles.verifyBtnDisabled]}
          activeOpacity={0.85}
          disabled={!hasArrived}
          onPress={() => onVerify(order.id)}
        >
          <Ionicons
            name="qr-code-outline"
            size={16}
            color={hasArrived ? "white" : "#94A3B8"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[styles.verifyBtnText, !hasArrived && { color: "#94A3B8" }]}
          >
            Verify & Deliver
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  orderNumberWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  orderNumber: { fontSize: 13, fontWeight: "800", color: "#1C74E9" },
  orderCustomer: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  orderId: { fontSize: 11, color: "#94A3B8", fontWeight: "500", marginTop: 1 },
  itemBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderDetails: {
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 12,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#475569", fontWeight: "500" },
  orderActions: { flexDirection: "row", gap: 10 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  callBtnText: { fontSize: 13, fontWeight: "700", color: "#10B981" },
  verifyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1C74E9",
  },
  verifyBtnDisabled: { backgroundColor: "#E2E8F0" },
  verifyBtnText: { fontSize: 13, fontWeight: "700", color: "white" },
  itemsList: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 6,
  },
  itemLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1C74E9",
  },
  itemLineName: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  itemLineQty: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    minWidth: 24,
    textAlign: "right",
  },
  itemLinePrice: {
    fontSize: 12,
    color: "#64748B",
    minWidth: 80,
    textAlign: "right",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 4,
  },
  amountLabel: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  amountValue: { fontSize: 13, fontWeight: "800", color: "#1C74E9" },
  signatureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    gap: 6,
  },
  signatureLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  signatureCode: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1C74E9",
    letterSpacing: 2,
  },
});
