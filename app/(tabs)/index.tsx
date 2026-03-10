import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActiveOrders from "@/components/home/ActiveOrders";
import CampusDeals from "@/components/home/CampusDeals";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import HomeHeader from "@/components/home/HomeHeader";
import QuickLinks from "@/components/home/QuickLinks";
import SearchBar from "@/components/home/SearchBar";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar />
        <DeliveryBanner />
        <QuickLinks />
        <CampusDeals />
        <ActiveOrders />
        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}
