import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  phone: string;
  address: string;
  zone: string;
  onCall: () => void;
}

export function CustomerInfoCard({ name, phone, address, zone, onCall }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Customer Details</Text>

      <View style={styles.row}>
        <Ionicons name="person-outline" size={18} color="#64748B" />
        <View style={styles.content}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{name}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons name="call-outline" size={18} color="#64748B" />
        <View style={styles.content}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{phone}</Text>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={onCall}>
          <Ionicons name="call" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#64748B" />
        <View style={styles.content}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{address}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Ionicons name="map-outline" size={18} color="#64748B" />
        <View style={styles.content}>
          <Text style={styles.label}>Zone</Text>
          <Text style={styles.value}>{zone}</Text>
        </View>
      </View>
    </View>
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
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", marginBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  content: { flex: 1 },
  label: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  value: { fontSize: 14, color: "#0F172A", fontWeight: "600", marginTop: 2 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
});
