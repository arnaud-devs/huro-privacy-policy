import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyEmail, resendOtp, clearError } from "@/store/slices/userSlice";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userId, email } = useLocalSearchParams<{ userId: string; email: string }>();
  const { isVerifyingEmail, verifyEmailError, isResendingOtp } = useAppSelector((s) => s.user);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = Array.from({ length: CODE_LENGTH }, () => useRef<TextInput>(null));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Start initial cooldown so resend isn't available immediately
  useEffect(() => {
    startCooldown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const handleCodeChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");

    // Handle paste — fill from current index
    if (cleaned.length > 1) {
      const newCode = [...code];
      cleaned.split("").slice(0, CODE_LENGTH - index).forEach((d, i) => {
        newCode[index + i] = d;
      });
      setCode(newCode);
      const next = Math.min(index + cleaned.length, CODE_LENGTH - 1);
      inputRefs[next].current?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = cleaned;
    setCode(newCode);
    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  async function handleVerify() {
    const otp = code.join("");
    if (otp.length < CODE_LENGTH) return;
    if (!userId) {
      Alert.alert("Error", "Missing user ID. Please go back and register again.");
      return;
    }

    const result = await dispatch(verifyEmail({ userId, otp }));
    if (verifyEmail.fulfilled.match(result)) {
      const role = result.payload.data.user?.role?.toUpperCase();
      router.replace(role === "RIDER" ? "/(rider)" : "/profile-setup");
    }
  }

  async function handleResend() {
    if (cooldown > 0 || !userId) return;
    const result = await dispatch(resendOtp({ userId }));
    if (resendOtp.fulfilled.match(result)) {
      startCooldown();
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } else {
      Alert.alert("Failed", (result.payload as string) || "Could not resend OTP.");
    }
  }

  const otpFilled = code.every((d) => d !== "");
  const displayEmail = email || "your email";

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="flex-1 p-4 pb-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-white rounded-3xl shadow-sm shadow-black/5 overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4">
            <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-slate-900">Verify Email</Text>
            <View className="w-8" />
          </View>

          <View className="h-px bg-slate-100" />

          <View className="flex-1 px-6 pt-8">
            <Text className="text-3xl font-bold text-slate-900 mb-3">
              Check your email
            </Text>
            <Text className="text-base text-slate-600 leading-6 mb-8">
              We sent a 6-digit code to{"\n"}
              <Text className="font-semibold text-primary">{displayEmail}</Text>
            </Text>

            {/* Error */}
            {verifyEmailError ? (
              <View className="bg-red-50 rounded-2xl px-4 py-3 mb-6 flex-row items-center gap-2">
                <Ionicons name="alert-circle-outline" size={18} color="#ef4444" />
                <Text className="text-red-600 text-sm flex-1">{verifyEmailError}</Text>
              </View>
            ) : null}

            {/* OTP Inputs */}
            <View className="flex-row justify-between mb-8">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={{
                    width: 46,
                    height: 56,
                    borderWidth: 1.5,
                    borderRadius: 14,
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#0f172a",
                    textAlign: "center",
                    backgroundColor: digit ? "#f0f9ff" : "#fff",
                    borderColor: digit ? "#1C74E9" : "#e2e8f0",
                  }}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Countdown Timer */}
            <View className="flex-row justify-center gap-4 mb-8">
              <View className="items-center flex-1">
                <View className="bg-blue-50 rounded-2xl w-full h-12 justify-center items-center mb-2">
                  <Text className="text-lg font-bold text-primary">
                    {String(Math.floor(cooldown / 60)).padStart(2, "0")}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500 tracking-wide">MINUTES</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-blue-50 rounded-2xl w-full h-12 justify-center items-center mb-2">
                  <Text className="text-lg font-bold text-primary">
                    {String(cooldown % 60).padStart(2, "0")}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500 tracking-wide">SECONDS</Text>
              </View>
            </View>

            {/* Resend */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-sm text-slate-500">Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={cooldown > 0 || isResendingOtp}>
                {isResendingOtp ? (
                  <ActivityIndicator size="small" color="#1C74E9" />
                ) : (
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: cooldown > 0 ? "#94a3b8" : "#1C74E9" }}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              className="rounded-3xl h-[52px] flex-row justify-center items-center mb-10 shadow-md shadow-primary/20"
              style={{
                backgroundColor: otpFilled && !isVerifyingEmail ? "#1C74E9" : "#94a3b8",
              }}
              onPress={handleVerify}
              disabled={!otpFilled || isVerifyingEmail}
              activeOpacity={0.85}
            >
              {isVerifyingEmail ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white text-base font-semibold mr-2">Verify & Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View className="items-center mt-auto mb-5">
              <View className="w-16 h-16 rounded-full bg-slate-50 justify-center items-center">
                <Ionicons name="lock-closed-outline" size={28} color="#A0A5B1" />
              </View>
            </View>
          </View>
        </View>

        <View className="items-center mt-5">
          <Text className="text-sm text-slate-500">Step 2 of 4 • Account Security</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
