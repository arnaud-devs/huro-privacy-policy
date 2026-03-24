import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch } from "@/store/hooks";
import {
  setDeliveryPhase,
  SAMPLE_ORDER_DETAILS,
} from "@/store/slices/riderSlice";

export default function ArrivedScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const order = useMemo(() => {
    if (!orderId) return null;
    return SAMPLE_ORDER_DETAILS[orderId] ?? null;
  }, [orderId]);

  const handleCall = () => {
    if (order?.snapshotPhone) {
      Linking.openURL(`tel:${order.snapshotPhone.replace(/\s/g, "")}`);
    }
  };

  const handleVerifyDelivery = () => {
    router.push({
      pathname: "/(rider)/scan-qr",
      params: { orderId: orderId! },
    });
  };

  const handleManualCode = () => {
    router.push({
      pathname: "/(rider)/manual-code-entry",
      params: { orderId: orderId! },
    });
  };

  const handleGoBack = () => {
    dispatch(setDeliveryPhase("delivering"));
    router.back();
  };

  const handleReportIssue = () => {
    router.push({
      pathname: "/(rider)/delivery-issues",
      params: { orderId: orderId! },
    });
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arrived</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Arrival Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <Ionicons name="flag" size={32} color="#1C74E9" />
          </View>
          <Text style={styles.bannerTitle}>You've Arrived!</Text>
          <Text style={styles.bannerSubtitle}>
            Notify the customer and verify delivery
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Customer Details</Text>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color="#64748B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{order.snapshotName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#64748B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{order.snapshotPhone}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Ionicons name="call" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#64748B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {order.customAddress ?? order.snapshotZoneName}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="map-outline" size={18} color="#64748B" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Zone</Text>
              <Text style={styles.infoValue}>{order.snapshotZoneName}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Order Summary</Text>
          <Text style={styles.orderIdLabel}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>

          {(order.orderItems ?? []).map((item) => (
            <View key={item.id} style={styles.orderItemRow}>
              <Text style={styles.orderItemName}>{item.productName}</Text>
              <Text style={styles.orderItemQty}>x{item.quantity}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {order.payableAmount.toLocaleString()} NGN
            </Text>
          </View>
        </View>

        {/* Verification Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Verify Delivery</Text>
          <Text style={styles.actionsSubtitle}>
            Ask the customer to show their QR code or provide the delivery code
          </Text>

          <TouchableOpacity
            style={styles.scanBtn}
            activeOpacity={0.85}
            onPress={handleVerifyDelivery}
          >
            <Ionicons
              name="qr-code-outline"
              size={22}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.scanBtnText}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manualBtn}
            activeOpacity={0.85}
            onPress={handleManualCode}
          >
            <Ionicons
              name="keypad-outline"
              size={22}
              color="#1C74E9"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.manualBtnText}>Enter Code Manually</Text>
          </TouchableOpacity>
        </View>

        {/* Report Issue */}
        <TouchableOpacity
          style={styles.issueBtn}
          activeOpacity={0.7}
          onPress={handleReportIssue}
        >
          <Ionicons name="warning-outline" size={18} color="#F59E0B" />
          <Text style={styles.issueBtnText}>Report an Issue</Text>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#64748B", fontWeight: "600" },
  linkText: { fontSize: 14, color: "#1C74E9", fontWeight: "600", marginTop: 12 },

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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },

  scrollContent: { padding: 16, paddingBottom: 40 },

  // Banner
  bannerCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  bannerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },

  // Info Card
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  infoValue: { fontSize: 14, color: "#0F172A", fontWeight: "600", marginTop: 2 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  // Order summary
  orderIdLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 12,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  orderItemName: { fontSize: 14, color: "#334155", fontWeight: "500" },
  orderItemQty: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalLabel: { fontSize: 14, color: "#0F172A", fontWeight: "700" },
  totalValue: { fontSize: 16, color: "#1C74E9", fontWeight: "800" },

  // Actions
  actionsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionsTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  actionsSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  scanBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
  manualBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  manualBtnText: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },

  // Issue button
  issueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  issueBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
  },
});
