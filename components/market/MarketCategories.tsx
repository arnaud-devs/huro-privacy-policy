import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';

interface Props {
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
}

export default function MarketCategories({ selectedCategoryId, onCategorySelect }: Props) {
  const { categories, error } = useAppSelector((state) => state.categories);

  if (error) {
    return (
      <View className="py-6 items-center px-6">
        <Text className="text-sm text-red-500">{error}</Text>
      </View>
    );
  }

  function handlePress(categoryId: string) {
    // Tap the same category again to deselect
    onCategorySelect(selectedCategoryId === categoryId ? undefined : categoryId);
  }

  return (
    <View className="flex-row flex-wrap justify-between px-6 py-4">
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            className="w-[30%] items-center mb-5"
            onPress={() => handlePress(cat.id)}
          >
            <View
              className={`w-16 h-16 rounded-[24px] items-center justify-center mb-2 border ${
                isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              {cat.iconUrl ? (
                <Image
                  source={{ uri: cat.iconUrl }}
                  style={{ width: 28, height: 28, tintColor: isSelected ? 'white' : undefined }}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons
                  name="grid-outline"
                  size={28}
                  color={isSelected ? 'white' : '#475569'}
                />
              )}
            </View>
            <Text
              className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-slate-700'}`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
