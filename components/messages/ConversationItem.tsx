import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

export type ConversationType = "seller" | "store" | "rider" | "buyer";

export interface Conversation {
  id: string;
  name: string;
  contextLabel: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  type: ConversationType;
  avatar?: string;
}

interface ConversationItemProps {
  item: Conversation;
  onPress: (item: Conversation) => void;
}

const TYPE_LABEL_COLOR: Record<ConversationType, string> = {
  seller: "#1C74E9",
  store: "#64748b",
  rider: "#64748b",
  buyer: "#64748b",
};

export default function ConversationItem({ item, onPress }: ConversationItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="flex-row items-center px-4 py-4"
      style={item.unread ? styles.unreadBg : undefined}
    >
      {/* Avatar */}
      <View className="mr-3">
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar} className="bg-slate-100 items-center justify-center rounded-full">
            <Ionicons name="storefront-outline" size={24} color="#64748b" />
          </View>
        )}
        {item.unread && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-base font-bold text-slate-900">{item.name}</Text>
          <Text
            className="text-xs"
            style={item.unread ? styles.timeUnread : styles.timeRead}
          >
            {item.time}
          </Text>
        </View>

        <Text
          className="text-xs font-bold uppercase tracking-wider mb-1"
          style={{ color: TYPE_LABEL_COLOR[item.type] }}
        >
          {item.contextLabel}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-slate-500 flex-1 mr-2" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    left: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },
  unreadBg: { backgroundColor: "#f0f6ff" },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1C74E9",
  },
  timeUnread: { color: "#1C74E9", fontWeight: "600" },
  timeRead: { color: "#94a3b8" },
});
