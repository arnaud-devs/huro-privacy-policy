import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const PRODUCTS = [
  {
    id: "1",
    name: "Lay's Classic Chips",
    price: "RWF 150",
    image:
      "https://images.unsplash.com/photo-1566478989037-e6281fd470fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "A4 Print Paper (10...",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1588666579624-9b22e11a3dbe?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Fast USB-C Cable...",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1624823183533-3d0b2ac84587?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Spiral Notebook A5",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5406c59b207?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "5",
    name: "Fresh Milk 1L",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "6",
    name: "Gel Pen Set (3pcs)",
    price: "RWF 180",
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProductGrid() {
  const router = useRouter();
  return (
    <View className="px-4 mt-2 mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-slate-900">Nearby Shops</Text>
        <TouchableOpacity>
          <Text className="text-primary font-bold text-sm">See all</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {PRODUCTS.map((product) => (
          <View
            key={product.id}
            className="w-[48%] bg-white rounded-[20px] p-2 mb-4 border border-slate-100 shadow-sm"
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/campus-product-details",
                  params: { id: product.id },
                })
              }
            >
              <View className="relative">
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-[140px] rounded-2xl bg-slate-100"
                  contentFit="cover"
                />
                <TouchableOpacity className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full items-center justify-center">
                  <Ionicons name="heart-outline" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View className="mt-3 mb-2 px-1">
                <Text
                  className="text-sm font-bold text-slate-900"
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text className="text-primary font-extrabold text-base mt-1">
                  {product.price}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-primary flex-row items-center justify-center py-2.5 rounded-xl mt-auto">
              <Ionicons name="cart-outline" size={16} color="white" />
              <Text className="text-white font-bold text-xs ml-1.5">
                Add to cart
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
