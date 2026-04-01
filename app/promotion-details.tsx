import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector } from "@/store/hooks";

function formatDiscount(discountType: string, discountValue: number): string {
  if (discountType === "PERCENTAGE") return `${discountValue}% OFF`;
  if (discountType === "FIXED") return `${discountValue.toLocaleString()} RWF OFF`;
  return "Special Deal";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PromotionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const promotion = useAppSelector((state) =>
    state.promotions.activePromotions.find((p) => p.id === id)
  );

  if (!promotion) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>Promotion not found</Text>
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promotion</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Banner */}
        {promotion.bannerUrl ? (
          <Image
            source={{ uri: promotion.bannerUrl }}
            style={styles.banner}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.banner, styles.bannerPlaceholder]}>
            <Text style={styles.discountBadgeText}>
              {formatDiscount(promotion.discountType, promotion.discountValue)}
            </Text>
          </View>
        )}

        {/* Title & badge */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{promotion.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {formatDiscount(promotion.discountType, promotion.discountValue)}
              </Text>
            </View>
          </View>
          {promotion.description ? (
            <Text style={styles.description}>{promotion.description}</Text>
          ) : null}

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.metaText}>
              Ends {formatDate(promotion.endsAt)}
            </Text>
          </View>

          {promotion.minCartValue > 0 && (
            <View style={styles.metaRow}>
              <Ionicons name="cart-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>
                Min. cart value: {promotion.minCartValue.toLocaleString()} RWF
              </Text>
            </View>
          )}
        </View>

        {/* Applicable products */}
        {promotion.products.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Applicable Products</Text>
            {promotion.products.map((p) => (
              <TouchableOpacity
                key={p.productId}
                style={styles.productRow}
                onPress={() =>
                  router.push({ pathname: "/product-details", params: { id: p.productId } })
                }
              >
                {p.product.imageUrls?.[0] ? (
                  <Image
                    source={{ uri: p.product.imageUrls[0] }}
                    style={styles.productImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.productImage, styles.productImagePlaceholder]}>
                    <Ionicons name="image-outline" size={20} color="#CBD5E1" />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{p.product.name}</Text>
                  {p.isFreeItem && (
                    <Text style={styles.freeTag}>FREE item</Text>
                  )}
                  {p.requiredQuantity > 1 && (
                    <Text style={styles.qtyTag}>Buy {p.requiredQuantity}+</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Category */}
        {promotion.category && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.categoryName}>{promotion.category.name}</Text>
          </View>
        )}
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
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },

  scroll: { paddingBottom: 32 },

  banner: { width: "100%", height: 200 },
  bannerPlaceholder: {
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadgeText: { fontSize: 28, fontWeight: "800", color: "#1C74E9" },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, fontSize: 18, fontWeight: "800", color: "#0F172A" },
  badge: { backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#16A34A" },

  description: { fontSize: 14, color: "#64748B", marginTop: 8, lineHeight: 20 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  metaText: { fontSize: 13, color: "#64748B", fontWeight: "500" },

  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 12 },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  productImage: { width: 48, height: 48, borderRadius: 10 },
  productImagePlaceholder: { backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center" },
  productName: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  freeTag: { fontSize: 11, fontWeight: "700", color: "#10B981", marginTop: 2 },
  qtyTag: { fontSize: 11, fontWeight: "600", color: "#64748B", marginTop: 2 },

  categoryName: { fontSize: 15, fontWeight: "600", color: "#1C74E9" },
});
