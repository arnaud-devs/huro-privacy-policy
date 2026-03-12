import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 45;

export default function LoginScreen() {
  const router = useRouter();

  // ── Step 0: role ───────────────────────────────────────────────
  const [role, setRole] = useState<"student" | "rider" | null>(null);

  // ── Step 1: email ──────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  // ── Step 2: OTP ────────────────────────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!codeSent) return;
    setCountdown(RESEND_SECONDS);
    const id = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [codeSent]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>
              huza<Text style={styles.logoAccent}>Go</Text>
            </Text>
            <Text style={styles.logoSub}>
              Fast &amp; Affordable Local Delivery
            </Text>
          </View>

          {/* ── Step 0: Role selection ── */}
          {!role ? (
            <>
              <Text style={styles.welcomeTitle}>Welcome to HuZaGo</Text>
              <Text style={styles.welcomeSub}>
                Choose how you'd like to continue.
              </Text>

              <TouchableOpacity
                style={styles.roleCard}
                activeOpacity={0.85}
                onPress={() => setRole("student")}
              >
                <View
                  style={[styles.roleIconWrap, { backgroundColor: "#e0edff" }]}
                >
                  <Ionicons name="school-outline" size={28} color="#1C74E9" />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={styles.roleTitle}>Login as Student</Text>
                  <Text style={styles.roleSub}>
                    Browse, order &amp; buy on campus
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleCard}
                activeOpacity={0.85}
                onPress={() => setRole("rider")}
              >
                <View
                  style={[styles.roleIconWrap, { backgroundColor: "#fef3e0" }]}
                >
                  <Ionicons name="bicycle-outline" size={28} color="#F48C06" />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={styles.roleTitle}>Login as Rider</Text>
                  <Text style={styles.roleSub}>
                    Deliver orders across campus
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>

              {/* Sign up prompt */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/sign-up")}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Back to role selection */}
              <TouchableOpacity
                style={styles.backRow}
                onPress={() => {
                  setRole(null);
                  setCodeSent(false);
                  setEmail("");
                  setOtp(Array(OTP_LENGTH).fill(""));
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={18} color="#1C74E9" />
                <Text style={styles.backRowText}>Change role</Text>
              </TouchableOpacity>

              {/* Role badge */}
              <View style={styles.roleBadge}>
                <Ionicons
                  name={
                    role === "student" ? "school-outline" : "bicycle-outline"
                  }
                  size={14}
                  color={role === "student" ? "#1C74E9" : "#F48C06"}
                />
                <Text
                  style={[
                    styles.roleBadgeText,
                    { color: role === "student" ? "#1C74E9" : "#F48C06" },
                  ]}
                >
                  {role === "student" ? "Student" : "Rider"}
                </Text>
              </View>

              {/* Welcome */}
              <Text style={styles.welcomeTitle}>Welcome to HuZaGo</Text>
              <Text style={styles.welcomeSub}>
                Enter your email to receive a secure verification code.
              </Text>

              {/* ── Email section ── */}
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="done"
              />

              <TouchableOpacity
                style={[styles.primaryBtn, !email && styles.primaryBtnDisabled]}
                activeOpacity={0.85}
                disabled={!email}
                onPress={() => setCodeSent(true)}
              >
                <Text style={styles.primaryBtnText}>Send Code</Text>
              </TouchableOpacity>

              {/* ── Verify section ── */}
              {codeSent && (
                <View style={styles.verifySection}>
                  <Text style={styles.verifyTitle}>Verify your number</Text>
                  <Text style={styles.verifySub}>
                    We've sent a 4-digit code to{" "}
                    <Text style={styles.verifyBold}>{email}</Text>
                  </Text>

                  {/* OTP boxes */}
                  <View style={styles.otpRow}>
                    {otp.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={(r) => {
                          inputRefs.current[i] = r;
                        }}
                        style={[
                          styles.otpBox,
                          digit ? styles.otpBoxFilled : null,
                        ]}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, i)}
                        onKeyPress={({ nativeEvent }) =>
                          handleOtpKeyPress(nativeEvent.key, i)
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      !isOtpComplete && styles.primaryBtnDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={!isOtpComplete}
                    onPress={() => router.replace(role === "rider" ? "/(rider)" as any : "/(tabs)" as any)}
                  >
                    <Text style={styles.primaryBtnText}>
                      Verify &amp; Login
                    </Text>
                  </TouchableOpacity>

                  {countdown > 0 ? (
                    <Text style={styles.resendTimer}>
                      Resend code in 00:{pad(countdown)}
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={() => setCodeSent(false)}>
                      <Text style={styles.resendLink}>Resend code</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="lock-closed-outline" size={12} color="#94a3b8" />
            <Text style={styles.footerLabel}>SECURE CAMPUS LOGIN</Text>
          </View>
          <Text style={styles.footerTerms}>
            By continuing, you agree to One Campus Terms of Service and Privacy
            Policy. Messaging and data rates may apply.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 34, height: 34, justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#0f172a" },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },

  // Logo
  logoWrap: { alignItems: "center", marginBottom: 24, marginTop: 8 },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1363A5",
    letterSpacing: -1,
  },
  logoAccent: { color: "#F48C06" },
  logoSub: { fontSize: 11, color: "#1363A5", marginTop: -2 },

  // Welcome
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  // Field
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 16,
  },

  // Button
  primaryBtn: {
    backgroundColor: "#1C74E9",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { fontSize: 15, fontWeight: "700", color: "white" },

  // Verify section
  verifySection: { marginTop: 32 },
  verifyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  verifySub: { fontSize: 13, color: "#64748b", marginBottom: 24 },
  verifyBold: { fontWeight: "700", color: "#0f172a" },

  // OTP
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "white",
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  otpBoxFilled: { borderColor: "#1C74E9" },

  // Resend
  resendTimer: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#1C74E9",
    fontWeight: "600",
  },
  resendLink: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
    color: "#1C74E9",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Sign up prompt
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  signupText: { fontSize: 13, color: "#64748b" },
  signupLink: { fontSize: 13, color: "#1C74E9", fontWeight: "700" },

  // Role cards
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 14,
  },
  roleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  roleTextWrap: { flex: 1 },
  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  roleSub: { fontSize: 12, color: "#64748b" },

  // Back row
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  backRowText: { fontSize: 13, color: "#1C74E9", fontWeight: "600" },

  // Role badge
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  roleBadgeText: { fontSize: 12, fontWeight: "700" },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 40,
    marginBottom: 6,
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footerTerms: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 16,
  },
});
