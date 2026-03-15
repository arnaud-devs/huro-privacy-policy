import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderVerifiedScreen() {
  const router = useRouter();

  const handleNextDelivery = () => {
    // Navigate back to active delivery
    router.replace("/(rider)/active-delivery");
  };

  const handleViewBatch = () => {
    router.replace("/(rider)/pickup-batch");
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.contentContainer}>
        {/* Main Content */}
        <View style={styles.centerSection}>
          <View style={styles.iconCircleOuter}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>
          
          <Text style={styles.title}>Order Verified</Text>
          <Text style={styles.orderId}>Order #1045</Text>
          
          <Text style={styles.subtitle}>
            Delivery for <Text style={styles.boldText}>Alex Rivers</Text> is complete.
          </Text>

          <View style={styles.nextBatchCard}>
            <View style={styles.nextBatchIconWrap}>
              <Ionicons name="car-outline" size={20} color="#1C74E9" />
            </View>
            <View style={styles.nextBatchInfo}>
              <Text style={styles.nextBatchLabel}>Next in batch</Text>
              <Text style={styles.nextBatchAddress}>124 Maple Street</Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.mainBtn} 
            activeOpacity={0.85}
            onPress={handleNextDelivery}
          >
            <Text style={styles.mainBtnText}>Confirm & Next Delivery</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn} 
            activeOpacity={0.7}
            onPress={handleViewBatch}
          >
            <Text style={styles.secondaryBtnText}>View Batch Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  iconCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C74E9",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 40,
  },
  boldText: {
    fontWeight: "700",
    color: "#0F172A",
  },
  nextBatchCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  nextBatchIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nextBatchInfo: {
    flex: 1,
  },
  nextBatchLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 4,
  },
  nextBatchAddress: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  mainBtn: {
    flexDirection: "row",
    width: "100%",
    height: 56,
    backgroundColor: "#1C74E9",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  mainBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },
});
