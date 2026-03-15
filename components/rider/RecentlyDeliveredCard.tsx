import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function RecentlyDeliveredCard({
  code,
  orderId,
  details,
}: {
  code: string;
  orderId: string;
  details: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.codeSquare}>
        <Text style={styles.codeLabel}>CODE</Text>
        <Text style={styles.codeValue}>{code}</Text>
      </View>
      <View style={styles.middleContent}>
        <Text style={styles.orderId}>{orderId}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={16} color="#10B981" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 12,
    marginBottom: 10,
  },
  codeSquare: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  codeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#047857",
  },
  middleContent: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
