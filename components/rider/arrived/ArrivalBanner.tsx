import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function ArrivalBanner() {
  return (
    <View style={styles.bannerCard}>
      <View style={styles.bannerIcon}>
        <Ionicons name="flag" size={32} color="#1C74E9" />
      </View>
      <Text style={styles.bannerTitle}>You've Arrived!</Text>
      <Text style={styles.bannerSubtitle}>
        Notify the customer and verify delivery
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  bannerSubtitle: { fontSize: 14, color: "#64748B", marginTop: 4, textAlign: "center" },
});
