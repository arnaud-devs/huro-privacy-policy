import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import ActiveOrderCard from "@/components/orders/ActiveOrderCard";
import RecentlyDelivered from "@/components/orders/RecentlyDelivered";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrderById, fetchOrders, Order, OrderStatus } from "@/store/slices/ordersSlice";

type Tab = "Active" | "Delivered" | "Cancelled";
const TABS: Tab[] = ["Active", "Delivered", "Cancelled"];

const ACTIVE_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT", "PAID", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP", "IN_DELIVERY",
];

function statusLabel(status: OrderStatus): string {
  return {
    PENDING_PAYMENT: "Pending Payment",
    PAID: "Paid",
    PREPARING: "Preparing",
    READY_FOR_PICKUP: "Ready for Pickup",
    PICKED_UP: "Picked Up",
    IN_DELIVERY: "In Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
  }[status] ?? status;
}

function badgeForStatus(status: OrderStatus): { label: string; color: "orange" | "blue" } {
  const blue: OrderStatus[] = ["PAID", "READY_FOR_PICKUP", "PICKED_UP", "IN_DELIVERY"];
  return {
    label: statusLabel(status),
    color: blue.includes(status) ? "blue" : "orange",
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("Active");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, isFetching, error, orderDetailsMap } = useAppSelector((state) => state.orders);
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Batch-fetch order details to get product names + images
  useEffect(() => {
    orders.forEach((order) => {
      if (!orderDetailsMap[order.id]) {
        dispatch(fetchOrderById(order.id));
      }
    });
  }, [orders, dispatch]);

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED" || o.status === "EXPIRED");

  function toActiveCard(order: Order) {
    const detail = orderDetailsMap[order.id];
    const firstItem = detail?.items?.[0];
    const name = firstItem?.product?.name ?? "Order";
    const itemCount = detail?.items?.length ?? 0;
    const image = firstItem?.product?.imageUrls?.[0] ?? "";
    return {
      id: order.id,
      title: name + (itemCount > 1 ? ` +${itemCount - 1} more` : ""),
      store: order.deliveryZone?.name ?? detail?.snapshotZoneName ?? "Campus Store",
      orderId: `#${order.id.slice(0, 6).toUpperCase()}`,
      eta: order.batch?.slotLabel ?? "—",
      stage: statusLabel(order.status),
      image,
      badge: badgeForStatus(order.status),
      primaryAction: { label: "Track Order", icon: "location-outline" },
    };
  }

  function toRecentCard(order: Order) {
    const detail = orderDetailsMap[order.id];
    const firstItem = detail?.items?.[0];
    return {
      id: order.id,
      title: firstItem?.product?.name ?? "Order",
      date: formatDate(order.createdAt),
      amount: `RWF ${(order.total ?? 0).toLocaleString()}`,
      image: firstItem?.product?.imageUrls?.[0] ?? "",
      action: "reorder" as const,
    };
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white px-4 pt-2 pb-0 border-b border-slate-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-slate-900">Orders</Text>
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#0F172A" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="flex-1 items-center pb-3"
                style={isActive ? styles.activeTabBorder : undefined}
              >
                <Text
                  className="text-sm font-semibold"
                  style={isActive ? styles.activeTabText : styles.inactiveTabText}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => dispatch(fetchOrders())}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {activeTab === "Active" && (
            <>
              {activeOrders.length === 0 ? (
                <View className="flex-1 items-center justify-center mt-20">
                  <Ionicons name="bicycle-outline" size={48} color="#cbd5e1" />
                  <Text className="text-base text-slate-400 font-semibold mt-3">
                    No active orders
                  </Text>
                </View>
              ) : (
                <>
                  <Text className="text-lg font-bold text-slate-900 mb-4">
                    Ongoing Deliveries
                  </Text>
                  {activeOrders.map((order) => (
                    <ActiveOrderCard
                      key={order.id}
                      {...toActiveCard(order)}
                      onPrimaryAction={() =>
                        router.push({
                          pathname: "/(tabs)/orders/order-status",
                          params: { orderId: order.id },
                        })
                      }
                    />
                  ))}
                </>
              )}

              {deliveredOrders.length > 0 && (
                <RecentlyDelivered
                  items={deliveredOrders.slice(0, 3).map(toRecentCard)}
                  onViewAll={() => setActiveTab("Delivered")}
                  onPress={(id) =>
                    router.push({
                      pathname: "/(tabs)/orders/order-details",
                      params: { orderId: id },
                    })
                  }
                />
              )}
            </>
          )}

          {activeTab === "Delivered" && (
            deliveredOrders.length === 0 ? (
              <View className="flex-1 items-center justify-center mt-20">
                <Ionicons name="checkmark-circle-outline" size={48} color="#cbd5e1" />
                <Text className="text-base text-slate-400 font-semibold mt-3">
                  No delivered orders yet
                </Text>
              </View>
            ) : (
              <RecentlyDelivered
                items={deliveredOrders.map(toRecentCard)}
                onPress={(id) =>
                  router.push({
                    pathname: "/(tabs)/orders/order-details",
                    params: { orderId: id },
                  })
                }
              />
            )
          )}

          {activeTab === "Cancelled" && (
            cancelledOrders.length === 0 ? (
              <View className="flex-1 items-center justify-center mt-20">
                <Text className="text-base text-slate-400 font-semibold">
                  No cancelled orders
                </Text>
              </View>
            ) : (
              <RecentlyDelivered
                items={cancelledOrders.map(toRecentCard)}
                onPress={(id) =>
                  router.push({
                    pathname: "/(tabs)/orders/order-details",
                    params: { orderId: id },
                  })
                }
              />
            )
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeTabBorder: { borderBottomWidth: 2, borderBottomColor: "#1C74E9" },
  activeTabText: { color: "#1C74E9" },
  inactiveTabText: { color: "#94a3b8" },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { fontSize: 9, color: "white", fontWeight: "700" },
});
