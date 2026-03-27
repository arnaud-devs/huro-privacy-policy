import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onScanQR: () => void;
  onManualCode: () => void;
  onReportIssue: () => void;
}

export function VerifyDeliveryCard({ onScanQR, onManualCode, onReportIssue }: Props) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verify Delivery</Text>
        <Text style={styles.cardSubtitle}>
          Ask the customer to show their QR code or provide the delivery code
        </Text>

        <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85} onPress={onScanQR}>
          <Ionicons name="qr-code-outline" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.scanBtnText}>Scan QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.manualBtn} activeOpacity={0.85} onPress={onManualCode}>
          <Ionicons name="keypad-outline" size={22} color="#1C74E9" style={{ marginRight: 10 }} />
          <Text style={styles.manualBtnText}>Enter Code Manually</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.issueBtn} activeOpacity={0.7} onPress={onReportIssue}>
        <Ionicons name="warning-outline" size={18} color="#F59E0B" />
        <Text style={styles.issueBtnText}>Report an Issue</Text>
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  scanBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
  manualBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  manualBtnText: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },
  issueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  issueBtnText: { flex: 1, fontSize: 14, fontWeight: "600", color: "#92400E" },
});
