import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { type BatchDetail } from "@/store/slices/riderSlice";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function minsUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

interface BatchInfoCardProps {
  batchDetail: BatchDetail | null;
}

export default function BatchInfoCard({ batchDetail }: BatchInfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={18} color="#1C74E9" />
          <View>
            <Text style={styles.infoLabel}>Pickup Time</Text>
            <Text style={styles.infoValue}>
              {batchDetail ? formatTime(batchDetail.scheduledAt) : "—"}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="timer-outline" size={18} color="#F59E0B" />
          <View>
            <Text style={styles.infoLabel}>Starts In</Text>
            <Text style={styles.infoValue}>
              {batchDetail ? minsUntil(batchDetail.scheduledAt) : "—"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={18} color="#10B981" />
          <View>
            <Text style={styles.infoLabel}>Zone</Text>
            <Text style={styles.infoValue}>
              {batchDetail?.deliveryZone.name ?? "—"}
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="people-outline" size={18} color="#8B5CF6" />
          <View>
            <Text style={styles.infoLabel}>Riders</Text>
            <Text style={styles.infoValue}>
              {batchDetail?.riders?.length ?? 0}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.orderSummaryRow}>
        <Text style={styles.orderSummaryText}>
          {batchDetail?.currentOrders ?? 0} / {batchDetail?.maxOrders ?? 0} orders
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  batchDetail
                    ? (batchDetail.currentOrders / batchDetail.maxOrders) * 100
                    : 0
                }%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  infoLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  infoValue: { fontSize: 15, color: "#0F172A", fontWeight: "700" },
  orderSummaryRow: { marginTop: 4 },
  orderSummaryText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 3,
  },
});
