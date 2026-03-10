import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', name: 'Snacks', icon: 'fast-food-outline' },
  { id: '2', name: 'Printing', icon: 'print-outline' },
  { id: '3', name: 'Chargers', icon: 'hardware-chip-outline' }, // closest to plug
  { id: '4', name: 'Stationery', icon: 'pencil-outline' },
  { id: '5', name: 'Groceries', icon: 'basket-outline' },
  { id: '6', name: 'More', icon: 'ellipsis-horizontal' },
];

export default function MarketCategories() {
  return (
    <View className="flex-row flex-wrap justify-between px-6 py-4">
      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.id} className="w-[30%] items-center mb-5">
          <View className="w-16 h-16 bg-white rounded-[24px] items-center justify-center shadow-sm border border-slate-100 mb-2">
            <Ionicons name={cat.icon as any} size={28} color="#475569" />
          </View>
          <Text className="text-xs font-semibold text-slate-700">{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
