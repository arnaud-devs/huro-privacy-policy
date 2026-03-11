import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PickupDetailsProps {
  code: string;
  location: string;
}

export default function PickupDetails({ code, location }: PickupDetailsProps) {
  return (
    <View className="mx-4 mt-2 bg-white rounded-3xl overflow-hidden border border-slate-100">
      {/* Section label */}
      <View className="px-5 pt-5 pb-3">
        <Text className="text-xs font-bold text-primary uppercase tracking-widest">
          Pickup Details
        </Text>
      </View>

      {/* QR placeholder */}
      <View className="mx-5 rounded-2xl items-center justify-center py-8" style={styles.qrBg}>
        <View className="bg-white p-4 rounded-2xl" style={styles.qrBox}>
          <Ionicons name="qr-code-outline" size={64} color="#1C74E9" />
        </View>
      </View>

      {/* Code block */}
      <View className="mx-5 mt-5 mb-2 items-center">
        <Text className="text-xs text-slate-400 mb-2">Your unique code</Text>
        <View style={styles.codeBox} className="w-full items-center py-4 rounded-2xl">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            ÖÏÀKÚÖ ÀÖDE
          </Text>
          <Text className="text-5xl font-bold text-slate-900">{code}</Text>
        </View>
      </View>

      {/* Info notice */}
      <View className="flex-row items-start mx-5 mt-4 mb-6">
        <Ionicons name="information-circle-outline" size={16} color="#94a3b8" style={{ marginTop: 1 }} />
        <Text className="text-xs text-slate-400 ml-2 flex-1 leading-5">
          Show this code at the {location} pickup station to collect your order.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrBg: { backgroundColor: "#eff6ff" },
  qrBox: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  codeBox: {
    borderWidth: 2,
    borderColor: "#1C74E9",
    borderStyle: "dashed",
    borderRadius: 16,
  },
});
