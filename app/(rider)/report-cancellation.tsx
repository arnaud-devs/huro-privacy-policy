import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REASONS = [
  "Customer called to cancel",
  "Customer refused order at doorstep",
  "Unable to reach customer",
  "Safety or security concerns",
  "Other reasons",
];

export default function ReportCancellationScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string>(REASONS[0]);
  const [notes, setNotes] = useState("");

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Cancellation</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Order Info */}
          <View style={styles.infoBanner}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="information-outline" size={20} color="#1C74E9" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>Order #8829-01</Text>
              <Text style={styles.infoSubtitle}>Merchant: Fresh Bites Bistro</Text>
            </View>
          </View>

          {/* Reason Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason for cancellation</Text>
            <Text style={styles.sectionSubtitle}>
              Please select the most accurate reason for this cancellation.
            </Text>

            <View style={styles.radioGroup}>
              {REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={styles.radioItem}
                    activeOpacity={0.7}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <Text style={styles.radioLabel}>
                      {reason}
                    </Text>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.innerCircle} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Provide more details about the cancellation situation..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={16} color="#DC2626" style={{ marginTop: 2 }} />
            <Text style={styles.warningText}>
              Warning: Excessive cancellations may impact your performance rating and account standing.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.mainBtn} activeOpacity={0.85} onPress={() => router.replace("/(rider)/order-cancelled")}>
            <Text style={styles.mainBtnText}>Confirm Cancellation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={handleBack}>
            <Text style={styles.secondaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#F4F7FB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D0E3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 20,
  },
  radioGroup: {
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleActive: {
    borderColor: "#1C74E9",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1C74E9",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    paddingTop: 16,
    minHeight: 120,
    fontSize: 14,
    color: "#0F172A",
  },
  warningBanner: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#DC2626",
    lineHeight: 18,
    fontWeight: "500",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  mainBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#1C74E9",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  mainBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
});
