import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActiveOrders from "@/components/home/ActiveOrders";
import CampusDeals from "@/components/home/CampusDeals";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import HomeHeader from "@/components/home/HomeHeader";
import QuickLinks from "@/components/home/QuickLinks";
import SearchBar from "@/components/home/SearchBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOpenBatches } from "@/store/slices/batchesSlice";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const batches = useAppSelector((state) => state.batches.batches);

  useEffect(() => {
    dispatch(fetchOpenBatches());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar />
        <DeliveryBanner batch={batches[0] ?? null} />
        <QuickLinks />
        <CampusDeals />
        <ActiveOrders />
        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}
