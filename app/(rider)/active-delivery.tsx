import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeliveredOrdersList } from "@/components/rider/active-delivery/DeliveredOrdersList";
import { DeliveryOrderCard } from "@/components/rider/active-delivery/DeliveryOrderCard";
import { LeaveDeliveryModal } from "@/components/rider/active-delivery/LeaveDeliveryModal";
import { ZoneArrivalCard } from "@/components/rider/active-delivery/ZoneArrivalCard";
import { useActiveDelivery } from "@/hooks/useActiveDelivery";

export default function ActiveDeliveryScreen() {
  const {
    currentBatchId,
    pendingOrders,
    deliveredOrders,
    deliveredCount,
    totalOrders,
    progress,
    zoneName,
    hasArrived,
    showLeaveConfirm,
    setShowLeaveConfirm,
    handleArrivedAtZone,
    handleVerifyOrder,
    handleCallCustomer,
    handleLeaveDelivery,
    finishSession,
  } = useActiveDelivery();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLeaveDelivery}>
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Active Delivery</Text>
          <Text style={styles.headerSubtitle}>
            {currentBatchId
              ? `Batch #${currentBatchId.slice(0, 8).toUpperCase()}`
              : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#1C74E9" />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Delivery Progress</Text>
          <Text style={styles.progressCount}>
            {deliveredCount}/{totalOrders} delivered
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ZoneArrivalCard
          zoneName={zoneName}
          hasArrived={hasArrived}
          onArrived={handleArrivedAtZone}
        />

        {pendingOrders.length === 0 && deliveredCount > 0 ? (
          <View style={styles.allDoneCard}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text style={styles.allDoneTitle}>All Deliveries Complete!</Text>
            <Text style={styles.allDoneSubtitle}>
              You delivered {deliveredCount} order(s) in this batch.
            </Text>
            <TouchableOpacity
              style={styles.finishBtn}
              activeOpacity={0.85}
              onPress={finishSession}
            >
              <Text style={styles.finishBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="bag-outline" size={16} color="#1C74E9" />
              <Text style={styles.sectionTitle}>
                ORDERS TO DELIVER ({pendingOrders.length})
              </Text>
            </View>
            {pendingOrders.map((order, index) => (
              <DeliveryOrderCard
                key={order.id}
                order={order}
                index={index}
                hasArrived={hasArrived}
                onCall={handleCallCustomer}
                onVerify={handleVerifyOrder}
              />
            ))}
          </>
        )}

        {deliveredOrders.length > 0 && (
          <DeliveredOrdersList deliveredOrders={deliveredOrders} />
        )}

        <Text style={styles.footerText}>ACTIVE DELIVERY SESSION</Text>
      </ScrollView>

      <LeaveDeliveryModal
        visible={showLeaveConfirm}
        pendingCount={pendingOrders.length}
        onStay={() => setShowLeaveConfirm(false)}
        onLeave={finishSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  headerSubtitle: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Progress
  progressSection: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  progressCount: { fontSize: 13, color: "#1C74E9", fontWeight: "700" },
  progressTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },

  scrollContent: { padding: 16, paddingBottom: 40 },

  // Section headers
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 0.8,
  },

  // All done
  allDoneCard: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  allDoneTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  allDoneSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },
  finishBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  finishBtnText: { fontSize: 15, fontWeight: "700", color: "white" },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
    color: "#CBD5E1",
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 10,
  },
});
