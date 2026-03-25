import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartIconButton from "@/components/common/CartIconButton";
import ConversationItem, { Conversation } from "@/components/messages/ConversationItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchConversations, ApiConversation } from "@/store/slices/messagingSlice";

type Filter = "All" | "Unread";

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function toConversation(c: ApiConversation): Conversation {
  return {
    id: c.id,
    name: c.otherParticipant?.fullName ?? "Unknown",
    contextLabel: c.listing?.title ?? "Marketplace",
    lastMessage: c.lastMessage?.content ?? "",
    time: timeAgo(c.lastMessage?.createdAt ?? c.updatedAt),
    unread: (c.unreadCount ?? 0) > 0,
    type: "seller",
    avatar: c.otherParticipant?.avatarUrl,
  };
}

export default function MessagesScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { conversations, isFetching, fetchError } = useAppSelector((s) => s.messaging);

  useEffect(() => {
    dispatch(fetchConversations({ limit: 20 }));
  }, [dispatch]);

  const mapped = conversations.map(toConversation);
  const displayed = filter === "Unread" ? mapped.filter((c) => c.unread) : mapped;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <Text className="flex-1 text-xl font-bold text-slate-900">Messages</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color="#0f172a" />
          </TouchableOpacity>
          <CartIconButton />
          <TouchableOpacity onPress={() => dispatch(fetchConversations({ limit: 20 }))} style={{ position: "relative" }}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            {mapped.some((c) => c.unread) && <View style={styles.dotBadge} />}
          </TouchableOpacity>
        </View>
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

      {isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      ) : fetchError ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-slate-500 text-sm mb-4 text-center">{fetchError}</Text>
          <TouchableOpacity
            className="bg-primary px-6 py-2 rounded-xl"
            onPress={() => dispatch(fetchConversations({ limit: 20 }))}
          >
            <Text className="text-white font-semibold text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <>
              <ConversationItem
                item={item}
                onPress={(conv) =>
                  router.push({ pathname: "/chat", params: { conversationId: conv.id } })
                }
              />
              {index < displayed.length - 1 && <View className="h-px bg-slate-100 mx-4" />}
            </>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
              <Text className="text-sm text-slate-400 mt-3">No conversations yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pillActive: { backgroundColor: "#1C74E9" },
  pillInactive: { backgroundColor: "#f1f5f9" },
  pillTextActive: { color: "#ffffff" },
  pillTextInactive: { color: "#64748b" },
  dotBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
});
