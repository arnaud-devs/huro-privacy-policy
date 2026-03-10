import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
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
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AuthHeader title="Sign Up" />

        <View className="flex-1 px-6 pt-2.5">
          <AuthLogo />

          <Text className="text-[28px] font-bold text-slate-900 mb-3">
            Create Account
          </Text>
          <Text className="text-[15px] text-slate-600 leading-[22px] mb-8">
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
                params: { email: email },
              });
            }}
          />

          <View className="flex-row justify-center items-center mt-auto mb-5">
            <Text className="text-[15px] text-slate-500">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-[15px] font-semibold text-primary">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
