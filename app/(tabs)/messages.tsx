import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ConversationItem, { Conversation } from "@/components/messages/ConversationItem";

type Filter = "All" | "Unread";

const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Alice (Seller)",
    contextLabel: "JBL Speaker Listing",
    lastMessage: "Is the item still available?",
    time: "2 min ago",
    unread: true,
    type: "seller",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "Campus Store",
    contextLabel: "Snack Pack Order",
    lastMessage: "Your order is being prepared.",
    time: "10 min ago",
    unread: false,
    type: "store",
  },
  {
    id: "3",
    name: "Rider Jean",
    contextLabel: "Delivery Order #1023",
    lastMessage: "I am near the main gate.",
    time: "25 min ago",
    unread: false,
    type: "rider",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "4",
    name: "Mike S.",
    contextLabel: "Dorm Desk Lamp",
    lastMessage: "Can you do $10 for it?",
    time: "2 hours ago",
    unread: false,
    type: "buyer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function MessagesScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const router = useRouter();

  const displayed =
    filter === "Unread" ? CONVERSATIONS.filter((c) => c.unread) : CONVERSATIONS;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-slate-900 text-center">Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Filter pills */}
      <View className="flex-row px-4 pt-4 pb-2 gap-3">
        {(["All", "Unread"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className="px-5 py-2 rounded-full"
            style={filter === f ? styles.pillActive : styles.pillInactive}
          >
            <Text
              className="text-sm font-semibold"
              style={filter === f ? styles.pillTextActive : styles.pillTextInactive}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conversation list */}
      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            <ConversationItem
              item={item}
              onPress={(conv) =>
                router.push({ pathname: "/chat", params: { productId: conv.id } })
              }
            />
            {index < displayed.length - 1 && (
              <View className="h-px bg-slate-100 mx-4" />
            )}
          </>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pillActive: { backgroundColor: "#1C74E9" },
  pillInactive: { backgroundColor: "#f1f5f9" },
  pillTextActive: { color: "#ffffff" },
  pillTextInactive: { color: "#64748b" },
});
