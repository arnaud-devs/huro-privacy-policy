import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU_ITEMS = [
  { icon: "list-outline", label: "My Listings", route: "/(tabs)/more/my-listings" },
  { icon: "heart-outline", label: "Saved Items", route: null },
  { icon: "person-outline", label: "Profile", route: "/(tabs)/more/profile" },
  { icon: "settings-outline", label: "Settings", route: null },
  { icon: "help-circle-outline", label: "Help & Support", route: null },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-xl font-bold text-slate-900">More</Text>
      </View>

      <View className="mx-4 mt-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => item.route && router.push(item.route as any)}
            className="flex-row items-center px-4 py-4"
            style={index < MENU_ITEMS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" } : undefined}
          >
            <View className="w-9 h-9 bg-blue-50 rounded-full items-center justify-center mr-3">
              <Ionicons name={item.icon as any} size={18} color="#1C74E9" />
            </View>
            <Text className="flex-1 text-sm font-semibold text-slate-800">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
