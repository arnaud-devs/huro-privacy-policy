import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RiderBatch } from "@/store/slices/riderSlice";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function minsUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const ACTIVE_STATUSES = ["OPEN", "IN_PROGRESS", "DISPATCHED"];

interface Props {
  batch: RiderBatch;
  disabled?: boolean;
  onPress: () => void;
}

export function BatchCard({ batch, disabled, onPress }: Props) {
  const isActive = ACTIVE_STATUSES.includes(batch.status);

  return (
    <TouchableOpacity
      style={[styles.batchCard, disabled && styles.batchCardDisabled]}
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.batchHeader}>
        <View>
          <Text style={styles.batchSlot}>{batch.slotLabel}</Text>
          <Text style={styles.batchZone}>{batch.deliveryZone.name}</Text>
        </View>
        <View style={[styles.statusBadge, isActive ? { backgroundColor: "#DCFCE7" } : { backgroundColor: "#F1F5F9" }]}>
          <Text style={[styles.statusText, isActive ? { color: "#10B981" } : { color: "#94A3B8" }]}>
            {isActive ? "ACTIVE" : "UPCOMING"}
          </Text>
        </View>
      </View>

      <View style={styles.batchMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#64748B" />
          <Text style={styles.metaText}>
            {formatTime(batch.scheduledAt)} ({minsUntil(batch.scheduledAt)})
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="bag-outline" size={14} color="#64748B" />
          <Text style={styles.metaText}>
            {batch.currentOrders}/{batch.maxOrders} orders
          </Text>
        </View>
      </View>

      {!disabled && (
        <View style={styles.batchAction}>
          <Text style={styles.batchActionText}>View & Claim Orders</Text>
          <Ionicons name="arrow-forward" size={16} color="#1C74E9" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  batchCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  batchCardDisabled: { opacity: 0.6 },
  batchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  batchSlot: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  batchZone: { fontSize: 13, color: "#64748B", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700" },
  batchMeta: { flexDirection: "row", gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  batchAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
  },
  batchActionText: { fontSize: 14, fontWeight: "700", color: "#1C74E9" },
});
