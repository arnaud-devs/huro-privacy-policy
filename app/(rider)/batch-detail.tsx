import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  claimOrders,
  fetchBatchDetail,
  loadSampleBatchDetail,
  setCurrentBatch,
  setDeliveryPhase,
  SAMPLE_BATCH_DETAIL,
  type BatchOrder,
} from "@/store/slices/riderSlice";

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

export default function BatchDetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const { batchDetail, isLoadingBatchDetail, claimedOrderIds } = useAppSelector(
    (state) => state.rider
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (batchId) {
      // Try API first, fall back to sample data
      dispatch(fetchBatchDetail(batchId)).then((result) => {
        if (fetchBatchDetail.rejected.match(result)) {
          dispatch(loadSampleBatchDetail(batchId));
        }
      });
    }
  }, [batchId]);

  // Categorize orders
  const { availableOrders, takenOrders, myClaimedOrders } = useMemo(() => {
    const orders = batchDetail?.orders ?? [];
    const available: BatchOrder[] = [];
    const taken: BatchOrder[] = [];
    const myClaimed: BatchOrder[] = [];

    orders.forEach((order) => {
      if (claimedOrderIds.includes(order.id)) {
        myClaimed.push(order);
      } else if (order.pickupSignature && order.pickupSignature !== "rider-1") {
        taken.push(order);
      } else {
        available.push(order);
      }
    });

    return { availableOrders: available, takenOrders: taken, myClaimedOrders: myClaimed };
  }, [batchDetail, claimedOrderIds]);

  const toggleSelect = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAll = () => {
    const allAvailableIds = availableOrders.map((o) => o.id);
    setSelectedIds(allAvailableIds);
  };

  const handleClaimSelected = () => {
    if (selectedIds.length === 0) {
      Alert.alert("No Orders Selected", "Please select at least one order to claim.");
      return;
    }
    dispatch(claimOrders(selectedIds));
    dispatch(setCurrentBatch(batchId!));
    setSelectedIds([]);
    Alert.alert(
      "Orders Claimed",
      `You claimed ${selectedIds.length} order(s). Head to pickup!`,
      [{ text: "OK" }]
    );
  };

  const handleStartPickup = () => {
    if (claimedOrderIds.length === 0) {
      Alert.alert("No Claims", "Claim some orders first before starting pickup.");
      return;
    }
    dispatch(setDeliveryPhase("picking_up"));
    router.push({
      pathname: "/(rider)/pickup-batch",
      params: { batchId: batchId! },
    });
  };

  const totalItems = (order: BatchOrder) =>
    (order.orderItems ?? []).reduce((sum, item) => sum + item.quantity, 0);

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
        {/* Batch Info Card */}
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
                        ? (batchDetail.currentOrders / batchDetail.maxOrders) *
                          100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* My Claimed Orders */}
        {myClaimedOrders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={[styles.sectionTitle, { color: "#10B981" }]}>
                MY CLAIMED ORDERS ({myClaimedOrders.length})
              </Text>
            </View>
            {myClaimedOrders.map((order) => (
              <View key={order.id} style={[styles.orderCard, styles.claimedCard]}>
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderIdWrap}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.orderId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.claimedBadge}>CLAIMED</Text>
                </View>
                <Text style={styles.orderItemsList}>
                  {(order.orderItems ?? [])
                    .map((i) => `${i.productName} x${i.quantity}`)
                    .join(", ")}
                </Text>
                <Text style={styles.orderItemCount}>
                  {totalItems(order)} item(s)
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Available Orders */}
        <View style={styles.sectionHeader}>
          <Ionicons name="bag-outline" size={16} color="#1C74E9" />
          <Text style={styles.sectionTitle}>
            AVAILABLE ORDERS ({availableOrders.length})
          </Text>
          {availableOrders.length > 0 && (
            <TouchableOpacity onPress={selectAll} style={styles.selectAllBtn}>
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
          )}
        </View>

        {availableOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="bag-check-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>All orders have been claimed</Text>
          </View>
        ) : (
          availableOrders.map((order) => {
            const isSelected = selectedIds.includes(order.id);
            return (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, isSelected && styles.selectedCard]}
                activeOpacity={0.7}
                onPress={() => toggleSelect(order.id)}
              >
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderIdWrap}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxChecked,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text style={styles.orderId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.itemCountBadge}>
                    {totalItems(order)} items
                  </Text>
                </View>
                <Text style={styles.orderItemsList}>
                  {(order.orderItems ?? [])
                    .map((i) => `${i.productName} x${i.quantity}`)
                    .join(", ")}
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        {/* Taken Orders */}
        {takenOrders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={16} color="#94A3B8" />
              <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>
                TAKEN BY OTHERS ({takenOrders.length})
              </Text>
            </View>
            {takenOrders.map((order) => (
              <View key={order.id} style={[styles.orderCard, styles.takenCard]}>
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderIdWrap}>
                    <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                    <Text style={[styles.orderId, { color: "#94A3B8" }]}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.takenBadge}>TAKEN</Text>
                </View>
                <Text style={[styles.orderItemsList, { color: "#94A3B8" }]}>
                  {(order.orderItems ?? [])
                    .map((i) => `${i.productName} x${i.quantity}`)
                    .join(", ")}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        {selectedIds.length > 0 && (
          <TouchableOpacity
            style={styles.claimBtn}
            activeOpacity={0.85}
            onPress={handleClaimSelected}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.claimBtnText}>
              Claim {selectedIds.length} Order(s)
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

  // Info Card
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

  // Sections
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
    flex: 1,
  },
  selectAllBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectAllText: { fontSize: 12, fontWeight: "700", color: "#1C74E9" },

  // Order Cards
  orderCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#1C74E9",
    backgroundColor: "#F0F7FF",
  },
  claimedCard: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  takenCard: {
    backgroundColor: "#F8FAFC",
    opacity: 0.7,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIdWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderId: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1C74E9",
    borderColor: "#1C74E9",
  },
  itemCountBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  claimedBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  takenBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderItemsList: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  orderItemCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 10,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },

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
