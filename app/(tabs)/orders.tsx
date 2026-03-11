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

import ActiveOrderCard from "@/components/orders/ActiveOrderCard";
import RecentlyDelivered from "@/components/orders/RecentlyDelivered";

type Tab = "Active" | "Delivered" | "Cancelled";
const TABS: Tab[] = ["Active", "Delivered", "Cancelled"];

const ACTIVE_ORDERS = [
  {
    id: "1",
    title: "Snack Pack",
    store: "Campus Store",
    orderId: "#44291",
    eta: "12 mins",
    stage: "Kitchen stage",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: { label: "Collecting", color: "orange" as const },
    primaryAction: { label: "Track Order", icon: "location-outline" },
  },
  {
    id: "2",
    title: "Iced Americano x2",
    store: "Coffee Beanery",
    orderId: "#44288",
    eta: "4 mins",
    stage: "Near Main Gate",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    badge: { label: "Arrived", color: "blue" as const },
    primaryAction: { label: "Call Rider", icon: "bicycle-outline" },
  },
];

const RECENT_ORDERS = [
  {
    id: "1",
    title: "Healthy Garden S...",
    date: "Delivered Oct 24",
    amount: "$12.50",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80",
    action: "rate" as const,
  },
  {
    id: "2",
    title: "Double Cheese Combo",
    date: "Delivered Oct 22",
    amount: "$15.00",
    image:
      "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=200&q=80",
    action: "reorder" as const,
  },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("Active");
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white px-4 pt-2 pb-0 border-b border-slate-100">
        {/* Title row with action icons */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-slate-900">Orders</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity style={{ position: "relative" }}>
              <Ionicons name="cart-outline" size={24} color="#0F172A" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ position: "relative" }}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#0F172A"
              />
              <View style={styles.dotBadge} />
            </TouchableOpacity>
          </View>
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
                  style={
                    isActive ? styles.activeTabText : styles.inactiveTabText
                  }
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Active" && (
          <>
            <Text className="text-lg font-bold text-slate-900 mb-4">
              Ongoing Deliveries
            </Text>

            {ACTIVE_ORDERS.map((order) => (
              <ActiveOrderCard
                key={order.id}
                {...order}
                onPrimaryAction={
                  order.primaryAction.label === "Track Order"
                    ? () =>
                        router.push({
                          pathname: "/order-status",
                          params: { orderId: order.id },
                        })
                    : undefined
                }
              />
            ))}

            <RecentlyDelivered
              items={RECENT_ORDERS}
              onPress={(id) =>
                router.push({
                  pathname: "/order-details",
                  params: { orderId: id },
                })
              }
            />
          </>
        )}

        {activeTab === "Delivered" && (
          <RecentlyDelivered
            items={RECENT_ORDERS}
            onPress={(id) =>
              router.push({
                pathname: "/order-details",
                params: { orderId: id },
              })
            }
          />
        )}

        {activeTab === "Cancelled" && (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-base text-slate-400 font-semibold">
              No cancelled orders
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeTabBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "#1C74E9",
  },
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
  cartBadgeText: {
    fontSize: 9,
    color: "white",
    fontWeight: "700",
  },
  dotBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
});
