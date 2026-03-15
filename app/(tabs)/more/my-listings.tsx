import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ListingStatus = "ACTIVE" | "PENDING" | "SOLD" | "EXPIRED";

interface Listing {
  id: string;
  title: string;
  price: string;
  status: ListingStatus;
  views: number;
  messages: number;
  listedAgo: string;
}

const ACTIVE_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Used Calculus Textbook",
    price: "15,000 RWF",
    status: "ACTIVE",
    views: 245,
    messages: 12,
    listedAgo: "3d ago",
  },
  {
    id: "2",
    title: "MacBook Air M1...",
    price: "750,000 RWF",
    status: "PENDING",
    views: 1042,
    messages: 34,
    listedAgo: "1w ago",
  },
];

const SOLD_LISTINGS: Listing[] = [
  {
    id: "3",
    title: 'HP Laptop 14"',
    price: "320,000 RWF",
    status: "SOLD",
    views: 560,
    messages: 8,
    listedAgo: "2w ago",
  },
  {
    id: "4",
    title: "Organic Chemistry 9th Ed",
    price: "8,000 RWF",
    status: "EXPIRED",
    views: 90,
    messages: 2,
    listedAgo: "1mo ago",
  },
];

function statusStyle(status: ListingStatus) {
  switch (status) {
    case "ACTIVE":
      return { bg: "#dbeafe", text: "#1C74E9" };
    case "PENDING":
      return { bg: "#fef3c7", text: "#d97706" };
    case "SOLD":
      return { bg: "#dcfce7", text: "#16a34a" };
    case "EXPIRED":
      return { bg: "#f1f5f9", text: "#64748b" };
  }
}

function ListingCard({ item }: { item: Listing }) {
  const s = statusStyle(item.status);
  return (
    <View style={styles.card}>
      <View className="flex-row items-center">
        <View style={styles.thumb}>
          <Ionicons name="image-outline" size={28} color="#cbd5e1" />
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-slate-800 flex-shrink" numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: s.bg }]}>
              <Text style={[styles.badgeText, { color: s.text }]}>
                {item.status}
              </Text>
            </View>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
          <View className="flex-row items-center mt-1 gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="eye-outline" size={13} color="#94a3b8" />
              <Text className="text-xs text-slate-400">{item.views}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="chatbubble-outline" size={12} color="#94a3b8" />
              <Text className="text-xs text-slate-400">{item.messages}</Text>
            </View>
            <Text className="text-xs text-slate-400">Listed {item.listedAgo}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />
      <View className="flex-row items-center">
        <TouchableOpacity style={styles.actionBtn} className="flex-row items-center gap-1">
          <Ionicons name="pencil-outline" size={14} color="#475569" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={[styles.actionBtn, { flex: 1 }]} className="flex-row items-center justify-center gap-1">
          <Ionicons name="checkmark-circle-outline" size={14} color="#1C74E9" />
          <Text style={[styles.actionText, { color: "#1C74E9" }]}>Mark Sold</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyListingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Active" | "Sold/Expired">("Active");
  const listings = activeTab === "Active" ? ACTIVE_LISTINGS : SOLD_LISTINGS;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3 bg-white">
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/more")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">
          My Listings
        </Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="search-outline" size={22} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white border-b border-slate-100">
        {(["Active", "Sold/Expired"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View className="items-center mt-4 mb-2">
            <Ionicons name="archive-outline" size={40} color="#cbd5e1" />
            <Text className="text-sm text-slate-400 mt-2">
              End of {activeTab === "Active" ? "active" : "sold/expired"} listings
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/sell-item")}
      >
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.fabText}>Sell New Item</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#1C74E9",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
  },
  tabTextActive: {
    color: "#1C74E9",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C74E9",
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 10,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  actionDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#e2e8f0",
  },
  iconBtn: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 6,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
