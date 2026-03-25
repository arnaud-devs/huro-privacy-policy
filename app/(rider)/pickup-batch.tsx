import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PickupBottomBar } from "@/components/rider/pickup-batch/PickupBottomBar";
import { PickupOrderCard } from "@/components/rider/pickup-batch/PickupOrderCard";
import { PickupProgressBar } from "@/components/rider/pickup-batch/PickupProgressBar";
import { usePickupBatch } from "@/hooks/usePickupBatch";

export default function PickupBatchScreen() {
  const router = useRouter();
  const {
    isLoadingBatchDetail,
    pickupOrders,
    pickedUpOrderIds,
    totalItems,
    collectedItems,
    allCollected,
    allAlreadyPickedUp,
    isPickingUp,
    toggleItem,
    handleMarkAll,
    handleStartDelivery,
    handleContinueToDelivery,
  } = usePickupBatch();

  if (isLoadingBatchDetail) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1C74E9" />
          <Text style={styles.loadingText}>Loading pickup...</Text>
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
        <Text style={styles.headerTitle}>Pickup</Text>
        <View style={{ width: 40 }} />
      </View>

      <PickupProgressBar
        collectedItems={collectedItems}
        totalItems={totalItems}
        allAlreadyPickedUp={allAlreadyPickedUp}
        hasOrders={pickupOrders.length > 0}
        onMarkAll={handleMarkAll}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pickupOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="bag-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No claimed orders</Text>
            <Text style={styles.emptySubtitle}>
              Go back to batch details to claim orders first
            </Text>
          </View>
        ) : (
          pickupOrders.map((order) => (
            <PickupOrderCard
              key={order.orderId}
              order={order}
              isLocked={pickedUpOrderIds.includes(order.orderId)}
              onToggleItem={toggleItem}
            />
          ))
        )}
      </ScrollView>

      {pickupOrders.length > 0 && (
        <PickupBottomBar
          allAlreadyPickedUp={allAlreadyPickedUp}
          allCollected={allCollected}
          isPickingUp={isPickingUp}
          onStartDelivery={handleStartDelivery}
          onContinueToDelivery={handleContinueToDelivery}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#64748B", marginTop: 12, fontSize: 14 },
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
  scrollContent: { padding: 16, paddingBottom: 100 },
  emptyWrap: { alignItems: "center", paddingVertical: 48 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#64748B", marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: "#94A3B8", marginTop: 4 },
});
