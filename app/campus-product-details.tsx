import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Product {
  id: string;
  name: string;
  price: string;
  badge?: string;
  image: string;
  seller: string;
  sellerVerified: boolean;
  description: string;
  batchTime: string;
  pickupAt: string;
}

const PRODUCTS: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Chapati + Soda",
    price: "1500 RWF",
    badge: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Bistro",
    sellerVerified: true,
    description:
      "Freshly made flaky chapati paired with your choice of a chilled 300ml soda. Perfect for a quick lunch or late-night study session. Our batch delivery ensures your food arrives warm and fresh.",
    batchTime: "12:00 PM\nToday",
    pickupAt: "Main Gate",
  },
  "2": {
    id: "2",
    name: "Lay's Classic Chips",
    price: "RWF 150",
    image:
      "https://images.unsplash.com/photo-1566478989037-e6281fd470fa?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Store",
    sellerVerified: true,
    description:
      "Crispy Lay's Classic Chips in the original salted flavour. Great for a quick snack between classes.",
    batchTime: "On Demand",
    pickupAt: "Block A",
  },
  "3": {
    id: "3",
    name: "A4 Print Paper (10 sheets)",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1588666579624-9b22e11a3dbe?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Store",
    sellerVerified: true,
    description:
      "High-quality A4 80gsm print paper, sold in packs of 10 sheets. Perfect for printing assignments and notes.",
    batchTime: "On Demand",
    pickupAt: "Library",
  },
  "4": {
    id: "4",
    name: "Fast USB-C Cable",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1624823183533-3d0b2ac84587?auto=format&fit=crop&w=800&q=80",
    seller: "Tech Corner",
    sellerVerified: true,
    description:
      "Braided USB-C fast charging cable, 1m length. Compatible with all USB-C devices including phones and laptops.",
    batchTime: "On Demand",
    pickupAt: "Tech Corner",
  },
  "5": {
    id: "5",
    name: "Spiral Notebook A5",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5406c59b207?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Store",
    sellerVerified: true,
    description:
      "100-page A5 spiral notebook with lined pages. Durable cover and smooth paper, ideal for lectures and study notes.",
    batchTime: "On Demand",
    pickupAt: "Block A",
  },
  "6": {
    id: "6",
    name: "Fresh Milk 1L",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Bistro",
    sellerVerified: true,
    description:
      "Fresh whole milk, 1 litre. Sourced daily from local farms. Great for cereals, coffee, or a straight-up glass.",
    batchTime: "7:00 AM\nToday",
    pickupAt: "Cafeteria",
  },
  "7": {
    id: "7",
    name: "Gel Pen Set (3pcs)",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Store",
    sellerVerified: true,
    description:
      "Set of 3 smooth-writing 0.5mm gel pens in black, blue, and red. Ideal for note-taking and assignments.",
    batchTime: "On Demand",
    pickupAt: "Block A",
  },
  "deal-1": {
    id: "deal-1",
    name: "Chapati + Soda Combo",
    price: "1,500 RWF",
    badge: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Bistro",
    sellerVerified: true,
    description:
      "Freshly made flaky chapati paired with your choice of a chilled 300ml soda. Perfect for a quick lunch or late-night study session. Our batch delivery ensures your food arrives warm and fresh.",
    batchTime: "12:00 PM\nToday",
    pickupAt: "Main Gate",
  },
  "deal-2": {
    id: "deal-2",
    name: "Late Night Snacks",
    price: "3,000 RWF",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    seller: "Campus Bistro",
    sellerVerified: true,
    description:
      "A curated late-night snack bundle with chips, a drink, and a sweet treat. Available from 8 PM every night.",
    batchTime: "8:00 PM\nToday",
    pickupAt: "Main Gate",
  },
};

export default function CampusProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS[id ?? "1"] ?? PRODUCTS["1"];
  const [quantity, setQuantity] = useState(1);

  async function handleShare() {
    await Share.share({ message: `Check out ${product.name} for ${product.price} on HuzaGo!` });
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">
          Product Details
        </Text>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="share-outline" size={22} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero image */}
        <Image
          source={{ uri: product.image }}
          style={styles.heroImage}
          contentFit="cover"
        />

        <View className="px-4 pt-4">
          {/* Name + badge */}
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-2xl font-bold text-slate-800 flex-1 mr-3">
              {product.name}
            </Text>
            {product.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{product.badge}</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <Text style={styles.price}>{product.price}</Text>

          {/* Seller card */}
          <TouchableOpacity style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="storefront-outline" size={20} color="#1C74E9" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-bold text-slate-800">{product.seller}</Text>
              <Text className="text-xs text-slate-500">
                {product.sellerVerified ? "Verified Campus Seller" : "Campus Seller"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          {/* Description */}
          <Text className="text-base font-bold text-slate-800 mb-2">Description</Text>
          <Text className="text-sm text-slate-500 leading-6 mb-5">
            {product.description}
          </Text>

          {/* Delivery Model Info */}
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryLabel}>DELIVERY MODEL INFO</Text>
            <View className="flex-row mt-3 gap-4">
              <View style={styles.deliveryItem}>
                <View style={styles.deliveryIcon}>
                  <Ionicons name="time-outline" size={18} color="#1C74E9" />
                </View>
                <View className="ml-2">
                  <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    Batch Time
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5">
                    {product.batchTime}
                  </Text>
                </View>
              </View>
              <View style={styles.deliveryDivider} />
              <View style={styles.deliveryItem}>
                <View style={styles.deliveryIcon}>
                  <Ionicons name="location-outline" size={18} color="#1C74E9" />
                </View>
                <View className="ml-2">
                  <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    Pickup At
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5">
                    {product.pickupAt}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {/* Quantity */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={18} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={18} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Add to Cart */}
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#f1f5f9",
  },
  badge: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d97706",
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1C74E9",
    marginTop: 4,
    marginBottom: 16,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sellerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryCard: {
    backgroundColor: "#f0f7ff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  deliveryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliveryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#bfdbfe",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 12,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },
  qtyText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  cartBtn: {
    flex: 1,
    backgroundColor: "#1C74E9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  cartBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
