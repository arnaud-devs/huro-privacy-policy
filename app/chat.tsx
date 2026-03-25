import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatBubble, { Message } from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, clearMessages, appendMessage, sendMessage, ApiMessage } from "@/store/slices/messagingSlice";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toMessage(msg: ApiMessage, currentUserId: string, otherAvatarUrl?: string): Message {
  const isMe = msg.senderId === currentUserId;
  return {
    id: msg.id,
    text: msg.content,
    time: formatTime(msg.createdAt),
    isMe,
    avatar: isMe ? undefined : (msg.sender?.avatarUrl ?? otherAvatarUrl),
    read: msg.isRead,
  };
}

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView>(null);

  const currentUserId = useAppSelector((s) => (s.user as any).user?.id ?? "");
  const { messages, isFetchingMessages, messagesError } = useAppSelector((s) => s.messaging);
  const conversation = useAppSelector((s) =>
    s.messaging.conversations.find((c) => c.id === conversationId)
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages({ conversationId, limit: 30 }));
    }
    return () => { dispatch(clearMessages()); };
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [messages.length]);

  const otherName = conversation?.otherParticipant?.fullName ?? "Chat";
  const listingTitle = conversation?.listing?.title;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-slate-900">{otherName}</Text>
          {listingTitle && (
            <Text className="text-xs text-slate-400" numberOfLines={1}>{listingTitle}</Text>
          )}
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
      >
        {isFetchingMessages ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1C74E9" />
          </View>
        ) : messagesError ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-slate-500 text-sm mb-4 text-center">{messagesError}</Text>
            <TouchableOpacity
              className="bg-primary px-6 py-2 rounded-xl"
              onPress={() => conversationId && dispatch(fetchMessages({ conversationId, limit: 30 }))}
            >
              <Text className="text-white font-semibold text-sm">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
          >
            {messages.length === 0 ? (
              <View className="items-center mt-16 px-8">
                <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
                <Text className="text-slate-400 text-sm mt-3 text-center">
                  No messages yet. Say hello!
                </Text>
              </View>
            ) : (
              messages.map((msg) => (
                <ChatBubble key={msg.id} message={toMessage(msg, currentUserId, conversation?.otherParticipant?.avatarUrl)} />
              ))
            )}
            <View className="h-4" />
          </ScrollView>
        )}

        <ChatInputBar onSend={(text) => {
          if (!conversationId) return;
          const tempId = `temp-${Date.now()}`;
          dispatch(appendMessage({
            id: tempId,
            content: text,
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
            isRead: false,
          }));
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
          dispatch(sendMessage({ conversationId, content: text, tempId }));
        }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
