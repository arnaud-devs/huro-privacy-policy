import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function NextPriorityCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEXT PRIORITY</Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={14} color="#FFFFFF" />
          <Text style={styles.timeText}>5 mins left</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.leftContent}>
          <Text style={styles.orderId}>Order #1045</Text>
          <Text style={styles.customerName}>Alex Rivers</Text>
          <View style={styles.locationWrap}>
            <Ionicons name="location-outline" size={14} color="#D0E3FF" />
            <Text style={styles.locationText}>Engineering Dorm A</Text>
          </View>
        </View>
        <View style={styles.codeCircle}>
          <Text style={styles.codeLabel}>CODE</Text>
          <Text style={styles.codeValue}>1943</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.mainBtn} activeOpacity={0.85}>
          <Text style={styles.mainBtnText}>Mark Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
          <Ionicons
            name="arrow-undo"
            size={20}
            color="#FFFFFF"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
          <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C74E9",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  leftContent: {
    flex: 1,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#D0E3FF",
    fontWeight: "500",
  },
  codeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  mainBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C74E9",
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
