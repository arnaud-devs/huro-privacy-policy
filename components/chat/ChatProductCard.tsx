import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatProductCardProps {
  title: string;
  price: string;
  image: string;
  onViewListing?: () => void;
}

export default function ChatProductCard({
  title,
  price,
  image,
  onViewListing,
}: ChatProductCardProps) {
  return (
    <View className="mx-4 mt-2 mb-4 bg-slate-50 rounded-2xl p-3 flex-row items-center border border-slate-100">
      <View className="flex-1">
        <Text className="text-base font-bold text-slate-900">{title}</Text>
        <Text className="text-xs text-slate-500 mt-1">
          {price} • Negotiable
        </Text>
        <TouchableOpacity onPress={onViewListing} className="mt-2">
          <Text className="text-sm font-semibold text-primary">
            View Listing
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: image }}
        className="w-16 h-24 rounded-xl bg-slate-200 ml-3"
        contentFit="contain"
      />
    </View>
  );
}
