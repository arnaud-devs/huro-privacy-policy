import { Image } from "expo-image";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface ChatProductCardProps {
  title: string;
  price: string;
  image: string;
  onViewListing?: () => void;
  onMakeOffer?: () => void;
}

export default function ChatProductCard({
  title,
  price,
  image,
  onViewListing,
  onMakeOffer,
}: ChatProductCardProps) {
  return (
    <View className="mx-4 mt-3 mb-2 bg-white rounded-3xl border border-slate-100 overflow-hidden">
      {/* Top row: image + info + view item */}
      <View className="flex-row items-center p-4">
        <Image
          source={{ uri: image }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <View className="flex-1 mx-3">
          <Text className="text-base font-bold text-slate-900">{title}</Text>
          <Text className="text-sm font-bold text-primary mt-0.5">{price}</Text>
        </View>
        <TouchableOpacity
          onPress={onViewListing}
          className="bg-slate-100 rounded-full px-4 py-2"
        >
          <Text className="text-sm font-semibold text-slate-700">View Item</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="h-px bg-slate-100 mx-4" />

      {/* Action buttons */}
      <View className="flex-row gap-3 px-4 py-4">
        <TouchableOpacity
          onPress={onViewListing}
          className="flex-1 bg-slate-100 rounded-full py-3 items-center"
        >
          <Text className="text-sm font-bold text-slate-800">View Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMakeOffer}
          className="flex-1 bg-primary rounded-full py-3 items-center"
        >
          <Text className="text-sm font-bold text-white">Make Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#f1f5f9" },
});
