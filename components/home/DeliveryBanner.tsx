import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeliveryBanner() {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerHeader}>
        <View style={styles.activeBatchBadge}>
          <Text style={styles.activeBatchText}>ACTIVE BATCH #125</Text>
        </View>
        <View style={styles.arrivesBadge}>
          <Text style={styles.arrivesLabel}>Arrives</Text>
          <Text style={styles.arrivesTime}>1h 20m</Text>
        </View>
      </View>

      <Text style={styles.bannerTitle}>Next Campus Delivery</Text>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Order window closing soon</Text>
        <Text style={styles.progressPercent}>75% Full</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: "75%" }]} />
      </View>

      <TouchableOpacity style={styles.bannerButton}>
        <Ionicons name="cart-outline" size={20} color="#1C74E9" />
        <Text style={styles.bannerButtonText}>Join Batch Delivery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#1C74E9",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    position: "relative",
  },
  bannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  activeBatchBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBatchText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  arrivesBadge: {
    backgroundColor: "#4AA0F9", // slightly lighter blue
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
  },
  arrivesLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    opacity: 0.9,
  },
  arrivesTime: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  progressPercent: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  bannerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerButtonText: {
    color: "#1C74E9",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
});