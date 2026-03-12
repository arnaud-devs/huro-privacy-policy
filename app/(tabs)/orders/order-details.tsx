import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ORDERS: Record<
  string,
  {
    orderNumber: string;
    status: "Delivered" | "Cancelled";
    price: string;
    placedAt: string;
    product: { title: string; store: string; qty: number; image: string };
    timeline: { label: string; time: string; note: string }[];
    deliveryLocation: { name: string; address: string };
  }
> = {
  "1": {
    orderNumber: "#1243",
    status: "Delivered",
    price: "RWF 15,000",
    placedAt: "Placed on Oct 24, 2:30 PM",
    product: {
      title: "Premium Wireless Headph...",
      store: "TechHub Campus Store",
      qty: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    },
    timeline: [
      {
        label: "Delivered",
        time: "Oct 24, 4:15 PM",
        note: "Received by Customer",
      },
      {
        label: "Out for Delivery",
        time: "Oct 24, 3:45 PM",
        note: "Courier is nearby",
      },
      {
        label: "Order Shipped",
        time: "Oct 24, 3:00 PM",
        note: "Leaves TechHub Store",
      },
      {
        label: "Order Confirmed",
        time: "Oct 24, 2:35 PM",
        note: "Payment Verified",
      },
    ],
    deliveryLocation: {
      name: "UR CST Main Gate",
      address:
        "University of Rwanda, College of Science and Technology, Nyarugenge",
    },
  },
  "2": {
    orderNumber: "#1244",
    status: "Delivered",
    price: "RWF 12,500",
    placedAt: "Placed on Oct 22, 1:10 PM",
    product: {
      title: "Double Cheese Combo",
      store: "Campus Bites",
      qty: 2,
      image:
        "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400&q=80",
    },
    timeline: [
      {
        label: "Delivered",
        time: "Oct 22, 2:00 PM",
        note: "Received by Customer",
      },
      {
        label: "Out for Delivery",
        time: "Oct 22, 1:45 PM",
        note: "Courier is nearby",
      },
      {
        label: "Order Shipped",
        time: "Oct 22, 1:30 PM",
        note: "Leaves Campus Bites",
      },
      {
        label: "Order Confirmed",
        time: "Oct 22, 1:12 PM",
        note: "Payment Verified",
      },
    ],
    deliveryLocation: {
      name: "UR CST Main Gate",
      address:
        "University of Rwanda, College of Science and Technology, Nyarugenge",
    },
  },
};

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const order = ORDERS[orderId ?? "1"];

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-base text-slate-500">Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-slate-900 text-center mr-7">
          Order Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Order summary card */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          {/* Status + price */}
          <View className="flex-row items-center justify-between mb-2">
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <Text className="text-base font-bold text-primary">
              {order.price}
            </Text>
          </View>

          <Text className="text-xl font-bold text-slate-900">
            Order {order.orderNumber}
          </Text>
          <Text className="text-xs text-slate-500 mt-0.5 mb-4">
            {order.placedAt}
          </Text>

          {/* Product row */}
          <View className="flex-row items-center bg-slate-50 rounded-2xl p-3">
            <Image
              source={{ uri: order.product.image }}
              style={styles.productImage}
              contentFit="cover"
            />
            <View className="flex-1 ml-3">
              <Text
                className="text-sm font-bold text-slate-900"
                numberOfLines={1}
              >
                {order.product.title}
              </Text>
              <Text className="text-xs text-slate-500 mt-0.5">
                {order.product.store}
              </Text>
              <Text className="text-xs text-slate-400 mt-0.5">
                Qty: {order.product.qty}
              </Text>
            </View>
          </View>
        </View>

        {/* Tracking Status */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
            Tracking Status
          </Text>

          {order.timeline.map((step, index) => {
            const isLast = index === order.timeline.length - 1;
            return (
              <View key={index} className="flex-row">
                {/* Dot + line */}
                <View className="items-center mr-4" style={styles.dotCol}>
                  <View style={styles.dot}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                  {!isLast && <View style={styles.connector} />}
                </View>

                {/* Text */}
                <View className="pb-5 flex-1">
                  <Text className="text-sm font-bold text-slate-900">
                    {step.label}
                  </Text>
                  <Text className="text-xs text-slate-400 mt-0.5">
                    {step.time} • {step.note}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Location */}
        <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100">
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={18} color="#0f172a" />
            <Text className="text-base font-bold text-slate-900 ml-2">
              Delivery Location
            </Text>
          </View>
          <Text className="text-base font-bold text-slate-900 mt-1">
            {order.deliveryLocation.name}
          </Text>
          <Text className="text-sm text-slate-500 mt-1 leading-5">
            {order.deliveryLocation.address}
          </Text>
        </View>

        {/* Feedback button */}
        <TouchableOpacity className="mx-4 mt-4 bg-white rounded-2xl py-4 flex-row items-center justify-center border border-slate-100">
          <Ionicons name="chatbox-outline" size={18} color="#0f172a" />
          <Text className="text-sm font-bold text-slate-900 ml-2">
            Feedback
          </Text>
        </TouchableOpacity>

        <View className="h-28" />
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 pb-8">
        <TouchableOpacity className="bg-primary flex-row items-center justify-center py-4 rounded-2xl">
          <Ionicons name="list-outline" size={18} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Reorder Items
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: "#16a34a", fontSize: 12, fontWeight: "700" },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  dotCol: { width: 24 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginTop: 2,
    marginBottom: 2,
    minHeight: 16,
  },
});
