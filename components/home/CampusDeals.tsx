import { Image } from "expo-image";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CampusDeals() {
  return (
    <>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">Campus Deals</Text>
        <View className="bg-blue-100 px-2 py-1 rounded">
          <Text className="text-primary text-xxs font-bold">LIMITED TIME</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingRight: 16 }}
        className="mb-8"
      >
        <TouchableOpacity className="w-[200px] bg-white rounded-2xl overflow-hidden border border-slate-200">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80",
            }}
            className="w-full h-[120px] bg-slate-200"
          />
          <View className="p-3">
            <Text className="text-sm font-bold text-slate-900 mb-2" numberOfLines={1}>
              Chapati + Soda Combo
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-primary">1,500 RWF</Text>
              <Text className="text-xs text-slate-400 line-through">2,200 RWF</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="w-[200px] bg-white rounded-2xl overflow-hidden border border-slate-200">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80",
            }}
            className="w-full h-[120px] bg-slate-200"
          />
          <View className="p-3">
            <Text className="text-sm font-bold text-slate-900 mb-2" numberOfLines={1}>
              Late Night Snacks
            </Text>
            <Text className="text-base font-bold text-primary">3,000 RWF</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
