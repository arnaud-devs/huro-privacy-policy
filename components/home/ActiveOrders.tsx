import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "@/store/hooks";
import { Order, OrderStatus } from "@/store/slices/ordersSlice";

const ACTIVE_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT", "PAID", "PREPARING", "READY_FOR_PICKUP", "PICKED_UP", "IN_DELIVERY",
];

function statusBadge(status: OrderStatus): { label: string; bg: string; text: string } {
  switch (status) {
    case "PENDING_PAYMENT": return { label: "Pending Payment", bg: "#fff7ed", text: "#ea580c" };
    case "PAID":            return { label: "Paid", bg: "#eff6ff", text: "#1C74E9" };
    case "PREPARING":       return { label: "Preparing", bg: "#fff7ed", text: "#ea580c" };
    case "READY_FOR_PICKUP":return { label: "Ready for Pickup", bg: "#dcfce7", text: "#16a34a" };
    case "PICKED_UP":       return { label: "Picked Up", bg: "#dcfce7", text: "#16a34a" };
    case "IN_DELIVERY":     return { label: "On the way", bg: "#dcfce7", text: "#16a34a" };
    default:                return { label: status, bg: "#f1f5f9", text: "#64748b" };
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const badge = statusBadge(order.status);
  const orderId = `#${order.id.slice(0, 6).toUpperCase()}`;
  const location = order.deliveryZone?.name ?? "Campus";
  const arrivalTime = order.batch?.scheduledAt ? formatTime(order.batch.scheduledAt) : "—";
  const slotLabel = order.batch?.slotLabel ?? "";

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 flex-row items-center border border-slate-200 mb-3"
      onPress={() =>
        router.push({
          pathname: "/(tabs)/orders/order-status",
          params: { orderId: order.id },
        })
      }
    >
      <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
        <Ionicons name="cube-outline" size={24} color="#1C74E9" />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center mb-2">
          <Text className="text-base font-bold text-slate-900 mr-2">{orderId}</Text>
          <View style={{ backgroundColor: badge.bg }} className="px-2 py-0.5 rounded-md">
            <Text style={{ color: badge.text }} className="text-xxs font-bold">
              {badge.label}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-1">
          <Ionicons name="location-outline" size={14} color="#1C74E9" />
          <Text className="text-sm font-semibold text-slate-900 ml-1.5" numberOfLines={1}>
            Pickup: {location}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#64748B" />
          <Text className="text-sm text-slate-500 ml-1.5">
            {slotLabel ? `${slotLabel} · ` : ""}Arrives: {arrivalTime}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#A0A5B1" />
    </TouchableOpacity>
  );
}

export default function ActiveOrders() {
  const router = useRouter();
  const orders = useAppSelector((state) => state.orders.orders);
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

  if (activeOrders.length === 0) return null;

  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">Your Active Orders</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/orders")}>
          <Text className="text-sm text-primary font-semibold">See all</Text>
        </TouchableOpacity>
      </View>

      {activeOrders.slice(0, 3).map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}
