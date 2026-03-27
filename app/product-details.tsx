import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductSellerCard from "@/components/product/ProductSellerCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchListingById } from "@/store/slices/marketplaceSlice";
import { startConversation } from "@/store/slices/messagingSlice";

const CONDITION_LABELS: Record<string, string> = {
  LIKE_NEW: "Like New",
  GOOD: "Good Condition",
  FAIR: "Fair Condition",
  FOR_PARTS: "For Parts",
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedListing, isFetchingDetail, detailError } = useAppSelector(
    (state) => state.marketplace
  );
  const { isStarting } = useAppSelector((state) => state.messaging);

  async function handleGetInTouch() {
    if (!id) return;
    const result = await dispatch(startConversation({ listingId: id, message: "Hi, is this still available?" }));
    if (startConversation.fulfilled.match(result)) {
      router.push({ pathname: "/chat", params: { conversationId: result.payload.id } });
    } else {
      const msg = result.payload as string ?? "";
      if (msg.toLowerCase().includes("profile incomplete") || msg.toLowerCase().includes("full name")) {
        router.push({ pathname: "/profile-setup", params: { returnListingId: id } });
      } else {
        Alert.alert("Error", msg || "Could not start conversation");
      }
    }
  }

  useEffect(() => {
    if (id) dispatch(fetchListingById(id));
  }, [id, dispatch]);

  const formatPrice = (price: number | string) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return `${(num / 1000).toFixed(0)},000 RWF`;
  };

  if (isFetchingDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1C74E9" />
      </SafeAreaView>
    );
  }

  if (detailError || !selectedListing) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-4">
        <Text className="text-slate-500 text-sm mb-4 text-center">
          {detailError ?? "Listing not found"}
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-2 rounded-xl"
          onPress={() => id && dispatch(fetchListingById(id))}
        >
          <Text className="text-white font-semibold text-sm">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const listing = selectedListing;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Product Details</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image Gallery */}
        <ProductImageGallery images={listing.images ?? []} />

        {/* Condition Badge */}
        <View className="px-4 mt-4">
          <Text className="text-xs font-bold text-primary uppercase tracking-wider">
            {CONDITION_LABELS[listing.condition] ?? listing.condition}
          </Text>
        </View>

        {/* Title & Price */}
        <View className="px-4 mt-2">
          <Text className="text-xl font-bold text-slate-900">{listing.title}</Text>
          <View className="flex-row items-center mt-1 gap-3">
            <Text className="text-lg font-bold text-primary">
              {formatPrice(listing.askingPrice)}
            </Text>
            {listing.isNegotiable && (
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-green-700">Negotiable</Text>
              </View>
            )}
          </View>
        </View>

        {/* Seller Card */}
        {listing.seller && (
          <ProductSellerCard
            name={listing.seller.fullName ?? "Unknown"}
            memberSince={new Date(listing.seller.createdAt ?? listing.createdAt).getFullYear().toString()}
            rating={0}
          />
        )}

        {/* Description */}
        {listing.description ? (
          <View className="mx-4 mt-6">
            <Text className="text-lg font-bold text-slate-900 mb-2">Description</Text>
            <Text className="text-sm text-slate-600 leading-6">{listing.description}</Text>
          </View>
        ) : null}

        {/* Details */}
        <View className="mx-4 mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-bold text-slate-900 mb-3">Details</Text>
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-sm text-slate-500">Condition</Text>
            <Text className="text-sm font-semibold text-slate-800">
              {CONDITION_LABELS[listing.condition] ?? listing.condition}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-sm text-slate-500">Views</Text>
            <Text className="text-sm font-semibold text-slate-800">{listing.viewCount}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-sm text-slate-500">Listed</Text>
            <Text className="text-sm font-semibold text-slate-800">
              {new Date(listing.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 pb-8">
        <TouchableOpacity
          className="bg-primary flex-row items-center justify-center py-4 rounded-2xl"
          onPress={handleGetInTouch}
          disabled={isStarting}
        >
          {isStarting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="chatbubble-outline" size={18} color="white" />
              <Text className="text-white font-bold text-base ml-2">Get in Touch</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
