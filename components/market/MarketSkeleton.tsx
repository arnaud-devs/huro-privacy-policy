import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function useShimmer() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return opacity;
}

function Bone({ width, height, radius = 10, style }: { width: number | string; height: number; radius?: number; style?: any }) {
  const opacity = useShimmer();
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: "#e2e8f0", opacity }, style]}
    />
  );
}

function CategoryItemSkeleton() {
  return (
    <View style={{ width: "30%", alignItems: "center", marginBottom: 20 }}>
      <Bone width={64} height={64} radius={24} />
      <Bone width={44} height={10} radius={6} style={{ marginTop: 8 }} />
    </View>
  );
}

function CategoryPillSkeleton({ width }: { width: number }) {
  return <Bone width={width} height={36} radius={20} style={{ marginRight: 8 }} />;
}

function ListingCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        overflow: "hidden",
      }}
    >
      <Bone width="100%" height={208} radius={0} />
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Bone width="55%" height={14} radius={7} />
          <Bone width="22%" height={14} radius={7} />
        </View>
        <Bone width="45%" height={11} radius={6} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Bone width="78%" height={44} radius={12} />
          <Bone width={44} height={44} radius={12} />
        </View>
      </View>
    </View>
  );
}

function ProductCardSkeleton() {
  return (
    <View
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
      }}
    >
      <Bone width="100%" height={140} radius={16} />
      <Bone width="75%" height={12} radius={6} style={{ marginTop: 12, marginLeft: 4 }} />
      <Bone width="45%" height={12} radius={6} style={{ marginTop: 8, marginLeft: 4 }} />
      <Bone width="100%" height={36} radius={12} style={{ marginTop: 10 }} />
    </View>
  );
}

export function UsedMarketSkeleton() {
  return (
    <View style={{ flex: 1, paddingBottom: 24 }}>
      {/* Category pills */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingVertical: 10 }}>
        {[80, 100, 70, 80, 65].map((w, i) => (
          <CategoryPillSkeleton key={i} width={w} />
        ))}
      </View>

      {/* Section title */}
      <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 16 }}>
        <Bone width={150} height={14} radius={7} />
      </View>

      {/* Listing cards */}
      <View style={{ paddingHorizontal: 16 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}

export default function MarketSkeleton() {
  return (
    <View style={{ flex: 1, paddingBottom: 24 }}>
      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <Bone width="100%" height={44} radius={14} />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 16 }}>
        <Bone width={120} height={36} radius={20} />
        <Bone width={120} height={36} radius={20} />
      </View>

      {/* Category chips */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 4 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CategoryItemSkeleton key={i} />
        ))}
      </View>

      {/* Section title */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 }}>
        <Bone width={130} height={14} radius={7} />
        <Bone width={50} height={12} radius={6} />
      </View>

      {/* Product grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}
