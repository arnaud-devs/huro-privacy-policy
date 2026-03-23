import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/userSlice";

const TOTAL_STEPS = 3;

const stepTitles = ["Personal Info", "Phone Number", "Set Password"];
const stepSubtitles = [
  "Enter your name and email address.",
  "We'll use this for delivery updates.",
  "Create a strong password to secure your account.",
];

export default function SignUpScreen() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stepError, setStepError] = useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  function handleNext() {
    setStepError("");

    if (step === 1) {
      if (!fullName.trim()) return setStepError("Full name is required.");
      if (!email.trim()) return setStepError("Email is required.");
      setStep(2);
    } else if (step === 2) {
      if (!phone.trim()) return setStepError("Phone number is required.");
      if (!/^\+\d{7,15}$/.test(phone.trim()))
        return setStepError("Use international format, e.g. +250788123456");
      setStep(3);
    }
  }

  function handleBack() {
    setStepError("");
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setStepError("");
    if (!password) return setStepError("Password is required.");
    if (password !== confirmPassword) return setStepError("Passwords do not match.");

    const resultAction = await dispatch(
      registerUser({ fullName, email, phone, password, role: "CUSTOMER" })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      const userId = resultAction.payload.data?.userId ?? "";
      router.replace({ pathname: "/verify-email", params: { userId, email } });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-2.5">
            {/* Logo */}
            <AuthLogo />

            {/* Step indicator */}
            <View className="flex-row items-center justify-center gap-2 mb-6">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 4,
                    backgroundColor: i + 1 <= step ? "#1C74E9" : "#e2e8f0",
                  }}
                />
              ))}
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-slate-900 mb-1 text-center">
              {stepTitles[step - 1]}
            </Text>
            <Text className="text-sm text-slate-500 mb-7 text-center">
              {stepSubtitles[step - 1]}
            </Text>

            {/* Errors */}
            {(stepError || error) ? (
              <Text className="text-red-500 text-center mb-4 text-sm">
                {stepError || error}
              </Text>
            ) : null}

            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <>
                <AuthInput
                  label="Full Name"
                  iconName="person-outline"
                  placeholder="e.g. Alice Uwase"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
                <AuthInput
                  label="Email"
                  iconName="mail-outline"
                  placeholder="e.g. alice@university.edu"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </>
            )}

            {/* Step 2 — Phone */}
            {step === 2 && (
              <AuthInput
                label="Phone Number"
                iconName="call-outline"
                placeholder="+250788000000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}

            {/* Step 3 — Password */}
            {step === 3 && (
              <>
                <AuthInput
                  label="Password"
                  iconName="lock-closed-outline"
                  placeholder="Your secure password"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                  autoCapitalize="none"
                />
                <AuthInput
                  label="Confirm Password"
                  iconName="lock-closed-outline"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  isPassword
                  autoCapitalize="none"
                />
              </>
            )}

            {/* Actions */}
            <View className="mt-2">
              {step < TOTAL_STEPS ? (
                <AuthButton title="Next" onPress={handleNext} />
              ) : (
                <AuthButton
                  title="Create Account"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                />
              )}

              {step > 1 && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center justify-center mt-3 py-2"
                >
                  <Ionicons name="arrow-back" size={16} color="#64748b" />
                  <Text className="text-slate-500 text-sm font-medium ml-1">Back</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Login link */}
            <View className="flex-row justify-center items-center mt-8 mb-10">
              <Text className="text-base text-slate-500">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-base font-semibold text-primary">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
