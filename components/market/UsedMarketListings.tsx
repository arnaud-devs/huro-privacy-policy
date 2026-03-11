import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const LISTINGS = [
  {
    id: '1',
    title: 'Bluetooth speaker',
    price: '10k RWF',
    seller: 'Alex M.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Nike shoes',
    price: '15k RWF',
    seller: 'Sarah K.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Organic Chemistry Set',
    price: '5k RWF',
    seller: 'David L.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
  },
];

export default function UsedMarketListings() {
  const router = useRouter();

  return (
    <View className="px-4 mt-4 mb-20">
      <Text className="text-xl font-bold text-slate-900 mb-4">Student Listings</Text>
      
      {LISTINGS.map(item => (
        <View key={item.id} className="bg-white rounded-3xl mb-4 border border-slate-100 shadow-sm overflow-hidden">
          <Image 
            source={{ uri: item.image }} 
            className="w-full h-52 bg-slate-100" 
            contentFit="cover" 
          />
          
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-bold text-slate-900 flex-1">{item.title}</Text>
              <Text className="text-base font-bold text-primary ml-2">{item.price}</Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <View className="w-5 h-5 bg-blue-100 rounded-full items-center justify-center mr-2">
                <Ionicons name="person" size={12} color="#1C74E9" />
              </View>
              <Text className="text-sm text-slate-500">Seller: {item.seller}</Text>
            </View>
            
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-3 justify-center items-center"
                onPress={() => router.push({ pathname: '/product-details', params: { id: item.id } })}
              >
                <Text className="text-white font-semibold text-sm">View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 border border-slate-200 rounded-xl justify-center items-center">
                <Ionicons name="heart-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
