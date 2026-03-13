import { StyleSheet, Text, View } from "react-native";

export function DeliveryProgressCard() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Daily Progress</Text>
        <View style={styles.rightStats}>
          <Text style={styles.earnings}>EST. EARNINGS: 12,400 RWF</Text>
          <Text style={styles.progressText}>
            <Text style={styles.progressHighlight}>12 / 26</Text> Delivered
          </Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(12 / 26) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
  },
  rightStats: {
    alignItems: "flex-end",
  },
  earnings: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "600",
  },
  progressHighlight: {
    color: "#1C74E9",
    fontWeight: "800",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 4,
  },
});
