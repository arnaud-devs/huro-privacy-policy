import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
    const cleanText = text.replace(/[^0-9]/g, "");

    if (cleanText.length > 1) {
      const newCode = [...code];
      const pastedCode = cleanText.split("").slice(0, 4);
      pastedCode.forEach((digit, i) => {
        if (index + i < 4) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 3);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = cleanText;
    setCode(newCode);
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
            <Text className="text-base font-semibold text-slate-900">Create Account</Text>
            <View className="w-8" />
          </View>

          <View className="h-px bg-slate-100" />

          <View className="flex-1 px-6 pt-8">
            <Text className="text-[28px] font-bold text-slate-900 mb-3">
              Verify your email
            </Text>
            <Text className="text-[15px] text-slate-600 leading-6 mb-8">
              We've sent a 4-digit verification code to{"\n"}
              <Text className="font-semibold text-primary">{displayEmail}</Text>
            </Text>

            {/* OTP Inputs */}
            <View className="flex-row justify-between mb-8 px-2.5">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  className={`w-[60px] h-16 border rounded-2xl text-2xl font-bold text-slate-900 text-center bg-white ${
                    digit ? "border-primary bg-slate-50" : "border-slate-200"
                  }`}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={4}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Timer */}
            <View className="flex-row justify-center gap-4 mb-8">
              <View className="items-center flex-1">
                <View className="bg-blue-50 rounded-2xl w-full h-12 justify-center items-center mb-2">
                  <Text className="text-lg font-bold text-primary">00</Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-500 tracking-wide">MINUTES</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-blue-50 rounded-2xl w-full h-12 justify-center items-center mb-2">
                  <Text className="text-lg font-bold text-primary">54</Text>
                </View>
                <Text className="text-[11px] font-semibold text-slate-500 tracking-wide">SECONDS</Text>
              </View>
            </View>

            {/* Resend Link */}
            <View className="flex-row justify-center items-center mb-6">
              <Text className="text-sm text-slate-500">Didn't receive the code? </Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-blue-400">Resend code</Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              className="bg-primary rounded-3xl h-[52px] flex-row justify-center items-center mb-10 shadow-md shadow-primary/20"
              onPress={() => router.push("/profile-setup")}
            >
              <Text className="text-white text-base font-semibold mr-2">Verify & Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Shield Icon */}
            <View className="items-center mt-auto mb-5">
              <View className="w-16 h-16 rounded-full bg-slate-50 justify-center items-center">
                <Ionicons name="lock-closed-outline" size={28} color="#A0A5B1" />
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-5">
          <Text className="text-sm text-slate-500">Step 2 of 4 • Account Security</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
