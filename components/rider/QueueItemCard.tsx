import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function QueueItemCard() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.codeSquare}>
          <Text style={styles.codeLabel}>CODE</Text>
          <Text style={styles.codeValue}>3821</Text>
        </View>
        <View style={styles.middleContent}>
          <Text style={styles.orderId}>Order #1042</Text>
          <Text style={styles.details}>Sam Chen • Science Block B</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
        <Text style={styles.actionBtnText}>Mark Delivered</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  codeSquare: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
  },
  middleContent: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  moreBtn: {
    padding: 4,
  },
  actionBtn: {
    backgroundColor: "#EFF6FF",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C74E9",
  },
});
