import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ArrivalBanner } from "@/components/rider/arrived/ArrivalBanner";
import { CustomerInfoCard } from "@/components/rider/arrived/CustomerInfoCard";
import { OrderSummaryCard } from "@/components/rider/arrived/OrderSummaryCard";
import { VerifyDeliveryCard } from "@/components/rider/arrived/VerifyDeliveryCard";
import { useArrived } from "@/hooks/useArrived";

export default function ArrivedScreen() {
  const router = useRouter();
  const { order, handleCall, handleVerifyDelivery, handleManualCode, handleGoBack, handleReportIssue } =
    useArrived();

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
        <ArrivalBanner />

        <CustomerInfoCard
          name={order.snapshotName}
          phone={order.snapshotPhone}
          address={order.customAddress ?? order.snapshotZoneName}
          zone={order.snapshotZoneName}
          onCall={handleCall}
        />

        <OrderSummaryCard
          orderId={order.id}
          items={order.orderItems ?? []}
          total={order.payableAmount}
        />

        <VerifyDeliveryCard
          onScanQR={handleVerifyDelivery}
          onManualCode={handleManualCode}
          onReportIssue={handleReportIssue}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#64748B", fontWeight: "600" },
  linkText: { fontSize: 14, color: "#1C74E9", fontWeight: "600", marginTop: 12 },
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
});
