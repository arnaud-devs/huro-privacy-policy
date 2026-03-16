import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/slices/userSlice";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email || !password) return;

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload.data.user;
      
      // Check the user role and render the dashboard accordingly
      if (user.role === "RIDER") {
        router.replace("/(rider)");
      } else {
        router.replace("/(tabs)");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-2.5 justify-center">
            <View className="flex-grow justify-center h-full">
              <AuthLogo />

              <Text className="text-3xl font-bold text-slate-900 mb-3 text-center">
                Welcome Back
              </Text>
              <Text className="text-base text-slate-600 leading-[22px] mb-8 text-center">
                Log in to continue your campus journey.
              </Text>

              {error ? (
                <Text className="text-red-500 text-center mb-4">{error}</Text>
              ) : null}

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

              <AuthInput
                label="Password"
                iconName="lock-closed-outline"
                placeholder="Your secure password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <AuthButton
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
              />
            </View>
            <View className="flex-row justify-center items-center mb-20">
              <Text className="text-base text-slate-500">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/sign-up")}>
                <Text className="text-base font-semibold text-primary">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
