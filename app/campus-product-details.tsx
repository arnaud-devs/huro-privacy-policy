import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";

export default function CampusProductDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === id)
  );
  const isAdding = useAppSelector((state) => state.cart.isAdding);
  const [quantity, setQuantity] = useState(1);

  async function handleAddToCart() {
    if (!product) return;
    const result = await dispatch(addToCart({ productId: product.id, quantity }));
    if (addToCart.fulfilled.match(result)) {
      Alert.alert("Added to cart", `${product.name} × ${quantity} added successfully.`, [
        { text: "View Cart", onPress: () => router.push("/cart") },
        { text: "Continue Shopping", style: "cancel" },
      ]);
    } else {
      Alert.alert("Error", (result.payload as string) || "Failed to add item to cart.");
    }
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top"]}>
        <TouchableOpacity onPress={() => router.back()} className="absolute top-14 left-4">
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-slate-400 text-sm">Product not found.</Text>
      </SafeAreaView>
    );
  }

  const basePrice = parseFloat(product.price);
  const displayPrice = product.promotionPrice ?? basePrice;

  async function handleShare() {
    await Share.share({ message: `Check out ${product!.name} for RWF ${displayPrice.toLocaleString()} on HuzaGo!` });
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
          source={{ uri: product.imageUrls?.[0] }}
          style={styles.heroImage}
          contentFit="cover"
        />

        <View className="px-4 pt-4">
          {/* Name + sale badge */}
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-2xl font-bold text-slate-800 flex-1 mr-3">
              {product.name}
            </Text>
            {product.promotionPrice && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Sale</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center gap-3 mb-4">
            <Text style={styles.price}>RWF {displayPrice.toLocaleString()}</Text>
            {product.promotionPrice && product.originalPrice && (
              <Text className="text-slate-400 text-base line-through">
                RWF {product.originalPrice.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Seller card */}
          <TouchableOpacity style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="storefront-outline" size={20} color="#1C74E9" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-bold text-slate-800">{product.seller.sellerName}</Text>
              <Text className="text-xs text-slate-500">
                {product.hasPickupLocation ? "Has Pickup Location" : "Campus Seller"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          {/* Description */}
          <Text className="text-base font-bold text-slate-800 mb-2">Description</Text>
          <Text className="text-sm text-slate-500 leading-6 mb-5">
            {product.description}
          </Text>

          {/* Stock info */}
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryLabel}>AVAILABILITY</Text>
            <View className="flex-row mt-3 gap-4">
              <View style={styles.deliveryItem}>
                <View style={styles.deliveryIcon}>
                  <Ionicons name="cube-outline" size={18} color="#1C74E9" />
                </View>
                <View className="ml-2">
                  <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    In Stock
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} left` : "Out of stock"}
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
        <TouchableOpacity
          style={[styles.cartBtn, isAdding && { opacity: 0.7 }]}
          onPress={handleAddToCart}
          disabled={isAdding || product.stockQuantity === 0}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="cart-outline" size={20} color="white" />
              <Text style={styles.cartBtnText}>
                {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Text>
            </>
          )}
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
