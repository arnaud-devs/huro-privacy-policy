import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const CATEGORIES = [
  { id: "1", name: "All", icon: "grid-outline" },
  { id: "2", name: "Electronics", icon: "laptop-outline" },
  { id: "3", name: "Shoes", icon: "footsteps-outline" },
  { id: "4", name: "Clothing", icon: "shirt-outline" },
  { id: "5", name: "Books", icon: "book-outline" },
];

export default function UsedMarketCategories() {
  const [active, setActive] = useState("1");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 py-2"
      contentContainerStyle={{ gap: 8, paddingRight: 32 }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActive(cat.id)}
            className={`flex-row items-center px-4 py-2 bg-slate-100 rounded-full border border-slate-200 ${isActive ? "bg-primary border-primary" : "bg-slate-50"}`}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={isActive ? "white" : "#64748b"}
            />
            <Text
              className={`ml-2 text-sm font-semibold ${isActive ? "text-white" : "text-slate-600"}`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
