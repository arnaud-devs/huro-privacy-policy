import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProductSellerCardProps {
  name: string;
  memberSince: string;
  rating: number;
}

export default function ProductSellerCard({ name, memberSince, rating }: ProductSellerCardProps) {
  return (
    <View className="mx-4 mt-4 flex-row items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <View className="w-10 h-10 bg-slate-200 rounded-full items-center justify-center mr-3">
        <Ionicons name="person" size={20} color="#64748b" />
      </View>

      <View className="flex-1">
        <Text className="text-base font-bold text-slate-900">{name}</Text>
        <Text className="text-xs text-slate-500">
          Member since {memberSince} • {rating}★
        </Text>
      </View>

      <TouchableOpacity>
        <Text className="text-sm font-semibold text-primary">View Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
