import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MarketCategories from "@/components/market/MarketCategories";
import MarketHeader from "@/components/market/MarketHeader";
import MarketSearchBar from "@/components/market/MarketSearchBar";
import MarketSkeleton, { UsedMarketSkeleton } from "@/components/market/MarketSkeleton";
import MarketTabs from "@/components/market/MarketTabs";
import ProductGrid from "@/components/market/ProductGrid";
import UsedMarketCategories from "@/components/market/UsedMarketCategories";
import UsedMarketListings from "@/components/market/UsedMarketListings";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { fetchListings } from "@/store/slices/marketplaceSlice";

export default function MarketScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<"Campus Store" | "Used Market">(
    tab === "Used Market" ? "Used Market" : "Campus Store",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const isCategoriesLoading = useAppSelector((state) => state.categories.isLoading);
  const isProductsLoading = useAppSelector((state) => state.products.isLoading);
  const isListingsLoading = useAppSelector((state) => state.marketplace.isFetching);
  const hasCategories = useAppSelector((state) => state.categories.categories.length > 0);
  const hasProducts = useAppSelector((state) => state.products.products.length > 0);
  const hasListings = useAppSelector((state) => state.marketplace.listings.length > 0);
  const isCampusLoading = (isCategoriesLoading && !hasCategories) || (isProductsLoading && !hasProducts);
  const isUsedLoading = isListingsLoading && !hasListings;

  // All fetches live here — child components are display-only, no re-fetch on remount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ sortBy: "newest" }));
    dispatch(fetchListings({ limit: 20 }));
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ categoryId: selectedCategoryId, sortBy: "newest" }));
  }, [selectedCategoryId]);

  useEffect(() => {
    if (tab === "Used Market" || tab === "Campus Store") {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <MarketHeader />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <MarketSearchBar />
        <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Campus Store" ? (
          isCampusLoading ? <MarketSkeleton /> : (
            <>
              <MarketCategories
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
              <ProductGrid />
            </>
          )
        ) : (
          isUsedLoading ? <UsedMarketSkeleton /> : (
            <>
              <UsedMarketCategories />
              <UsedMarketListings />
            </>
          )
        )}

        <View className="h-6" />
      </ScrollView>

      {activeTab === "Used Market" && (
        <TouchableOpacity
          onPress={() => router.push("/sell-item")}
          className="absolute bottom-6 right-6 bg-primary flex-row items-center px-4 py-3 rounded-full shadow-lg border border-blue-400"
          style={{
            shadowColor: "#1C74E9",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Sell Item</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
