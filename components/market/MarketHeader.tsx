import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MarketHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={28} color="#0F172A" />
      </TouchableOpacity>
      
      <Text className="text-xl font-extrabold text-slate-900">Market</Text>
      
      <View className="flex-row items-center gap-4">
        <TouchableOpacity className="relative">
          <Ionicons name="cart-outline" size={26} color="#0F172A" />
          <View className="absolute -top-1 -right-1 bg-primary w-4 h-4 rounded-full items-center justify-center">
            <Text className="text-xxs text-white font-bold">2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="h-8 w-8 rounded-full border border-slate-200 items-center justify-center">
          <Ionicons name="notifications-outline" size={18} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
