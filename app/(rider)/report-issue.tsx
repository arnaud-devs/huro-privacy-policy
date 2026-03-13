import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportIssueScreen() {
  const router = useRouter();

  const handleReturnToBatch = () => {
    router.replace("/(rider)/pickup-batch");
  };

  const handleNextDelivery = () => {
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
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Status Area */}
        <View style={styles.statusContainer}>
          <View style={styles.outerGlow}>
            <View style={styles.innerIcon}>
              <Ionicons
                name="person-remove-outline"
                size={40}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.title}>Issue Reported</Text>

          <View style={styles.pill}>
            <Text style={styles.pillText}>Customer Not Found</Text>
          </View>

          <Text style={styles.description}>
            We've logged this report for your current delivery. Please follow
            the instructions below to complete this task.
          </Text>
        </View>

        {/* Next Steps Section */}
        <Text style={styles.sectionTitle}>Next Steps</Text>

        <View style={styles.cardsContainer}>
          {/* Step 1 */}
          <View style={styles.stepCard}>
            <View style={styles.stepIconWrap}>
              <Ionicons
                name="return-down-back-outline"
                size={22}
                color="#1C74E9"
              />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Return Items</Text>
              <Text style={styles.stepDescription}>
                Please return all items from this order to the Campus Shop
                central desk immediately.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepCard}>
            <View style={styles.stepIconWrap}>
              <Ionicons name="clipboard-outline" size={22} color="#1C74E9" />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>Batch Instructions</Text>
              <Text style={styles.stepDescription}>
                Check your current batch details for any specific location-based
                return procedures.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
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

        <Text style={styles.supportText}>
          Need help? Contact support if you're unable to return the items within
          the next 30 minutes.
        </Text>
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
    fontWeight: "800",
    color: "#0F172A",
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  outerGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  innerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C74E9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1C74E9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  pill: {
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  pillText: {
    color: "#B45309",
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: "#F8FAFC",
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#1C74E9",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#E2E8F0",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryBtnText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  supportText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
