import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

export interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar?: string;
  read?: boolean;
  isOffer?: boolean;
  offerAmount?: number | null;
  offerAction?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
}

interface ChatBubbleProps {
  message: Message;
  onAcceptOffer?: (messageId: string) => void;
  onRejectOffer?: (messageId: string) => void;
}

function OfferBadge({ amount, action }: { amount?: number | null; action?: string | null }) {
  const statusColor = action === 'ACCEPTED' ? '#16a34a' : action === 'REJECTED' ? '#ef4444' : '#d97706';
  const statusLabel = action === 'ACCEPTED' ? 'Accepted' : action === 'REJECTED' ? 'Rejected' : 'Pending';
  return (
    <View style={{ marginTop: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 8 }}>
      <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>OFFER</Text>
      <Text style={{ fontSize: 16, fontWeight: '700', color: 'white' }}>
        {amount != null ? `${amount.toLocaleString()} RWF` : '—'}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor, marginRight: 4 }} />
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{statusLabel}</Text>
      </View>
    </View>
  );
}

export default function ChatBubble({ message, onAcceptOffer, onRejectOffer }: ChatBubbleProps) {
  if (message.isMe) {
    return (
      <View className="flex-row justify-end mb-3 px-4">
        <View className="max-w-[75%]">
          <View className="bg-primary rounded-2xl rounded-br-sm px-4 py-3">
            <Text className="text-sm text-white leading-5">{message.text}</Text>
            {message.isOffer && <OfferBadge amount={message.offerAmount} action={message.offerAction} />}
          </View>
          <View className="flex-row items-center justify-end mt-1 mr-1">
            <Text className="text-xxs text-slate-400">{message.time}</Text>
            {message.read && (
              <View className="ml-1">
                <Text className="text-xxs text-primary">✓✓</Text>
              </View>
            )}
          </View>
        </View>
        {message.avatar && (
          <Image
            source={{ uri: message.avatar }}
            className="w-7 h-7 rounded-full ml-2 mt-1 bg-slate-200"
            contentFit="cover"
          />
        )}
      </View>
    );
  }

  return (
    <View className="flex-row justify-start mb-3 px-4">
      {message.avatar && (
        <Image
          source={{ uri: message.avatar }}
          className="w-7 h-7 rounded-full mr-2 mt-1 bg-slate-200"
          contentFit="cover"
        />
      )}
      <View className="max-w-[75%]">
        <View className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
          <Text className="text-sm text-slate-900 leading-5">{message.text}</Text>
          {message.isOffer && (
            <View style={{ marginTop: 6, backgroundColor: '#f0f7ff', borderRadius: 8, padding: 8 }}>
              <Text style={{ fontSize: 11, color: '#1C74E9', marginBottom: 2 }}>OFFER</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>
                {message.offerAmount != null ? `${message.offerAmount.toLocaleString()} RWF` : '—'}
              </Text>
              {message.offerAction === 'PENDING' ? (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => onRejectOffer?.(message.id)}
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, paddingVertical: 6, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#ef4444' }}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onAcceptOffer?.(message.id)}
                    style={{ flex: 1, backgroundColor: '#16a34a', borderRadius: 8, paddingVertical: 6, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={{ fontSize: 11, color: message.offerAction === 'ACCEPTED' ? '#16a34a' : '#ef4444', marginTop: 4, fontWeight: '600' }}>
                  {message.offerAction === 'ACCEPTED' ? '✓ Accepted' : '✗ Rejected'}
                </Text>
              )}
            </View>
          )}
        </View>
        <Text className="text-xxs text-slate-400 mt-1 ml-1">{message.time}</Text>
      </View>
    </View>
  );
}
