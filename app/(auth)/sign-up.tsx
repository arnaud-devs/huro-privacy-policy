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

        <View className="flex-1 px-6 pt-2.5 justify-center">
          <View className="flex-grow justify-center h-full">
            <AuthLogo />

          <Text className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Create Account
          </Text>
          <Text className="text-base text-slate-600 leading-[22px] mb-8 text-center">
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
          </View>
          <View className="flex-row justify-center items-center mb-20">
            <Text className="text-base text-slate-500">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-base font-semibold text-primary">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
