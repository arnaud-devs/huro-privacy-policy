import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface AuthHeaderProps {
  title: string;
}

export default function AuthHeader({ title }: AuthHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text className="text-base font-bold text-slate-900">{title}</Text>
      <View className="w-10" />
    </View>
  );
}
