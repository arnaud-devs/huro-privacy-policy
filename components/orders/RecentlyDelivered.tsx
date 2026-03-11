import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

interface RecentOrderItem {
  id: string;
  title: string;
  date: string;
  amount: string;
  image: string;
  action: "rate" | "reorder";
}

interface RecentlyDeliveredProps {
  items: RecentOrderItem[];
  onViewAll?: () => void;
  onRate?: (id: string) => void;
  onReorder?: (id: string) => void;
}

export default function RecentlyDelivered({
  items,
  onViewAll,
  onRate,
  onReorder,
}: RecentlyDeliveredProps) {
  return (
    <View className="mt-2">
      {/* Section header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-slate-900">Recently Delivered</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-sm font-semibold text-primary">VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {items.map((item) => (
        <View
          key={item.id}
          className="flex-row items-center bg-white rounded-2xl mb-3 px-4 py-3 border border-slate-100"
        >
          <Image
            source={{ uri: item.image }}
            style={styles.thumbnail}
            contentFit="cover"
          />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {item.date} • {item.amount}
            </Text>
          </View>

          {item.action === "rate" ? (
            <TouchableOpacity
              onPress={() => onRate?.(item.id)}
              className="border border-primary rounded-full px-3 py-1.5"
            >
              <Text className="text-xs font-semibold text-primary">Leave Rating</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onReorder?.(item.id)}
              className="bg-slate-100 rounded-full px-3 py-1.5"
            >
              <Text className="text-xs font-semibold text-slate-700">Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnail: { width: 52, height: 52, borderRadius: 12 },
});
