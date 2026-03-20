import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";

interface Props {
  categoryId?: string;
}

export default function ProductGrid({ categoryId }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, isLoading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ categoryId, sortBy: "newest" }));
  }, [dispatch, categoryId]);

  if (isLoading) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator size="small" color="#1C74E9" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-6 px-4 items-center">
        <Text className="text-sm text-red-500">{error}</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="py-10 items-center px-4">
        <Text className="text-sm text-slate-400">No products found.</Text>
      </View>
    );
  }

  return (
    <View className="px-4 mt-2 mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">Nearby Shops</Text>
        <TouchableOpacity onPress={() => dispatch(fetchProducts({ sortBy: "newest" }))}>
          <Text className="text-primary font-bold text-sm">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {products.map((product) => {
          const basePrice = parseFloat(product.price);
          const displayPrice = product.promotionPrice ?? basePrice;

          return (
            <View
              key={product.id}
              className="w-[48%] bg-white rounded-[20px] p-2 mb-4 border border-slate-100 shadow-sm"
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/campus-product-details",
                    params: { id: product.id },
                  })
                }
              >
                <View className="relative">
                  <Image
                    source={{ uri: product.imageUrls?.[0] }}
                    className="w-full h-[140px] rounded-2xl bg-slate-100"
                    contentFit="cover"
                  />
                  {product.promotionPrice && (
                    <View className="absolute top-2 left-2 bg-amber-100 rounded-lg px-2 py-0.5">
                      <Text className="text-xs font-bold text-amber-600">Sale</Text>
                    </View>
                  )}
                  <TouchableOpacity className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full items-center justify-center">
                    <Ionicons name="heart-outline" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <View className="mt-3 mb-2 px-1">
                  <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-primary font-extrabold text-base mt-1">
                      RWF {displayPrice.toLocaleString()}
                    </Text>
                    {product.promotionPrice && product.originalPrice && (
                      <Text className="text-slate-400 text-xs mt-1 line-through">
                        RWF {product.originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="bg-primary flex-row items-center justify-center py-2.5 rounded-xl mt-auto">
                <Ionicons name="cart-outline" size={16} color="white" />
                <Text className="text-white font-bold text-xs ml-1.5">Add to cart</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
