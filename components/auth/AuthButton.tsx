import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function AuthButton({ title, style, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1C74E9",
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#1C74E9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
