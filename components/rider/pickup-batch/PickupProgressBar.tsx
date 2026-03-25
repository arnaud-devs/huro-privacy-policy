import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  collectedItems: number;
  totalItems: number;
  allAlreadyPickedUp: boolean;
  hasOrders: boolean;
  onMarkAll: () => void;
}

export function PickupProgressBar({
  collectedItems,
  totalItems,
  allAlreadyPickedUp,
  hasOrders,
  onMarkAll,
}: Props) {
  const percent = totalItems > 0 ? Math.round((collectedItems / totalItems) * 100) : 0;

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressLabel}>
          {collectedItems} / {totalItems} items collected
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {!allAlreadyPickedUp && hasOrders && (
            <TouchableOpacity style={styles.markAllBtn} onPress={onMarkAll}>
              <Ionicons name="checkmark-done" size={14} color="#1C74E9" />
              <Text style={styles.markAllText}>Mark All</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.progressPercent}>{percent}%</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  progressPercent: { fontSize: 13, color: "#1C74E9", fontWeight: "700" },
  progressTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 4,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  markAllText: { fontSize: 12, fontWeight: "700", color: "#1C74E9" },
});
