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

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLogo from "@/components/auth/AuthLogo";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/slices/userSlice";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = async () => {
    if (!email || !fullName || !password) return; 

    const resultAction = await dispatch(registerUser({ email, fullName, password }));
    
    if (registerUser.fulfilled.match(resultAction)) {
      const userId = resultAction.payload.data?.userId ?? "";
      router.replace({
        pathname: "/verify-email",
        params: { userId, email },
      });
    }
  };

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
        <View className="flex-1 px-6 pt-2.5 justify-center">
          <View className="flex-grow justify-center h-full">
            <AuthLogo />

          <Text className="text-3xl font-bold text-slate-900 mb-3 text-center"> 
            Create Account
          </Text>
          <Text className="text-base text-slate-600 leading-[22px] mb-8 text-center">
            Welcome! Please fill in your details to get started with your
            campus community.
          </Text>

          {error ? (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}

          <AuthInput
            label="Full Name"
            iconName="person-outline"
            placeholder="e.g. Alex Thompson"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

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
            isPassword
            autoCapitalize="none"
          />

          <AuthButton
            title="Continue"
            onPress={handleRegister}
            isLoading={isLoading}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
