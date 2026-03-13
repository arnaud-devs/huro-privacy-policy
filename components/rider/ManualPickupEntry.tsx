import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export function ManualPickupEntry() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MANUAL PICKUP ENTRY</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter 4-digit pickup code"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          maxLength={4}
        />
        <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85}>
          <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingLeft: 16,
    paddingRight: 6,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  scanBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1C74E9",
    justifyContent: "center",
    alignItems: "center",
  },
});
