import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const displayEmail = email || "alex.d@example.com";

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, "");

    // Support paste (e.g. pasting "1234")
    if (cleanText.length > 1) {
      const newCode = [...code];
      const pastedCode = cleanText.split("").slice(0, 4);
      pastedCode.forEach((digit, i) => {
        if (index + i < 4) newCode[index + i] = digit;
      });
      setCode(newCode);

      // Focus on the last filled input or the very last input
      const nextIndex = Math.min(index + pastedCode.length, 3);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = cleanText;
    setCode(newCode);

    // Move to next input if there's text
    if (cleanText && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.divider} />

          <View style={styles.content}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We've sent a 4-digit verification code to{"\n"}
              <Text style={styles.emailText}>{displayEmail}</Text>
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={4} // Allow longer for paste formatting
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <View style={styles.timerBoxWrapper}>
                <View style={styles.timerBox}>
                  <Text style={styles.timerValue}>00</Text>
                </View>
                <Text style={styles.timerLabel}>MINUTES</Text>
              </View>
              <View style={styles.timerBoxWrapper}>
                <View style={styles.timerBox}>
                  <Text style={styles.timerValue}>54</Text>
                </View>
                <Text style={styles.timerLabel}>SECONDS</Text>
              </View>
            </View>

            {/* Resend Link */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend code</Text>
              </TouchableOpacity>
            </View>

            {/* Verify & Continue Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Navigate to the next step
                router.push("/profile-setup");
              }}
            >
              <Text style={styles.buttonText}>Verify & Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Shield Icon */}
            <View style={styles.shieldContainer}>
              <View style={styles.shieldIconWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={28}
                  color="#A0A5B1"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Step 2 of 4 • Account Security</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light gray background
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  headerRight: {
    width: 32, // Balance for center alignment
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
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
    lineHeight: 24,
    marginBottom: 32,
  },
  emailText: {
    fontWeight: "600",
    color: "#1C74E9",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 60,
    height: 64,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: "#1C74E9",
    backgroundColor: "#F8FAFC",
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  timerBoxWrapper: {
    alignItems: "center",
    flex: 1,
  },
  timerBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C74E9",
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#64748B",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#60A5FA",
  },
  button: {
    backgroundColor: "#1C74E9",
    borderRadius: 24,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  shieldContainer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  shieldIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
});
