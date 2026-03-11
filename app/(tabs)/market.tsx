import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MarketCategories from "@/components/market/MarketCategories";
import MarketHeader from "@/components/market/MarketHeader";
import MarketSearchBar from "@/components/market/MarketSearchBar";
import MarketTabs from "@/components/market/MarketTabs";
import ProductGrid from "@/components/market/ProductGrid";
import UsedMarketCategories from "@/components/market/UsedMarketCategories";
import UsedMarketListings from "@/components/market/UsedMarketListings";

export default function MarketScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Campus Store" | "Used Market">(
    "Campus Store",
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <MarketHeader />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <MarketSearchBar />
        <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "Campus Store" ? (
          <>
            <MarketCategories />
            <ProductGrid />
          </>
        ) : (
          <>
            <UsedMarketCategories />
            <UsedMarketListings />
          </>
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
