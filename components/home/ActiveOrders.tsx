import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ActiveOrders() {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Active Orders</Text>
      </View>

      <TouchableOpacity style={styles.orderCard}>
        <View style={styles.orderIconWrapper}>
          <Ionicons name="cube-outline" size={24} color="#16A34A" />
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderHeaderRow}>
            <Text style={styles.orderNumber}>Batch #124</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>On the way</Text>
            </View>
          </View>

          <View style={styles.orderDetailRow}>
            <Ionicons name="location-outline" size={14} color="#1C74E9" />
            <Text style={styles.orderDetailTextBold}>Pickup: Main Gate</Text>
          </View>

          <View style={styles.orderDetailRow}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.orderDetailText}>Arrives: 12:00 PM</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#A0A5B1" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  orderIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "#16A34A",
    fontSize: 10,
    fontWeight: "bold",
  },
  orderDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  orderDetailTextBold: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 6,
  },
  orderDetailText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 6,
  },
});