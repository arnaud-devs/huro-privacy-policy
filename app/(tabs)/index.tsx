import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActiveOrders from "@/components/home/ActiveOrders";
import CampusDeals from "@/components/home/CampusDeals";
import DeliveryBanner from "@/components/home/DeliveryBanner";
import HomeHeader from "@/components/home/HomeHeader";
import QuickLinks from "@/components/home/QuickLinks";
import SearchBar from "@/components/home/SearchBar";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar />
        <DeliveryBanner />
        <QuickLinks />
        <CampusDeals />
        <ActiveOrders />

        {/* Space for bottom tab bar padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 16,
  },
});
