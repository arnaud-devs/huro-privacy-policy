import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReturnConfirmedScreen() {
  const router = useRouter();

  const handleReturnToBatch = () => {
    // Navigate back to the pickup batch or dashboard depending on your flow
    router.replace("/(rider)/pickup-batch");
  };

  const handleNextDelivery = () => {
    // Navigate directly to the next delivery or active delivery map
    router.replace("/(rider)/active-delivery");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Confirmed</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-undo-outline" size={48} color="#1C74E9" />
        </View>

        <Text style={styles.title}>Return Initiated</Text>
        <Text style={styles.description}>
          Please return the items for <Text style={styles.boldText}>Order #1045</Text> to
          the Campus Shop central desk immediately.
          Show this screen to the shop attendant for verification.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleReturnToBatch}
          >
            <Text style={styles.primaryBtnText}>Return to Batch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.7}
            onPress={handleNextDelivery}
          >
            <Text style={styles.secondaryBtnText}>View Next Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="headset-outline" size={16} color="#1C74E9" />
            <Text style={styles.supportBtnText}>Need help? Contact support</Text>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
    marginBottom: 48,
  },
  boldText: {
    fontWeight: "700",
    color: "#0F172A",
  },
  actions: {
    width: "100%",
    gap: 16,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#1C74E9",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  supportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  supportBtnText: {
    color: "#1C74E9",
    fontSize: 15,
    fontWeight: "600",
  },
});
