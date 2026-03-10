import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {/* Logo Placeholder */}
          <View style={styles.logoContainer}>
            {/* You can replace this with your actual local logo image */}
            <Text style={styles.logoText}>
              huza<Text style={styles.logoTextOrange}>Go</Text>
            </Text>
            <Text style={styles.logoSubtext}>
              Fast & Affordable Local Delivery
            </Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Welcome! Please enter your email address to get started with your
            campus community.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8D94A2"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. name@university.edu"
                placeholderTextColor="#A0A5B1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: "/verify-email",
                params: { email: email }
              });
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#0F172A",
  },
  headerRight: {
    width: 40, // To balance the back button width
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1363A5", // huza blue
    letterSpacing: -1,
  },
  logoTextOrange: {
    color: "#F48C06", // Go orange
  },
  logoSubtext: {
    fontSize: 8,
    color: "#1363A5",
    marginTop: -5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 32,
  },
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 15,
    color: "#64748B",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C74E9",
  },
});
