import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeliveryIssuesScreen() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleReport = () => {
    router.replace("/(rider)/report-issue");
  };

  const isTimerDone = timeLeft === 0;

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
        <Text style={styles.headerTitle}>Delivery Issues</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Delivery Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Delivery Progress</Text>
            <Text style={styles.progressStep}>Step 3/3</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>ACCEPTED</Text>
            <Text style={styles.progressLabel}>PICKUP</Text>
            <Text style={[styles.progressLabel, styles.progressLabelActive]}>
              DELIVER
            </Text>
          </View>
        </View>

        {/* Active Delivery Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>ACTIVE DELIVERY</Text>
            <Text style={styles.orderNumber}>Order #1045</Text>
            <Text style={styles.customerName}>Customer: Alex Rivers</Text>
          </View>
          <View style={styles.orderIconWrap}>
            <Ionicons name="search-outline" size={32} color="#1C74E9" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Action Required</Text>

        {/* Action 1: Call Customer */}
        <View style={styles.actionCard}>
          <View style={styles.actionIconWrapBlue}>
            <Ionicons name="call-outline" size={20} color="#1C74E9" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>1. Call Customer</Text>
            <Text style={styles.actionSubtitle}>
              Try contacting Alex Rivers
            </Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Action 2: Wait at Location */}
        <View style={styles.actionCard}>
          <View style={styles.actionIconWrapGray}>
            <Ionicons name="timer-outline" size={20} color="#475569" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>2. Wait at Location</Text>
            <Text style={styles.actionSubtitle}>
              Standard wait time protocol
            </Text>
          </View>
          <View style={styles.timerWrap}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>MINUTES LEFT</Text>
          </View>
        </View>

        {/* Action 3: Final Report */}
        <View
          style={[styles.actionCard, !isTimerDone && styles.actionCardDisabled]}
        >
          <View
            style={
              isTimerDone
                ? styles.actionIconWrapBlue
                : styles.actionIconWrapGray
            }
          >
            <Ionicons
              name="warning-outline"
              size={20}
              color={isTimerDone ? "#1C74E9" : "#94A3B8"}
            />
          </View>
          <View style={styles.actionInfo}>
            <Text
              style={[styles.actionTitle, !isTimerDone && styles.textDisabled]}
            >
              3. Final Report
            </Text>
            <Text
              style={[
                styles.actionSubtitle,
                !isTimerDone && styles.textDisabled,
              ]}
            >
              {isTimerDone
                ? "You can now make the final report"
                : "Available after timer ends"}
            </Text>
          </View>
          {!isTimerDone && (
            <Ionicons name="lock-closed-outline" size={20} color="#CBD5E1" />
          )}
        </View>

        <View style={styles.spacer} />

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={isTimerDone ? styles.mainBtnActive : styles.mainBtnDisabled}
            activeOpacity={isTimerDone ? 0.85 : 1}
            onPress={isTimerDone ? handleReport : undefined}
          >
            <Text
              style={
                isTimerDone
                  ? styles.mainBtnTextActive
                  : styles.mainBtnTextDisabled
              }
            >
              Report Customer Not Found
            </Text>
          </TouchableOpacity>
          <Text style={styles.bottomHelperText}>
            Please ensure you are at the correct delivery pin before reporting.
          </Text>
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
    fontWeight: "800",
    color: "#0F172A",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  progressStep: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 3,
    width: "100%", // step 3/3 is fully filled
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  progressLabelActive: {
    color: "#1C74E9",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  orderInfo: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: "#475569",
  },
  orderIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  actionCardDisabled: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  actionIconWrapBlue: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionIconWrapGray: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  callBtn: {
    backgroundColor: "#1C74E9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  timerWrap: {
    alignItems: "flex-end",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C74E9",
  },
  timerLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 2,
  },
  textDisabled: {
    color: "#94A3B8",
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    marginBottom: 24,
  },
  mainBtnDisabled: {
    width: "100%",
    height: 56,
    backgroundColor: "#E2E8F0",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mainBtnActive: {
    width: "100%",
    height: 56,
    backgroundColor: "#1C74E9",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mainBtnTextDisabled: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "700",
  },
  mainBtnTextActive: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomHelperText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
