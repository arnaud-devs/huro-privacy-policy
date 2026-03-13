import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderCancelledScreen() {
  const router = useRouter();

  const handleReturnToBatch = () => {
    router.replace("/(rider)/active-delivery");
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C74E9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Cancelled</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.iconCircleOuter}>
            <Ionicons name="close-circle-outline" size={56} color="#ef4444" />
          </View>
          
          <Text style={styles.title}>Order #1045 Cancelled</Text>
          <Text style={styles.subtitle}>
            The customer has cancelled this order. We've notified the dispatch team. Please follow the instructions below to complete this task.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleReturnToBatch} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Return to Batch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Next Steps Section */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>Required Next Steps</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="storefront-outline" size={20} color="#0F172A" />
              <Text style={styles.cardTitle}>Return Item</Text>
            </View>
            <Text style={styles.cardDesc}>
              Please return the item to the <Text style={styles.boldDesc}>Campus Shop central desk</Text>. Show the cancellation screen to the attendant to verify the return.
            </Text>
            <View style={styles.locationWrap}>
              <Ionicons name="location-outline" size={16} color="#1C74E9" />
              <Text style={styles.locationText}>Student Union, Level 1</Text>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  statusSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#1C74E9",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#E2E8F0",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  stepsSection: {
    marginTop: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 16,
  },
  boldDesc: {
    fontWeight: "700",
    color: "#0F172A",
  },
  locationWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: "#1C74E9",
    fontWeight: "500",
    marginLeft: 6,
  },
});
