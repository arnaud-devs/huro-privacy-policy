import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function PickupProgressCard({ pickedUp, totalOrders }: { pickedUp: number; totalOrders: number }) {
  const percentage = totalOrders > 0 ? (pickedUp / totalOrders) * 100 : 0;
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressTopRow}>
        <View style={styles.progressTitleWrap}>
          <Ionicons name="flag-outline" size={16} color="#64748B" />
          <Text style={styles.progressTitle}>PROGRESS</Text>
        </View>
        <Text style={styles.progressSummary}>
          {pickedUp} / {totalOrders} <Text style={styles.progressPercent}>({Math.round(percentage)}%)</Text>
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: "#EEF2F7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  progressSummary: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "800",
  },
  progressPercent: {
    color: "#94A3B8",
    fontWeight: "700",
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#D8E1ED",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
  },
});
