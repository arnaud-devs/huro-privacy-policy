import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BatchInfoCard from "@/components/rider/batch-detail/BatchInfoCard";
import MultiRiderSection from "@/components/rider/batch-detail/MultiRiderSection";
import SoloOrdersSection from "@/components/rider/batch-detail/SoloOrdersSection";
import { useBatchDetail } from "@/hooks/useBatchDetail";

export default function BatchDetailScreen() {
  const router = useRouter();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();

  const {
    batchDetail,
    isLoadingBatchDetail,
    isSoloRider,
    claimedOrderIds,
    availableOrders,
    takenOrders,
    myClaimedOrders,
    selectedIds,
    toggleSelect,
    selectAll,
    isClaiming,
    handleClaimSelected,
    handleStartPickup,
    totalItems,
  } = useBatchDetail(batchId ?? "");

  const handleOrderPress = (orderId: string) =>
    router.push({ pathname: "/(rider)/order-detail", params: { orderId } });

  if (isLoadingBatchDetail) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1C74E9" />
          <Text style={styles.loadingText}>Loading batch...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Batch Details</Text>
          <Text style={styles.headerSubtitle}>
            {batchDetail?.id
              ? `#${batchDetail.id.slice(0, 8).toUpperCase()}`
              : ""}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BatchInfoCard batchDetail={batchDetail} />

        {isSoloRider ? (
          <SoloOrdersSection
            myClaimedOrders={myClaimedOrders}
            totalItems={totalItems}
            onOrderPress={handleOrderPress}
          />
        ) : (
          <MultiRiderSection
            myClaimedOrders={myClaimedOrders}
            availableOrders={availableOrders}
            takenOrders={takenOrders}
            selectedIds={selectedIds}
            totalItems={totalItems}
            onToggle={toggleSelect}
            onSelectAll={selectAll}
            onOrderPress={handleOrderPress}
          />
        )}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        {/* Claim button — only in multi-rider mode */}
        {!isSoloRider && selectedIds.length > 0 && (
          <TouchableOpacity
            style={[styles.claimBtn, isClaiming && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleClaimSelected}
            disabled={isClaiming}
          >
            {isClaiming ? (
              <ActivityIndicator color="white" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={styles.claimBtnText}>
              {isClaiming ? "Claiming..." : `Claim ${selectedIds.length} Order(s)`}
            </Text>
          </TouchableOpacity>
        )}
        {claimedOrderIds.length > 0 && (
          <TouchableOpacity
            style={styles.pickupBtn}
            activeOpacity={0.85}
            onPress={handleStartPickup}
          >
            <Ionicons
              name="navigate-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.pickupBtnText}>
              Start Pickup ({claimedOrderIds.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#64748B", marginTop: 12, fontSize: 14 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "white",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  headerSubtitle: { fontSize: 12, color: "#64748B", fontWeight: "500" },

  scrollContent: { padding: 16, paddingBottom: 120 },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  claimBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  claimBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
  pickupBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pickupBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
});
