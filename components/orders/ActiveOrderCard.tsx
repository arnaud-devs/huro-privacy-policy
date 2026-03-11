import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface ActiveOrderCardProps {
  id: string;
  title: string;
  store: string;
  orderId: string;
  eta: string;
  stage: string;
  image: string;
  badge: { label: string; color: "orange" | "blue" };
  primaryAction: { label: string; icon: string };
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export default function ActiveOrderCard({
  title,
  store,
  orderId,
  eta,
  stage,
  image,
  badge,
  primaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: ActiveOrderCardProps) {
  return (
    <View className="bg-white rounded-3xl mb-4 overflow-hidden border border-slate-100">
      {/* Image with badge */}
      <View>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
        />
        <View
          className="absolute top-3 right-3 flex-row items-center px-3 py-1 rounded-full"
          style={badge.color === "orange" ? styles.badgeOrange : styles.badgeBlue}
        >
          <View
            className="w-2 h-2 rounded-full mr-1"
            style={badge.color === "orange" ? styles.dotOrange : styles.dotBlue}
          />
          <Text
            className="text-xs font-bold uppercase tracking-wider"
            style={badge.color === "orange" ? styles.textOrange : styles.textBlue}
          >
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="px-4 pt-3 pb-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-4">
            <Text className="text-base font-bold text-slate-900">{title}</Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {store} • ID: {orderId}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-bold text-primary">ETA: {eta}</Text>
            <Text className="text-xs text-slate-400 mt-0.5">{stage}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onPrimaryAction}
            className="flex-1 bg-primary flex-row items-center justify-center py-3 rounded-2xl"
          >
            <Ionicons name={primaryAction.icon as any} size={16} color="white" />
            <Text className="text-white font-semibold text-sm ml-2">
              {primaryAction.label}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSecondaryAction}
            className="w-11 h-11 border border-slate-200 rounded-2xl items-center justify-center"
          >
            <Ionicons name="chatbubble-outline" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 160 },
  badgeOrange: { backgroundColor: "#fff7ed" },
  badgeBlue: { backgroundColor: "#eff6ff" },
  dotOrange: { backgroundColor: "#f97316" },
  dotBlue: { backgroundColor: "#1C74E9" },
  textOrange: { color: "#ea580c" },
  textBlue: { color: "#1C74E9" },
});
