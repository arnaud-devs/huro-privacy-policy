import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchListings, Listing } from '@/store/slices/marketplaceSlice';

export default function UsedMarketListings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { listings, isFetching, fetchError } = useAppSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchListings({ limit: 20 }));
  }, [dispatch]);

  const getSellerName = (listing: Listing) => listing.seller?.fullName ?? 'Unknown';

  const getImageUri = (listing: Listing): string | null => listing.images?.[0] ?? null;

  const formatPrice = (price: number) => `${(price / 1000).toFixed(0)}k RWF`;

  if (isFetching) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#1C74E9" />
      </View>
    );
  }

  if (fetchError) {
    return (
      <View className="px-4 mt-4 items-center">
        <Text className="text-slate-500 text-sm mb-3">{fetchError}</Text>
        <TouchableOpacity
          className="bg-primary px-6 py-2 rounded-xl"
          onPress={() => dispatch(fetchListings({ limit: 20 }))}
        >
          <Text className="text-white font-semibold text-sm">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View className="px-4 mt-4 items-center py-16">
        <Text className="text-slate-500 text-sm">No listings available yet.</Text>
      </View>
    );
  }

  return (
    <View className="px-4 mt-4 mb-20">
      <Text className="text-xl font-bold text-slate-900 mb-4">Student Listings</Text>

      {(listings ?? []).map((item) => (
        <View key={item.id} className="bg-white rounded-3xl mb-4 border border-slate-100 shadow-sm overflow-hidden">
          {getImageUri(item) ? (
            <Image
              source={{ uri: getImageUri(item)! }}
              className="w-full h-52 bg-slate-100"
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-52 bg-slate-100 items-center justify-center">
              <Ionicons name="image-outline" size={40} color="#94A3B8" />
            </View>
          )}

          <View className="p-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-bold text-slate-900 flex-1" numberOfLines={1}>{item.title}</Text>
              <Text className="text-base font-bold text-primary ml-2">{formatPrice(item.askingPrice)}</Text>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-5 h-5 bg-blue-100 rounded-full items-center justify-center mr-2">
                <Ionicons name="person" size={12} color="#1C74E9" />
              </View>
              <Text className="text-sm text-slate-500">Seller: {getSellerName(item)}</Text>
            </View>

            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-3 justify-center items-center"
                onPress={() => router.push({ pathname: '/product-details', params: { id: item.id } })}
              >
                <Text className="text-white font-semibold text-sm">View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 border border-slate-200 rounded-xl justify-center items-center">
                <Ionicons name="heart-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
