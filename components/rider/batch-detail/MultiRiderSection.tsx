import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { type BatchOrder } from "@/store/slices/riderSlice";

interface MultiRiderSectionProps {
  myClaimedOrders: BatchOrder[];
  availableOrders: BatchOrder[];
  takenOrders: BatchOrder[];
  selectedIds: string[];
  totalItems: (order: BatchOrder) => number;
  onToggle: (orderId: string) => void;
  onSelectAll: () => void;
  onOrderPress: (orderId: string) => void;
}

export default function MultiRiderSection({
  myClaimedOrders,
  availableOrders,
  takenOrders,
  selectedIds,
  totalItems,
  onToggle,
  onSelectAll,
  onOrderPress,
}: MultiRiderSectionProps) {
  return (
    <>
      {/* My Claimed Orders */}
      {myClaimedOrders.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: "#10B981" }]}>
              MY CLAIMED ORDERS ({myClaimedOrders.length})
            </Text>
          </View>
          {myClaimedOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, styles.claimedCard]}
              activeOpacity={0.7}
              onPress={() => onOrderPress(order.id)}
            >
              <View style={styles.orderCardHeader}>
                <View style={styles.orderIdWrap}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.orderId}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.claimedBadge}>CLAIMED</Text>
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
          ))}
        </>
      )}

      {/* Available Orders */}
      <View style={styles.sectionHeader}>
        <Ionicons name="bag-outline" size={16} color="#1C74E9" />
        <Text style={styles.sectionTitle}>
          AVAILABLE ORDERS ({availableOrders.length})
        </Text>
        {availableOrders.length > 0 && (
          <TouchableOpacity onPress={onSelectAll} style={styles.selectAllBtn}>
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
        )}
      </View>

      {availableOrders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="bag-check-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>All orders have been claimed</Text>
        </View>
      ) : (
        availableOrders.map((order) => {
          const isSelected = selectedIds.includes(order.id);
          return (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, isSelected && styles.selectedCard]}
              activeOpacity={0.7}
              onPress={() => onToggle(order.id)}
            >
              <View style={styles.orderCardHeader}>
                <View style={styles.orderIdWrap}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxChecked,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text style={styles.orderId}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.itemCountBadge}>
                  {totalItems(order)} items
                </Text>
              </View>
              <Text style={styles.orderItemsList}>
                {(order.orderItems ?? [])
                  .map((i) => `${i.productName} x${i.quantity}`)
                  .join(", ")}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      {/* Taken Orders */}
      {takenOrders.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={16} color="#94A3B8" />
            <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>
              TAKEN BY OTHERS ({takenOrders.length})
            </Text>
          </View>
          {takenOrders.map((order) => (
            <View key={order.id} style={[styles.orderCard, styles.takenCard]}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderIdWrap}>
                  <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                  <Text style={[styles.orderId, { color: "#94A3B8" }]}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.takenBadge}>TAKEN</Text>
              </View>
              <Text style={[styles.orderItemsList, { color: "#94A3B8" }]}>
                {(order.orderItems ?? [])
                  .map((i) => `${i.productName} x${i.quantity}`)
                  .join(", ")}
              </Text>
            </View>
          ))}
        </>
      )}
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
  selectAllBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectAllText: { fontSize: 12, fontWeight: "700", color: "#1C74E9" },
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
  selectedCard: {
    borderColor: "#1C74E9",
    backgroundColor: "#F0F7FF",
  },
  claimedCard: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  takenCard: {
    backgroundColor: "#F8FAFC",
    opacity: 0.7,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIdWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderId: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1C74E9",
    borderColor: "#1C74E9",
  },
  itemCountBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  claimedBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  takenBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    backgroundColor: "#F1F5F9",
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
});
