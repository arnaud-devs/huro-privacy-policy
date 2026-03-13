import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PickupProgressCard } from "@/components/rider/PickupProgressCard";
import { PickupShopSection, ShopBatch } from "@/components/rider/PickupShopSection";
import { PickupStatsGrid } from "@/components/rider/PickupStatsGrid";

const INITIAL_SHOPS: ShopBatch[] = [
  {
    name: "Snack Shop",
    orders: 6,
    items: [
      { id: "#1034", name: "Potato Chips (L)", status: "not-collected" },
      { id: "#1035", name: "Soda Pack x2", status: "collected" },
      { id: "#1036", name: "Ice Cream", status: "out-of-stock" },
      { id: "#1037", name: "Energy Drink", status: "pending" },
    ],
  },
  {
    name: "Printing Shop",
    orders: 4,
    items: [
      { id: "#1101", name: "A4 Documents (50p)", status: "pending" },
      { id: "#1102", name: "Thesis Binding", status: "not-collected" },
    ],
  },
];

export default function PickupBatchScreen() {
  const router = useRouter();
  const [shops, setShops] = useState<ShopBatch[]>(INITIAL_SHOPS);
  
  const totalOrders = 26;
  // Calculate newly picked up items natively based on interaction
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
            else if (item.status === "out-of-stock") newStatus = "not-collected";

            return { ...item, status: newStatus as any };
          }),
        };
      })
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pickup Batch #124</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="warning-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <PickupStatsGrid />
        <PickupProgressCard pickedUp={pickedUp} totalOrders={totalOrders} />

        {shops.map((shop) => (
          <PickupShopSection
            key={shop.name}
            shop={shop}
            onItemToggle={handleItemToggle}
          />
        ))}

        <TouchableOpacity style={styles.startDeliveryBtn} activeOpacity={0.85}>
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
