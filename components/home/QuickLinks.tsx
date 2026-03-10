import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickLinks() {
  return (
    <View style={styles.quickLinksContainer}>
      <TouchableOpacity style={styles.quickLinkCard}>
        <View style={styles.quickLinkIconWrapper}>
          <Ionicons name="storefront-outline" size={22} color="#0F172A" />
        </View>
        <Text style={styles.quickLinkTitle}>Partner Shop</Text>
        <Text style={styles.quickLinkSubtitle}>
          Order from official shops
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickLinkCard}>
        <View style={styles.quickLinkIconWrapper}>
          <Ionicons name="sync-circle-outline" size={24} color="#0F172A" />
        </View>
        <Text style={styles.quickLinkTitle}>Used Market</Text>
        <Text style={styles.quickLinkSubtitle}>
          Buy & sell with fellow students
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickLinksContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  quickLinkSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
});