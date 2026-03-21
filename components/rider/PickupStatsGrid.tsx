import { StyleSheet, Text, View } from "react-native";

interface Props {
  totalOrders: number;
  ridersCount: number;
  zoneName: string;
}

export function PickupStatsGrid({ totalOrders, ridersCount, zoneName }: Props) {
  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <Text style={styles.statValueBlue}>{totalOrders}</Text>
        <Text style={styles.statLabel}>TOTAL</Text>
        <Text style={styles.statLabel}>ORDERS</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{ridersCount}</Text>
        <Text style={styles.statLabel}>RIDERS</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue} numberOfLines={1}>{zoneName}</Text>
        <Text style={styles.statLabel}>ZONE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE5F0",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statValueBlue: {
    fontSize: 22,
    color: "#1C74E9",
    fontWeight: "800",
    marginBottom: 3,
  },
  statValue: {
    fontSize: 22,
    color: "#1E293B",
    fontWeight: "800",
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 12,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
