import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRiderOrderDetail,
  markOrderDeliveredLocal,
  resetDeliverySession,
  setDeliveryPhase,
  SAMPLE_ORDER_DETAILS,
} from "@/store/slices/riderSlice";

export default function ActiveDeliveryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { claimedOrderIds, deliveredOrderIds, currentBatchId, deliveryPhase, orderDetailsMap } =
    useAppSelector((state) => state.rider);

  // Fetch details for any claimed order not yet cached
  useEffect(() => {
    for (const id of claimedOrderIds) {
      if (!orderDetailsMap[id] && !SAMPLE_ORDER_DETAILS[id]) {
        dispatch(fetchRiderOrderDetail(id));
      }
    }
  }, [claimedOrderIds]);

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [hasArrived, setHasArrived] = useState(deliveryPhase === "arrived");

  // Build delivery queue from claimed orders
  const pendingOrders = useMemo(() => {
    return claimedOrderIds
      .filter((id) => !deliveredOrderIds.includes(id))
      .map((id) => {
        const detail = orderDetailsMap[id] ?? SAMPLE_ORDER_DETAILS[id];
        return {
          id,
          customerName: detail?.snapshotName ?? "Customer",
          address: detail?.customAddress ?? detail?.snapshotZoneName ?? "Unknown",
          zone: detail?.snapshotZoneName ?? "—",
          phone: detail?.snapshotPhone ?? "—",
          amount: detail?.payableAmount ?? 0,
          items: detail?.orderItems ?? [],
          pickupSignature: detail?.pickupSignature ?? null,
        };
      });
  }, [claimedOrderIds, deliveredOrderIds, orderDetailsMap]);

  const deliveredOrders = useMemo(() => {
    return deliveredOrderIds.map((id) => {
      const detail = orderDetailsMap[id] ?? SAMPLE_ORDER_DETAILS[id];
      return {
        id,
        customerName: detail?.snapshotName ?? "Customer",
        address: detail?.customAddress ?? detail?.snapshotZoneName ?? "Unknown",
      };
    });
  }, [deliveredOrderIds, orderDetailsMap]);

  const totalOrders = claimedOrderIds.length;
  const deliveredCount = deliveredOrderIds.length;
  const progress = totalOrders > 0 ? deliveredCount / totalOrders : 0;
  const zoneName = pendingOrders[0]?.zone ?? "Delivery Zone";

  const handleArrivedAtZone = () => {
    setHasArrived(true);
    dispatch(setDeliveryPhase("arrived"));
    Alert.alert(
      "Arrived!",
      `You've arrived at ${zoneName}. Now verify each order with the customer.`
    );
  };

  const handleVerifyOrder = (orderId: string) => {
    router.push({
      pathname: "/(rider)/scan-qr",
      params: { orderId },
    });
  };

  const handleCallCustomer = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };

  const handleLeaveDelivery = () => {
    if (pendingOrders.length > 0) {
      setShowLeaveConfirm(true);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    dispatch(resetDeliverySession());
    router.replace("/(rider)/(rider-tabs)" as any);
  };

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
        {/* Zone Arrival Banner — shown once, before verifying orders */}
        {!hasArrived ? (
          <View style={styles.arrivalCard}>
            <View style={styles.arrivalIcon}>
              <Ionicons name="navigate" size={28} color="#1C74E9" />
            </View>
            <Text style={styles.arrivalTitle}>Heading to {zoneName}</Text>
            <Text style={styles.arrivalSubtitle}>
              Tap the button below when you arrive at the delivery zone
            </Text>
            <TouchableOpacity
              style={styles.arrivedZoneBtn}
              activeOpacity={0.85}
              onPress={handleArrivedAtZone}
            >
              <Ionicons
                name="flag"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.arrivedZoneBtnText}>I've Arrived at {zoneName}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.arrivedBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.arrivedBannerText}>
              Arrived at {zoneName} — verify each order below
            </Text>
          </View>
        )}

        {/* All done state */}
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
            {/* Order Cards — each with Verify & Deliver */}
            <View style={styles.sectionHeaderWrap}>
              <Ionicons name="bag-outline" size={16} color="#1C74E9" />
              <Text style={styles.sectionTitle}>
                ORDERS TO DELIVER ({pendingOrders.length})
              </Text>
            </View>
            {pendingOrders.map((order, index) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderNumberWrap}>
                    <Text style={styles.orderNumber}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderCustomer}>
                      {order.customerName}
                    </Text>
                    <Text style={styles.orderId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.itemBadge}>{order.items.length} items</Text>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={15} color="#64748B" />
                    <Text style={styles.detailText}>{order.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={15} color="#64748B" />
                    <Text style={styles.detailText}>{order.phone}</Text>
                  </View>

                  {/* Items list */}
                  {order.items.length > 0 && (
                    <View style={styles.itemsList}>
                      {order.items.map((item, i) => (
                        <View key={i} style={styles.itemLine}>
                          <View style={styles.itemDot} />
                          <Text style={styles.itemLineName} numberOfLines={1}>
                            {item.productName}
                          </Text>
                          <Text style={styles.itemLineQty}>×{item.quantity}</Text>
                          <Text style={styles.itemLinePrice}>
                            RWF {(item.unitPrice ?? 0).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                      <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Total</Text>
                        <Text style={styles.amountValue}>
                          RWF {order.amount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Pickup signature code */}
                  {order.pickupSignature && (
                    <View style={styles.signatureRow}>
                      <Ionicons name="key-outline" size={15} color="#1C74E9" />
                      <Text style={styles.signatureLabel}>Pickup Code:</Text>
                      <Text style={styles.signatureCode}>{order.pickupSignature}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCallCustomer(order.phone)}
                  >
                    <Ionicons name="call" size={16} color="#10B981" />
                    <Text style={styles.callBtnText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.verifyBtn,
                      !hasArrived && styles.verifyBtnDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={!hasArrived}
                    onPress={() => handleVerifyOrder(order.id)}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={16}
                      color={hasArrived ? "white" : "#94A3B8"}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.verifyBtnText,
                        !hasArrived && { color: "#94A3B8" },
                      ]}
                    >
                      Verify & Deliver
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Delivered Orders */}
        {deliveredOrders.length > 0 && (
          <>
            <View style={[styles.sectionHeaderWrap, { marginTop: 16 }]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#10B981"
              />
              <Text style={[styles.sectionTitle, { color: "#10B981" }]}>
                DELIVERED ({deliveredOrders.length})
              </Text>
            </View>

            {deliveredOrders.map((order) => (
              <View key={order.id} style={styles.deliveredCard}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliveredName}>
                    {order.customerName}
                  </Text>
                  <Text style={styles.deliveredAddress}>{order.address}</Text>
                </View>
                <Text style={styles.deliveredBadge}>DONE</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.footerText}>ACTIVE DELIVERY SESSION</Text>
      </ScrollView>

      {/* Leave Confirmation */}
      {showLeaveConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Ionicons name="warning" size={40} color="#F59E0B" />
            <Text style={styles.modalTitle}>Leave Delivery?</Text>
            <Text style={styles.modalText}>
              You have {pendingOrders.length} undelivered order(s). Are you sure
              you want to leave?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLeaveConfirm(false)}
              >
                <Text style={styles.modalCancelText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLeaveBtn}
                onPress={finishSession}
              >
                <Text style={styles.modalLeaveText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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

  // Zone arrival card
  arrivalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#BFDBFE",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  arrivalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  arrivalTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  arrivalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  arrivedZoneBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    width: "100%",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  arrivedZoneBtnText: { fontSize: 15, fontWeight: "700", color: "white" },

  // Arrived banner
  arrivedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  arrivedBannerText: { fontSize: 13, color: "#166534", fontWeight: "600", flex: 1 },

  // Order cards
  orderCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  orderNumberWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  orderNumber: { fontSize: 13, fontWeight: "800", color: "#1C74E9" },
  orderCustomer: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  orderId: { fontSize: 11, color: "#94A3B8", fontWeight: "500", marginTop: 1 },
  itemBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderDetails: {
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 12,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#475569", fontWeight: "500" },

  orderActions: { flexDirection: "row", gap: 10 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  callBtnText: { fontSize: 13, fontWeight: "700", color: "#10B981" },
  verifyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1C74E9",
  },
  verifyBtnDisabled: { backgroundColor: "#E2E8F0" },
  verifyBtnText: { fontSize: 13, fontWeight: "700", color: "white" },

  // Items list inside order card
  itemsList: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    gap: 6,
  },
  itemLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1C74E9",
  },
  itemLineName: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  itemLineQty: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    minWidth: 24,
    textAlign: "right",
  },
  itemLinePrice: {
    fontSize: 12,
    color: "#64748B",
    minWidth: 80,
    textAlign: "right",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 4,
  },
  amountLabel: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  amountValue: { fontSize: 13, fontWeight: "800", color: "#1C74E9" },

  // Pickup signature
  signatureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    gap: 6,
  },
  signatureLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  signatureCode: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1C74E9",
    letterSpacing: 2,
  },

  // Delivered
  deliveredCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveredName: { fontSize: 14, fontWeight: "600", color: "#10B981" },
  deliveredAddress: { fontSize: 12, color: "#6EE7B7", marginTop: 2 },
  deliveredBadge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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

  // Leave modal
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  modalText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  modalLeaveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  modalLeaveText: { fontSize: 14, fontWeight: "700", color: "white" },
});
