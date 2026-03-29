import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationIconButton from "@/components/common/NotificationIconButton";
import { BatchCard } from "@/components/rider/dashboard/BatchCard";
import { RiderPhaseCard } from "@/components/rider/dashboard/RiderPhaseCard";
import { RiderStatsRow } from "@/components/rider/dashboard/RiderStatsRow";
import { useRiderDashboard } from "@/hooks/useRiderDashboard";

export default function RiderHomeScreen() {
  const router = useRouter();
  const {
    isFetchingBatches,
    activeBatches,
    upcomingBatches,
    activeOrders,
    inDeliveryOrders,
    pickedUpOrders,
    assignedOrders,
    apiLoaded,
    deliveryPhase,
    claimedOrderIds,
    currentBatchId,
    deliveredOrderIds,
    pickedUpOrderIds,
    firstName,
    greeting,
    refreshBatches,
  } = useRiderDashboard();

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
        <NotificationIconButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isFetchingBatches} onRefresh={refreshBatches} />
        }
      >
        <RiderPhaseCard
          apiLoaded={apiLoaded}
          deliveryPhase={deliveryPhase}
          claimedOrderIds={claimedOrderIds}
          currentBatchId={currentBatchId}
          deliveredOrderIds={deliveredOrderIds}
          pickedUpOrderIds={pickedUpOrderIds}
          inDeliveryCount={inDeliveryOrders.length}
          pickedUpCount={pickedUpOrders.length}
          assignedCount={assignedOrders.length}
        />

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
                router.push({ pathname: "/(rider)/batch-detail", params: { batchId: batch.id } })
              }
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="bicycle-outline" size={36} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No active batches</Text>
            <Text style={styles.emptySubtitle}>Pull down to refresh or check back later</Text>
          </View>
        )}

        {/* Upcoming Batches */}
        {upcomingBatches.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Ionicons name="time-outline" size={16} color="#94A3B8" />
              <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>UPCOMING</Text>
            </View>
            {upcomingBatches.map((batch) => (
              <BatchCard
                key={batch.id}
                batch={batch}
                disabled
                onPress={() =>
                  router.push({ pathname: "/(rider)/batch-detail", params: { batchId: batch.id } })
                }
              />
            ))}
          </>
        )}

        {/* Session Stats */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Ionicons name="stats-chart-outline" size={16} color="#94A3B8" />
          <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>SESSION STATS</Text>
        </View>
        <RiderStatsRow
          activeOrdersCount={activeOrders.length}
          deliveredCount={deliveredOrderIds.length}
          inDeliveryCount={inDeliveryOrders.length}
          pickedUpCount={pickedUpOrders.length}
          assignedCount={assignedOrders.length}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 11, fontWeight: "700", color: "#1C74E9", letterSpacing: 0.8 },
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
});
