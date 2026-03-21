import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRiderBatches, RiderBatch } from "@/store/slices/riderSlice";

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

export default function RiderHomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(false);
  const { batches, isFetchingBatches } = useAppSelector((state) => state.rider);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchRiderBatches());
  }, [dispatch]);

  const currentBatch: RiderBatch | null =
    batches.find((b) => b.status === "IN_PROGRESS" || b.status === "CLOSED") ?? null;
  const firstName = user?.fullName?.split(" ")[0] ?? "Rider";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 17 ? "Good afternoon," : "Good evening,";

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#64748b" />
          </View>
          <View>
            <Text style={styles.greetingSub}>{greeting}</Text>
            <Text style={styles.greetingName}>{firstName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Online / Offline toggle */}
      <View style={styles.toggleWrap}>
        <TouchableOpacity
          style={[styles.toggleBtn, !isOnline && styles.toggleBtnActive]}
          onPress={() => setIsOnline(false)}
        >
          <Text style={[styles.toggleText, !isOnline && styles.toggleTextActive]}>
            OFFLINE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, isOnline && styles.toggleBtnActive]}
          onPress={() => setIsOnline(true)}
        >
          <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
            ONLINE
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Current Batch card */}
        {isFetchingBatches ? (
          <View style={[styles.batchCard, { alignItems: "center", paddingVertical: 32 }]}>
            <ActivityIndicator size="large" color="#1C74E9" />
            <Text style={{ color: "#64748b", marginTop: 12 }}>Loading batch...</Text>
          </View>
        ) : currentBatch ? (
          <View style={styles.batchCard}>
            <View style={styles.batchHeader}>
              <Text style={styles.batchTitle}>Current Batch</Text>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>{currentBatch.slotLabel.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.pickupTime}>
              Pickup: {formatTime(currentBatch.scheduledAt)} ({minsUntil(currentBatch.scheduledAt)})
            </Text>
            <Text style={styles.ordersTotal}>{currentBatch.currentOrders} Orders Total</Text>

            {/* Route */}
            <View style={styles.routeWrap}>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: "#1C74E9" }]} />
                <View>
                  <Text style={styles.routeLabel}>DELIVER TO</Text>
                  <Text style={styles.routeLocation}>{currentBatch.deliveryZone.name}</Text>
                </View>
              </View>
            </View>

            {/* Start Pickup button */}
            <TouchableOpacity
              style={styles.startBtn}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: "/(rider)/pickup-batch", params: { batchId: currentBatch.id } })}
            >
              <Ionicons name="navigate-outline" size={18} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.startBtnText}>Start Pickup</Text>
            </TouchableOpacity>

            {/* Order count */}
            <View style={styles.stopsSection}>
              <Text style={styles.stopsTitle}>BATCH SUMMARY</Text>
              <View style={styles.stopRow}>
                <View style={styles.stopDot} />
                <Text style={styles.stopName}>{currentBatch.deliveryZone.name}</Text>
                <Text style={styles.stopOrders}>{currentBatch.currentOrders} / {currentBatch.maxOrders} orders</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.batchCard, { alignItems: "center", paddingVertical: 32 }]}>
            <Ionicons name="bicycle-outline" size={40} color="#cbd5e1" />
            <Text style={{ color: "#64748b", marginTop: 12, fontWeight: "600" }}>No active batch assigned</Text>
            <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Check back when a batch is in progress</Text>
          </View>
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ORDERS IN BATCH</Text>
            <Text style={styles.statValue}>
              {currentBatch?.currentOrders ?? "—"}{" "}
              {currentBatch && <Text style={styles.statGoal}>/ {currentBatch.maxOrders}</Text>}
            </Text>
            {currentBatch && (
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(currentBatch.currentOrders / currentBatch.maxOrders) * 100}%` }]} />
              </View>
            )}
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>BATCH STATUS</Text>
            <Text style={[styles.statValue, { fontSize: 15, marginTop: 4 }]}>
              {currentBatch?.status ?? "—"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f1f5f9" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingSub: { fontSize: 12, color: "#64748b" },
  greetingName: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Toggle
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "white" },
  toggleText: { fontSize: 12, fontWeight: "700", color: "#94a3b8" },
  toggleTextActive: { color: "#0f172a" },

  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  // Batch card
  batchCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  batchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  batchTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  priorityBadge: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityText: { fontSize: 11, fontWeight: "700", color: "#1C74E9" },

  pickupTime: { fontSize: 22, fontWeight: "800", color: "#1C74E9", marginBottom: 4 },
  ordersTotal: { fontSize: 13, color: "#64748b", marginBottom: 16 },

  // Route
  routeWrap: { marginBottom: 20 },
  routeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#e2e8f0",
    marginLeft: 5,
    marginVertical: 4,
  },
  routeLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.5 },
  routeLocation: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  // Start button
  startBtn: {
    backgroundColor: "#1C74E9",
    borderRadius: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: "700", color: "white" },

  // Stops
  stopsSection: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  stopsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1C74E9",
    marginRight: 12,
  },
  stopName: { flex: 1, fontSize: 14, color: "#0f172a", fontWeight: "500" },
  stopOrders: { fontSize: 13, color: "#64748b" },

  // Stats
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  statGoal: { fontSize: 16, fontWeight: "600", color: "#94a3b8" },
  statCurrency: { fontSize: 12, fontWeight: "600", color: "#64748b", marginTop: 2 },
  progressTrack: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 3,
  },
});
