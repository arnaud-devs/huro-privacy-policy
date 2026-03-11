import { View, Text } from "react-native";
import { Image } from "expo-image";

export interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar?: string;
  read?: boolean;
}

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  if (message.isMe) {
    return (
      <View className="flex-row justify-end mb-3 px-4">
        <View className="max-w-[75%]">
          <View className="bg-primary rounded-2xl rounded-br-sm px-4 py-3">
            <Text className="text-sm text-white leading-5">{message.text}</Text>
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
        </View>
        <Text className="text-xxs text-slate-400 mt-1 ml-1">{message.time}</Text>
      </View>
    </View>
  );
}
