import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export default function AuthInput({ label, iconName, ...props }: AuthInputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={iconName} size={20} color="#8D94A2" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#A0A5B1"
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },
});
