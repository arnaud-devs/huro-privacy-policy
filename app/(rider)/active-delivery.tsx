import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeliveryProgressCard } from "@/components/rider/DeliveryProgressCard";
import { LeaveDeliveryModal } from "@/components/rider/LeaveDeliveryModal";
import { ConfirmDeliveryModal } from "@/components/rider/ConfirmDeliveryModal";
import { ManualPickupEntry } from "@/components/rider/ManualPickupEntry";
import { NextPriorityCard } from "@/components/rider/NextPriorityCard";
import { QueueItemCard } from "@/components/rider/QueueItemCard";
import { RecentlyDeliveredCard } from "@/components/rider/RecentlyDeliveredCard";

export default function ActiveDeliveryScreen() {
  const router = useRouter();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLeavePress = () => {
    setShowLeaveModal(true);
  };

  const handleReturn = () => {
    setShowLeaveModal(false);
  };

  const handleGoToDashboard = () => {
    setShowLeaveModal(false);
    router.replace("/(rider)");
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLeavePress}>
          <Ionicons name="close" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Active Delivery Mode</Text>
          <Text style={styles.headerSubtitle}>Batch #124</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#1C74E9" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DeliveryProgressCard />

        <NextPriorityCard onOptionsPress={() => setShowConfirmModal(true)} onMarkDelivered={() => router.push("/(rider)/scan-qr")} />

        <ManualPickupEntry />

        <View style={styles.sectionHeaderWrap}>
          <Ionicons name="documents-outline" size={16} color="#94A3B8" />
          <Text style={styles.sectionTitle}>REMAINING QUEUE</Text>
        </View>

        <QueueItemCard onOptionsPress={() => setShowConfirmModal(true)} onMarkDelivered={() => router.push("/(rider)/scan-qr")} />

        <View style={[styles.sectionHeaderWrap, { marginTop: 12 }]}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#94A3B8" />
          <Text style={styles.sectionTitle}>RECENTLY DELIVERED</Text>
        </View>

        <RecentlyDeliveredCard
          code="4219"
          orderId="Order #1039"
          details="Engineering Dorm A • 2m ago"
        />

        <RecentlyDeliveredCard
          code="8822"
          orderId="Order #1038"
          details="Admin Central • 5m ago"
        />

        <Text style={styles.footerText}>ACTIVE DELIVERY SESSION • LOCKED</Text>
      </ScrollView>

      <LeaveDeliveryModal
        visible={showLeaveModal}
        onReturn={handleReturn}
        onGoToDashboard={handleGoToDashboard}
      />

      <ConfirmDeliveryModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 10,
  },
});
