import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatInputBarProps {
  onSend: (text: string) => void;
}

export default function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSend(trimmed);
      setText("");
    }
  };

  return (
    <View
      className="flex-row items-center px-4 pt-3 bg-white border-t border-slate-100"
      style={{ paddingBottom: Math.max(insets.bottom, 24) }}
    >
      <TouchableOpacity className="mr-3">
        <Ionicons name="add-circle-outline" size={28} color="#94a3b8" />
      </TouchableOpacity>

      <View className="flex-1 bg-slate-100 rounded-full px-4 py-3 flex-row items-center">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          className="flex-1 text-sm text-slate-900"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
      </View>

      <TouchableOpacity
        onPress={handleSend}
        className="ml-3 w-11 h-11 bg-primary rounded-full items-center justify-center"
      >
        <Ionicons name="send" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}
