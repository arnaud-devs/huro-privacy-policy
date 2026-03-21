import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PickupProgressCard } from "@/components/rider/PickupProgressCard";
import {
    PickupShopSection,
    ShopBatch,
} from "@/components/rider/PickupShopSection";
import { PickupStatsGrid } from "@/components/rider/PickupStatsGrid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBatchDetail } from "@/store/slices/riderSlice";

function ordersToShops(orders: any[]): ShopBatch[] {
  return orders.map((order) => {
    const items = order.orderItems ?? order.items ?? [];
    const orderId = order.id ?? "";
    return {
      name: `Order #${orderId.slice(0, 6).toUpperCase()}`,
      orders: items.length,
      items: items.map((item: any) => {
        const itemId = item.id ?? "";
        return {
          id: itemId.slice(0, 6).toUpperCase(),
          name: `${item.productName ?? item.name ?? "Item"}${item.quantity > 1 ? ` x${item.quantity}` : ""}`,
          status: "not-collected" as const,
        };
      }),
    };
  });
}

export default function PickupBatchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const { batchDetail, isLoadingBatchDetail } = useAppSelector((state) => state.rider);

  useEffect(() => {
    if (batchId) dispatch(fetchBatchDetail(batchId));
  }, [batchId]);

  const [shops, setShops] = useState<ShopBatch[]>([]);

  useEffect(() => {
    if (batchDetail?.orders) {
      setShops(ordersToShops(batchDetail.orders));
    }
  }, [batchDetail]);

  const totalOrders = batchDetail?.currentOrders ?? 0;
  const pickedUp = shops.reduce((total, shop) => {
    return total + shop.items.filter((item) => item.status === "collected").length;
  }, 0);

  const handleItemToggle = (shopName: string, itemId: string) => {
    setShops((prevShops) =>
      prevShops.map((shop) => {
        if (shop.name !== shopName) return shop;

        return {
          ...shop,
          items: shop.items.map((item) => {
            if (item.id !== itemId) return item;

            let newStatus = item.status;
            if (item.status === "not-collected") newStatus = "pending";
            else if (item.status === "pending") newStatus = "collected";
            else if (item.status === "collected") newStatus = "out-of-stock";
            else if (item.status === "out-of-stock")
              newStatus = "not-collected";

            return { ...item, status: newStatus as any };
          }),
        };
      }),
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {batchDetail?.id ? `Batch #${batchDetail.id.slice(0, 6).toUpperCase()}` : "Pickup Batch"}
          </Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="warning-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {isLoadingBatchDetail ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#1C74E9" />
          </View>
        ) : (
          <>
            <PickupStatsGrid
              totalOrders={batchDetail?.currentOrders ?? 0}
              ridersCount={batchDetail?.riders?.length ?? 0}
              zoneName={batchDetail?.deliveryZone?.name ?? "—"}
            />
            <PickupProgressCard pickedUp={pickedUp} totalOrders={totalOrders} />
          </>
        )}

        {shops.map((shop) => (
          <PickupShopSection
            key={shop.name}
            shop={shop}
            onItemToggle={handleItemToggle}
          />
        ))}

        <TouchableOpacity
          style={styles.startDeliveryBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/(rider)/active-delivery")}
        >
          <Text style={styles.startDeliveryText}>Start Delivery</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 26,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "800",
  },
  startDeliveryBtn: {
    height: 52,
    borderRadius: 20,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  startDeliveryText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
