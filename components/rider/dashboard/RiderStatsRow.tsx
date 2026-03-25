import { StyleSheet, Text, View } from "react-native";

interface Props {
  activeOrdersCount: number;
  deliveredCount: number;
  inDeliveryCount: number;
  pickedUpCount: number;
  assignedCount: number;
}

export function RiderStatsRow({
  activeOrdersCount,
  deliveredCount,
  inDeliveryCount,
  pickedUpCount,
  assignedCount,
}: Props) {
  const phase =
    inDeliveryCount > 0
      ? "Delivery"
      : pickedUpCount > 0
      ? "Picked Up"
      : assignedCount > 0
      ? "Pickup"
      : "Idle";

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>CLAIMED</Text>
        <Text style={styles.statValue}>{activeOrdersCount}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>DELIVERED</Text>
        <Text style={styles.statValue}>{deliveredCount}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>PHASE</Text>
        <Text style={[styles.statValue, { fontSize: 13 }]}>{phase}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
});
