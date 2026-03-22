import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppSelector } from "@/store/hooks";

export default function CartIconButton() {
  const router = useRouter();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push("/cart")} activeOpacity={0.7}>
      <Ionicons name="cart-outline" size={24} color="#0F172A" />
      {cartItemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
