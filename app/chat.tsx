import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatBubble, { Message } from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatProductCard from "@/components/chat/ChatProductCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appendMessage, clearMessages, fetchMessages, sendMessage, respondToOffer, markConversationRead, ApiMessage } from "@/store/slices/messagingSlice";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
    isOffer: msg.isOffer,
    offerAmount: msg.offerAmount,
    offerAction: msg.offerAction,
  };
}

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  const currentUserId = useAppSelector((s) => (s.user as any).user?.id ?? "");
  const { messages, isFetchingMessages, messagesError } = useAppSelector((s) => s.messaging);
  const conversation = useAppSelector((s) =>
    s.messaging.conversations.find((c) => c.id === conversationId)
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages({ conversationId, limit: 30 }));
      dispatch(markConversationRead({ conversationId }));
    }
    return () => { dispatch(clearMessages()); };
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [messages.length]);

  function handleSend(text: string) {
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
  }

  async function handleRespondToOffer(messageId: string, action: 'ACCEPTED' | 'REJECTED') {
    if (!conversationId) return;
    const result = await dispatch(respondToOffer({ conversationId, messageId, action }));
    if (respondToOffer.rejected.match(result)) {
      console.log('respondToOffer error:', result.payload);
      Alert.alert('Error', result.payload as string || 'Failed to respond to offer');
    } else {
      console.log('respondToOffer success:', result.payload);
    }
  }

  function handleSendOffer() {
    const amount = parseFloat(offerAmount);
    if (!offerAmount || isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid offer amount.");
      return;
    }
    if (!conversationId) return;
    const tempId = `temp-offer-${Date.now()}`;
    const content = `I'd like to offer ${amount.toLocaleString()} RWF`;
    dispatch(appendMessage({
      id: tempId,
      content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isRead: false,
      isOffer: true,
      offerAmount: amount,
      offerAction: 'PENDING',
    }));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    dispatch(sendMessage({ conversationId, content, tempId, isOffer: true, offerAmount: amount }));
    setOfferAmount("");
    setOfferModalVisible(false);
  }

  const otherName = conversation?.otherParticipant?.fullName ?? "Chat";
  const listing = conversation?.listing;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-slate-900">{otherName}</Text>
          {listing?.title && (
            <Text className="text-xs text-slate-400" numberOfLines={1}>{listing.title}</Text>
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
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {/* Product Card */}
            {listing && (
              <ChatProductCard
                title={listing.title ?? "Listing"}
                price=""
                image={listing.images?.[0] ?? ""}
                onViewListing={() => router.push({ pathname: "/product-details", params: { id: listing.id } })}
                onMakeOffer={() => setOfferModalVisible(true)}
              />
            )}

            {/* Messages */}
            {messages.length === 0 ? (
              <View className="items-center mt-16 px-8">
                <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
                <Text className="text-slate-400 text-sm mt-3 text-center">No messages yet. Say hello!</Text>
              </View>
            ) : (
              messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={toMessage(msg, currentUserId, conversation?.otherParticipant?.avatarUrl)}
                  onAcceptOffer={(id) => handleRespondToOffer(id, 'ACCEPTED')}
                  onRejectOffer={(id) => handleRespondToOffer(id, 'REJECTED')}
                />
              ))
            )}
            <View className="h-4" />
          </ScrollView>
        )}

        <ChatInputBar onSend={handleSend} />
      </KeyboardAvoidingView>

      {/* Offer Modal */}
      <Modal
        visible={offerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOfferModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOfferModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Make an Offer</Text>
          <Text style={styles.modalSubtitle}>Enter the amount you'd like to offer in RWF</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>RWF</Text>
            <TextInput
              style={styles.input}
              value={offerAmount}
              onChangeText={setOfferAmount}
              placeholder="0"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              autoFocus
            />
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendOffer}>
            <Text style={styles.sendBtnText}>Send Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setOfferModalVisible(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#cbd5e1", alignSelf: "center", marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#0f172a", marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: "#64748b", marginBottom: 24 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 16,
    paddingHorizontal: 16, height: 58, marginBottom: 16,
  },
  currency: { fontSize: 16, fontWeight: "700", color: "#1C74E9", marginRight: 8 },
  input: { flex: 1, fontSize: 20, fontWeight: "600", color: "#0f172a" },
  sendBtn: {
    backgroundColor: "#1C74E9", borderRadius: 16,
    height: 54, alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  sendBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  cancelBtn: { alignItems: "center", paddingVertical: 8 },
  cancelBtnText: { fontSize: 15, color: "#94a3b8", fontWeight: "500" },
});
