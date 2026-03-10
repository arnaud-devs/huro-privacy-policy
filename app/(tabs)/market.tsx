import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MarketHeader from "@/components/market/MarketHeader";
import MarketSearchBar from "@/components/market/MarketSearchBar";
import MarketTabs from "@/components/market/MarketTabs";
import MarketCategories from "@/components/market/MarketCategories";
import ProductGrid from "@/components/market/ProductGrid";

export default function MarketScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <MarketHeader />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <MarketSearchBar />
        <MarketTabs />
        <MarketCategories />
        <ProductGrid />
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
