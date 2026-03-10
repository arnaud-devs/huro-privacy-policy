import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/auth/AuthButton";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo";

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
        <AuthHeader title="Sign Up" />

        <View style={styles.content}>
          <AuthLogo />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Welcome! Please enter your email address to get started with your
            campus community.
          </Text>

          <AuthInput
            label="Email"
            iconName="mail-outline"
            placeholder="e.g. name@university.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <AuthButton
            title="Continue"
            onPress={() => {
              router.push({
                pathname: "/verify-email",
                params: { email: email }
              });
            }}
          />

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
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

