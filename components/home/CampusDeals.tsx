import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "@/store/hooks";
import { type Promotion } from "@/store/slices/promotionsSlice";

function formatDiscount(promo: Promotion): string {
  if (promo.discountType === "PERCENTAGE") return `${promo.discountValue}% OFF`;
  if (promo.discountType === "FIXED") return `${promo.discountValue.toLocaleString()} RWF OFF`;
  return promo.type === "BOGO" ? "Buy 1 Get 1" : "Special Deal";
}

export default function CampusDeals() {
  const router = useRouter();
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
        {activePromotions.map((promo) => {
          const image =
            promo.bannerUrl ||
            promo.products[0]?.product?.imageUrls?.[0] ||
            null;

          return (
            <TouchableOpacity
              key={promo.id}
              onPress={() =>
                router.push({
                  pathname: "/promotion-details",
                  params: { id: promo.id },
                })
              }
              className="w-[200px] bg-white rounded-2xl overflow-hidden border border-slate-200"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-full h-[120px] bg-slate-200"
                  contentFit="cover"
                />
              ) : (
                <View className="w-full h-[120px] bg-blue-50 items-center justify-center">
                  <Text className="text-primary text-2xl font-bold">
                    {formatDiscount(promo)}
                  </Text>
                </View>
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
                  <Text className="text-primary text-xs font-bold">
                    {formatDiscount(promo)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
