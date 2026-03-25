import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRiderBatches,
  fetchRiderOrders,
  type RiderBatch,
} from "@/store/slices/riderSlice";

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
  const {
    batches, isFetchingBatches,
    orders,
    deliveryPhase, claimedOrderIds, currentBatchId, deliveredOrderIds, pickedUpOrderIds,
  } = useAppSelector((state) => state.rider);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.role?.toUpperCase() !== "RIDER") return;
    dispatch(fetchRiderBatches());
    // fetchRiderOrders.fulfilled syncs deliveryPhase/claimedOrderIds/pickedUpOrderIds
    // from real API statuses — keeps Redux honest after every open
    dispatch(fetchRiderOrders());
  }, [dispatch, user?.role]);

  const refreshBatches = () => {
    dispatch(fetchRiderBatches());
    dispatch(fetchRiderOrders());
  };

  // Derive for the stats row from API orders (ground truth when loaded)
  const activeOrders = orders.filter((o) =>
    ["RIDER_ASSIGNED", "PICKED_UP", "IN_DELIVERY"].includes(o.status)
  );
  // For the phase card use API orders when available, fall back to persisted Redux state
  const apiLoaded = orders.length > 0;
  const inDeliveryOrders = orders.filter((o) => o.status === "IN_DELIVERY");
  const pickedUpOrders   = orders.filter((o) => o.status === "PICKED_UP");
  const assignedOrders   = orders.filter((o) => o.status === "RIDER_ASSIGNED");

  const activeBatches = batches.filter((b) => ["OPEN", "IN_PROGRESS", "DISPATCHED"].includes(b.status));
  const upcomingBatches = batches.filter((b) => b.status === "CLOSED");
  const firstName = user?.fullName?.split(" ")[0] ?? "Rider";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning," : hour < 17 ? "Good afternoon," : "Good evening,";

  // Phase card: uses API order statuses (ground truth) when loaded,
  // falls back to persisted Redux state instantly on open so the rider
  // always sees their active session — even before the API responds.
  const renderPhaseCard = () => {
    // ── Fallback: API not yet loaded, use persisted Redux state ──
    if (!apiLoaded) {
      if (deliveryPhase === "delivering" || deliveryPhase === "arrived") {
        return (
          <View style={[styles.phaseCard, { borderColor: "#1C74E9" }]}>
            <View style={styles.phaseIconWrap}>
              <Ionicons name="bicycle" size={28} color="#1C74E9" />
            </View>
            <Text style={styles.phaseTitle}>Delivering Orders</Text>
            <Text style={styles.phaseSubtitle}>
              {claimedOrderIds.length} pending · {deliveredOrderIds.length} delivered
            </Text>
            <TouchableOpacity
              style={[styles.phaseCta, { backgroundColor: "#1C74E9" }]}
              activeOpacity={0.85}
              onPress={() => router.push("/(rider)/active-delivery")}
            >
              <Ionicons name="navigate" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.phaseCtaText}>Continue Delivery</Text>
            </TouchableOpacity>
          </View>
        );
      }
      if (deliveryPhase === "picking_up" && currentBatchId) {
        const allPickedUp = claimedOrderIds.every((id) => pickedUpOrderIds.includes(id));
        return (
          <View style={[styles.phaseCard, { borderColor: "#F59E0B" }]}>
            <View style={styles.phaseIconWrap}>
              <Ionicons name="bag-handle" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.phaseTitle}>
              {allPickedUp ? "Ready to Deliver" : "Picking Up Orders"}
            </Text>
            <Text style={styles.phaseSubtitle}>
              {claimedOrderIds.length} order(s) assigned
            </Text>
            <TouchableOpacity
              style={[styles.phaseCta, { backgroundColor: "#F59E0B" }]}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/(rider)/pickup-batch",
                  params: { batchId: currentBatchId },
                })
              }
            >
              <Ionicons name="arrow-forward" size={18} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.phaseCtaText}>
                {allPickedUp ? "Continue to Dispatch" : "Continue Pickup"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
      return null;
    }

    // ── API loaded: drive from real order statuses ──
    // Orders are out for delivery (dispatched)
    if (inDeliveryOrders.length > 0) {
      const pending = inDeliveryOrders.length - deliveredOrderIds.length;
      return (
        <View style={[styles.phaseCard, { borderColor: "#1C74E9" }]}>
          <View style={styles.phaseIconWrap}>
            <Ionicons name="bicycle" size={28} color="#1C74E9" />
          </View>
          <Text style={styles.phaseTitle}>Delivering Orders</Text>
          <Text style={styles.phaseSubtitle}>
            {pending} pending · {deliveredOrderIds.length} delivered
          </Text>
          <TouchableOpacity
            style={[styles.phaseCta, { backgroundColor: "#1C74E9" }]}
            activeOpacity={0.85}
            onPress={() => router.push("/(rider)/active-delivery")}
          >
            <Ionicons name="navigate" size={18} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.phaseCtaText}>Continue Delivery</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Orders physically picked up but batch not dispatched yet
    if (pickedUpOrders.length > 0) {
      return (
        <View style={[styles.phaseCard, { borderColor: "#1C74E9" }]}>
          <View style={styles.phaseIconWrap}>
            <Ionicons name="bag-check" size={28} color="#1C74E9" />
          </View>
          <Text style={styles.phaseTitle}>Ready to Deliver</Text>
          <Text style={styles.phaseSubtitle}>
            {pickedUpOrders.length} order(s) picked up
          </Text>
          <TouchableOpacity
            style={[styles.phaseCta, { backgroundColor: "#1C74E9" }]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(rider)/pickup-batch",
                params: { batchId: currentBatchId ?? "" },
              })
            }
          >
            <Ionicons name="arrow-forward" size={18} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.phaseCtaText}>Continue to Dispatch</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Orders assigned to rider but not yet picked up
    if (assignedOrders.length > 0) {
      return (
        <View style={[styles.phaseCard, { borderColor: "#F59E0B" }]}>
          <View style={styles.phaseIconWrap}>
            <Ionicons name="bag-handle" size={28} color="#F59E0B" />
          </View>
          <Text style={styles.phaseTitle}>Picking Up Orders</Text>
          <Text style={styles.phaseSubtitle}>
            {assignedOrders.length} order(s) assigned to you
          </Text>
          <TouchableOpacity
            style={[styles.phaseCta, { backgroundColor: "#F59E0B" }]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(rider)/pickup-batch",
                params: { batchId: currentBatchId ?? "" },
              })
            }
          >
            <Ionicons name="arrow-forward" size={18} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.phaseCtaText}>Continue Pickup</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isFetchingBatches} onRefresh={refreshBatches} />
        }
      >
        {/* Phase-aware CTA */}
        {renderPhaseCard()}

        {/* Active Batches */}
        <View style={styles.sectionHeader}>
          <Ionicons name="flash" size={16} color="#1C74E9" />
          <Text style={styles.sectionTitle}>ACTIVE BATCHES</Text>
        </View>

        {isFetchingBatches ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1C74E9" />
            <Text style={styles.loadingText}>Loading batches...</Text>
          </View>
        ) : activeBatches.length > 0 ? (
          activeBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onPress={() =>
                router.push({
                  pathname: "/(rider)/batch-detail",
                  params: { batchId: batch.id },
                })
              }
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="bicycle-outline" size={36} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No active batches</Text>
            <Text style={styles.emptySubtitle}>
              Pull down to refresh or check back later
            </Text>
          </View>
        )}

        {/* Upcoming Batches */}
        {upcomingBatches.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Ionicons name="time-outline" size={16} color="#94A3B8" />
              <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>
                UPCOMING
              </Text>
            </View>
            {upcomingBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                disabled
                onPress={() =>
                  router.push({
                    pathname: "/(rider)/batch-detail",
                    params: { batchId: batch.id },
                  })
                }
              />
            ))}
          </>
        )}

        {/* Quick Stats */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Ionicons name="stats-chart-outline" size={16} color="#94A3B8" />
          <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>
            SESSION STATS
          </Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>CLAIMED</Text>
            <Text style={styles.statValue}>{activeOrders.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DELIVERED</Text>
            <Text style={styles.statValue}>{deliveredOrderIds.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PHASE</Text>
            <Text style={[styles.statValue, { fontSize: 13 }]}>
              {inDeliveryOrders.length > 0
                ? "Delivery"
                : pickedUpOrders.length > 0
                ? "Picked Up"
                : assignedOrders.length > 0
                ? "Pickup"
                : "Idle"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BatchCard({
  batch,
  disabled,
  onPress,
}: {
  batch: RiderBatch;
  disabled?: boolean;
  onPress: () => void;
}) {
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
        <View
          style={[
            styles.statusBadge,
            ["OPEN", "IN_PROGRESS", "DISPATCHED"].includes(batch.status)
              ? { backgroundColor: "#DCFCE7" }
              : { backgroundColor: "#F1F5F9" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              ["OPEN", "IN_PROGRESS", "DISPATCHED"].includes(batch.status)
                ? { color: "#10B981" }
                : { color: "#94A3B8" },
            ]}
          >
            {["OPEN", "IN_PROGRESS", "DISPATCHED"].includes(batch.status) ? "ACTIVE" : "UPCOMING"}
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
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
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

  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 0.8,
  },

  // Phase card
  phaseCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  phaseIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  phaseTitle: { fontSize: 17, fontWeight: "800", color: "#0F172A" },
  phaseSubtitle: { fontSize: 13, color: "#64748B", marginTop: 4 },
  phaseCta: {
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 14,
    minWidth: 200,
  },
  phaseCtaText: { fontSize: 14, fontWeight: "700", color: "white" },

  // Batch cards
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
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

  // Empty & loading
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 10,
  },
  loadingText: { color: "#64748B", marginTop: 12, fontSize: 14 },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 10,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#64748B", marginTop: 10 },
  emptySubtitle: { fontSize: 13, color: "#94A3B8", marginTop: 4 },

  // Stats
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
