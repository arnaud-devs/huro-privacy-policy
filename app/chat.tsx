import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatBubble, { Message } from "@/components/chat/ChatBubble";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatProductCard from "@/components/chat/ChatProductCard";

const BUYER_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
const SELLER_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";

const CONVERSATIONS: Record<
  string,
  {
    sellerName: string;
    product: { title: string; price: string; image: string };
    messages: Message[];
    offerAmount?: string;
  }
> = {
  "1": {
    sellerName: "John",
    product: {
      title: "Bluetooth Speaker",
      price: "RWF 4,500",
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    },
    messages: [
      {
        id: "1",
        text: "Hi Alex, is the Bluetooth speaker still available?",
        time: "10:42 AM",
        isMe: false,
        avatar: BUYER_AVATAR,
      },
      {
        id: "2",
        text: "Yes, it is! Are you interested?",
        time: "10:45 AM",
        isMe: true,
        avatar: SELLER_AVATAR,
        read: true,
      },
      {
        id: "3",
        text: "Would you take $35 for it? I can pick it up today on campus after my lecture at 4 PM.",
        time: "10:48 AM",
        isMe: false,
        avatar: BUYER_AVATAR,
      },
    ],
    offerAmount: "$35",
  },
  "2": {
    sellerName: "Sarah",
    product: {
      title: "Nike Shoes",
      price: "RWF 15,000",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    messages: [
      {
        id: "1",
        text: "Hi, are the Nike shoes still available?",
        time: "2:10 PM",
        isMe: true,
        avatar: SELLER_AVATAR,
        read: true,
      },
      {
        id: "2",
        text: "Yes they are! Size 42, barely worn.",
        time: "2:15 PM",
        isMe: false,
        avatar: BUYER_AVATAR,
      },
    ],
  },
  "3": {
    sellerName: "David",
    product: {
      title: "Organic Chemistry Set",
      price: "RWF 5,000",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
    },
    messages: [
      {
        id: "1",
        text: "Is the chemistry set complete?",
        time: "9:00 AM",
        isMe: true,
        avatar: SELLER_AVATAR,
        read: true,
      },
      {
        id: "2",
        text: "Yes, textbook and lab manual both included!",
        time: "9:05 AM",
        isMe: false,
        avatar: BUYER_AVATAR,
      },
    ],
  },
};

export default function ChatScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const conversation = CONVERSATIONS[productId ?? "1"];

  if (!conversation) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-base text-slate-500">Conversation not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-slate-900">
            {conversation.sellerName} (Verified Student)
          </Text>
          <Text className="text-xs font-bold" style={{ color: "#22c55e" }}>ONLINE</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Product Card */}
          <ChatProductCard
            title={conversation.product.title}
            price={conversation.product.price}
            image={conversation.product.image}
            onViewListing={() =>
              router.push({
                pathname: "/product-details",
                params: { id: productId },
              })
            }
            onMakeOffer={() => {}}
          />

          {/* Date separator */}
          <View className="items-center my-3">
            <Text className="text-xxs text-slate-400 font-semibold uppercase tracking-wider">
              Today
            </Text>
          </View>

          {/* Chat messages */}
          {conversation.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* Offer notification */}
          {conversation.offerAmount && (
            <View className="items-center my-4">
              <View className="border border-primary rounded-full px-5 py-2">
                <Text className="text-sm font-semibold text-primary">
                  Offer received: {conversation.offerAmount}.00
                </Text>
              </View>
            </View>
          )}

          <View className="h-4" />
        </ScrollView>

        {/* Input + Quick Actions */}
        <ChatInputBar onSend={() => {}} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
