import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ZoneArrivalCardProps {
  zoneName: string;
  hasArrived: boolean;
  onArrived: () => void;
}

export function ZoneArrivalCard({ zoneName, hasArrived, onArrived }: ZoneArrivalCardProps) {
  if (!hasArrived) {
    return (
      <View style={styles.arrivalCard}>
        <View style={styles.arrivalIcon}>
          <Ionicons name="navigate" size={28} color="#1C74E9" />
        </View>
        <Text style={styles.arrivalTitle}>Heading to {zoneName}</Text>
        <Text style={styles.arrivalSubtitle}>
          Tap the button below when you arrive at the delivery zone
        </Text>
        <TouchableOpacity
          style={styles.arrivedZoneBtn}
          activeOpacity={0.85}
          onPress={onArrived}
        >
          <Ionicons
            name="flag"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.arrivedZoneBtnText}>I've Arrived at {zoneName}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.arrivedBanner}>
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <Text style={styles.arrivedBannerText}>
        Arrived at {zoneName} — verify each order below
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  arrivalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#BFDBFE",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  arrivalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  arrivalTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  arrivalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  arrivedZoneBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    width: "100%",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  arrivedZoneBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
  arrivedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  arrivedBannerText: { fontSize: 13, color: "#166534", fontWeight: "600", flex: 1 },
});
