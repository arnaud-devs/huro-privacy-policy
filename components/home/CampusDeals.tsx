import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CampusDeals() {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campus Deals</Text>
        <View style={styles.limitedTimeBadge}>
          <Text style={styles.limitedTimeText}>LIMITED TIME</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dealsScrollContainer}
      >
        <TouchableOpacity style={styles.dealCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80",
            }}
            style={styles.dealImage}
          />
          <View style={styles.dealInfo}>
            <Text style={styles.dealTitle} numberOfLines={1}>
              Chapati + Soda Combo
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>1,500 RWF</Text>
              <Text style={styles.oldPrice}>2,200 RWF</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dealCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80",
            }}
            style={styles.dealImage}
          />
          <View style={styles.dealInfo}>
            <Text style={styles.dealTitle} numberOfLines={1}>
              Late Night Snacks
            </Text>
            <Text style={styles.currentPrice}>3,000 RWF</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  limitedTimeBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  limitedTimeText: {
    color: "#1C74E9",
    fontSize: 10,
    fontWeight: "bold",
  },
  dealsScrollContainer: {
    gap: 16,
    paddingRight: 16, // to allow scroll past last item
    marginBottom: 32,
  },
  dealCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dealImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#E2E8F0",
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C74E9",
  },
  oldPrice: {
    fontSize: 12,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
});