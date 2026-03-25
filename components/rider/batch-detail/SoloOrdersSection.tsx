import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { type BatchOrder } from "@/store/slices/riderSlice";

interface SoloOrdersSectionProps {
  myClaimedOrders: BatchOrder[];
  totalItems: (order: BatchOrder) => number;
  onOrderPress: (orderId: string) => void;
}

export default function SoloOrdersSection({
  myClaimedOrders,
  totalItems,
  onOrderPress,
}: SoloOrdersSectionProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Ionicons name="bag-handle" size={16} color="#1C74E9" />
        <Text style={styles.sectionTitle}>
          MY ORDERS ({myClaimedOrders.length})
        </Text>
      </View>

      {myClaimedOrders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="bag-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>No orders in this batch yet</Text>
        </View>
      ) : (
        myClaimedOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, styles.claimedCard]}
            activeOpacity={0.7}
            onPress={() => onOrderPress(order.id)}
          >
            <View style={styles.orderCardHeader}>
              <View style={styles.orderIdWrap}>
                <Ionicons name="bag-check" size={16} color="#1C74E9" />
                <Text style={styles.orderId}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[styles.claimedBadge, { backgroundColor: "#DBEAFE", color: "#1C74E9" }]}>
                  ASSIGNED
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
              </View>
            </View>
            <Text style={styles.orderItemsList}>
              {(order.orderItems ?? [])
                .map((i) => `${i.productName} x${i.quantity}`)
                .join(", ")}
            </Text>
            <Text style={styles.orderItemCount}>
              {totalItems(order)} item(s)
            </Text>
          </TouchableOpacity>
        ))
      )}

      {/* Solo rider info banner */}
      <View style={styles.soloInfoBanner}>
        <Ionicons name="information-circle" size={18} color="#1C74E9" />
        <Text style={styles.soloInfoText}>
          You are the only rider on this batch. All orders are assigned to you.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 0.8,
    flex: 1,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  claimedCard: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIdWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderId: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  claimedBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderItemsList: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  orderItemCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 10,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  soloInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  soloInfoText: {
    flex: 1,
    fontSize: 13,
    color: "#1C74E9",
    fontWeight: "500",
    lineHeight: 18,
  },
});
