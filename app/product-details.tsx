import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductSellerCard from "@/components/product/ProductSellerCard";
import ProductSpecifications from "@/components/product/ProductSpecifications";

const PRODUCTS: Record<string, {
  title: string;
  price: string;
  condition: string;
  images: string[];
  seller: { name: string; memberSince: string; rating: number };
  meetingPoint: string;
  description: string;
  specifications: { label: string; value: string }[];
}> = {
  "1": {
    title: "Bluetooth Speaker",
    price: "10,000 RWF",
    condition: "Good Condition",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    ],
    seller: { name: "John D.", memberSince: "2023", rating: 4.8 },
    meetingPoint: "UR CST",
    description:
      "High-quality portable bluetooth speaker with deep bass and crystal clear sound. Barely used during the last semester. It's waterproof and perfect for outdoor hangouts or study sessions. Battery still holds a full charge.",
    specifications: [
      { label: "Battery Life", value: "12 hours" },
      { label: "Connectivity", value: "Bluetooth 5.0" },
      { label: "Condition", value: "Used - Like New" },
    ],
  },
  "2": {
    title: "Nike Shoes",
    price: "15,000 RWF",
    condition: "Good Condition",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    ],
    seller: { name: "Sarah K.", memberSince: "2024", rating: 4.5 },
    meetingPoint: "UR Nyarugenge",
    description:
      "Authentic Nike running shoes, size 42. Worn only a few times, still in excellent condition. Great for sports or everyday casual wear.",
    specifications: [
      { label: "Size", value: "42 EU" },
      { label: "Color", value: "Red / White" },
      { label: "Condition", value: "Used - Like New" },
    ],
  },
  "3": {
    title: "Organic Chemistry Set",
    price: "5,000 RWF",
    condition: "Fair Condition",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    ],
    seller: { name: "David L.", memberSince: "2022", rating: 4.9 },
    meetingPoint: "UR CST Library",
    description:
      "Complete organic chemistry textbook and lab manual set. Some highlighting on a few pages but overall in good shape. Perfect for Year 2 chemistry students.",
    specifications: [
      { label: "Subject", value: "Organic Chemistry" },
      { label: "Pages", value: "650+" },
      { label: "Condition", value: "Used - Fair" },
    ],
  },
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = PRODUCTS[id ?? "1"];

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-base text-slate-500">Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Product Details</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images} />

        {/* Condition Badge */}
        <View className="px-4 mt-4">
          <Text className="text-xs font-bold text-primary uppercase tracking-wider">
            {product.condition}
          </Text>
        </View>

        {/* Title & Price */}
        <View className="px-4 mt-2">
          <Text className="text-xl font-bold text-slate-900">{product.title}</Text>
          <Text className="text-lg font-bold text-primary mt-1">{product.price}</Text>
        </View>

        {/* Seller Card */}
        <ProductSellerCard
          name={product.seller.name}
          memberSince={product.seller.memberSince}
          rating={product.seller.rating}
        />

        {/* Meeting Point */}
        <View className="flex-row items-center mx-4 mt-3">
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text className="text-sm text-slate-500 ml-1">
            Meeting point: {product.meetingPoint}
          </Text>
        </View>

        {/* Description */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-slate-900 mb-2">Description</Text>
          <Text className="text-sm text-slate-600 leading-6">{product.description}</Text>
        </View>

        {/* Specifications */}
        <ProductSpecifications specs={product.specifications} />

        <View className="h-24" />
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 pb-8">
        <TouchableOpacity className="bg-primary flex-row items-center justify-center py-4 rounded-2xl">
          <Ionicons name="chatbubble-outline" size={18} color="white" />
          <Text className="text-white font-bold text-base ml-2">Get in Touch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
