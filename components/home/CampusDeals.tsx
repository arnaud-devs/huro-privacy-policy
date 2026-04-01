import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "@/store/hooks";
import { type Promotion } from "@/store/slices/promotionsSlice";

function formatDiscount(promo: Promotion): string {
  if (promo.discountType === "PERCENTAGE") return `${promo.discountValue}% OFF`;
  if (promo.discountType === "FIXED") return `${Number(promo.discountValue).toLocaleString()} RWF OFF`;
  return "Special Deal";
}

function PromoCard({ promo }: { promo: Promotion }) {
  const router = useRouter();
  const [imgFailed, setImgFailed] = useState(false);

  const imageUri =
    !imgFailed && promo.bannerUrl
      ? promo.bannerUrl
      : promo.products[0]?.product?.imageUrls?.[0] ?? null;

  const showPlaceholder = !imageUri || imgFailed;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/promotion-details" as any, params: { id: promo.id } })
      }
      className="w-[200px] bg-white rounded-2xl overflow-hidden border border-slate-200"
    >
      {showPlaceholder ? (
        <View className="w-full h-[120px] bg-blue-50 items-center justify-center px-3">
          <Text className="text-primary text-xl font-bold text-center">
            {formatDiscount(promo)}
          </Text>
          {promo.category && (
            <Text className="text-slate-500 text-xs mt-1">{promo.category.name}</Text>
          )}
        </View>
      ) : (
        <Image
          source={{ uri: imageUri! }}
          className="w-full h-[120px] bg-slate-200"
          contentFit="cover"
          onError={() => setImgFailed(true)}
        />
      )}

      <View className="p-3">
        <Text className="text-sm font-bold text-slate-900 mb-1" numberOfLines={1}>
          {promo.title}
        </Text>
        {promo.description ? (
          <Text className="text-xs text-slate-500 mb-2" numberOfLines={1}>
            {promo.description}
          </Text>
        ) : null}
        <View className="bg-blue-100 self-start px-2 py-1 rounded">
          <Text className="text-primary text-xs font-bold">{formatDiscount(promo)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CampusDeals() {
  const { activePromotions, isFetching } = useAppSelector((state) => state.promotions);

  if (isFetching) {
    return (
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-900 mb-4">Campus Deals</Text>
        <ActivityIndicator color="#1C74E9" />
      </View>
    );
  }

  if (activePromotions.length === 0) return null;

  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">Campus Deals</Text>
        <View className="bg-blue-100 px-2 py-1 rounded">
          <Text className="text-primary text-xxs font-bold">LIMITED TIME</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingRight: 16 }}
        className="mb-8"
      >
        {activePromotions.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </ScrollView>
    </>
  );
}
