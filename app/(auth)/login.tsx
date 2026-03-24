import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
import { clearError, loginUser, googleLogin } from "@/store/slices/userSlice";

// Replace with your Google Web Client ID from Google Cloud Console
const WEB_CLIENT_ID = "631103835596-rctq5tgc50q68hebq1i293gohbtp2o45.apps.googleusercontent.com";

// Lazy-load Google Sign-In so it doesn't crash in Expo Go
let GoogleSignin: any = null;
let statusCodes: any = {};
try {
  const gsi = require("@react-native-google-signin/google-signin");
  GoogleSignin = gsi.GoogleSignin;
  statusCodes = gsi.statusCodes;
  GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
} catch {
  // Native module not available (e.g. Expo Go)
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  function navigateAfterLogin(role: string, profileComplete: boolean, isNewUser?: boolean) {
    if (role?.toUpperCase() === "RIDER") {
      router.replace("/(rider)/(rider-tabs)" as any);
    } else if (isNewUser || !profileComplete) {
      router.replace("/profile-setup");
    } else {
      router.replace("/(tabs)");
    }
  }

  const handleLogin = async () => {
    if (!email || !password) return;

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload.data.user;
      console.log('[login] user role:', user?.role, 'profileComplete:', user?.profileComplete);
      navigateAfterLogin(user?.role, user?.profileComplete);
    } else {
      const msg = (resultAction.payload as string) ?? "";
      if (msg.toLowerCase().includes("not verified") || msg.toLowerCase().includes("verify")) {
        router.push({ pathname: "/verify-email", params: { email } });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!GoogleSignin) {
      Alert.alert("Not Available", "Google Sign-In requires a dev build. It is not supported in Expo Go.");
      return;
    }
    try {
      setIsGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert("Sign-In Failed", "Could not get ID token. Please try again.");
        return;
      }

      const result = await dispatch(googleLogin({ idToken }));

      if (googleLogin.fulfilled.match(result)) {
        const { user, isNewUser } = result.payload.data;
        navigateAfterLogin(user?.role, user?.profileComplete, isNewUser);
      } else {
        Alert.alert("Sign-In Failed", (result.payload as string) || "Google sign-in failed.");
      }
    } catch (err: any) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign-In Error", err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
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
                isPassword
                autoCapitalize="none"
              />

              <AuthButton
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
              />

              {/* Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-slate-200" />
                <Text className="mx-3 text-sm text-slate-400 font-medium">or continue with</Text>
                <View className="flex-1 h-px bg-slate-200" />
              </View>

              {/* Google Sign-In button */}
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: "#e2e8f0",
                  borderRadius: 14,
                  height: 54,
                  backgroundColor: "white",
                  gap: 10,
                  opacity: isGoogleLoading ? 0.6 : 1,
                }}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color="#64748b" />
                ) : (
                  <>
                    <Image
                      source={{ uri: "https://www.google.com/favicon.ico" }}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ fontSize: 15, fontWeight: "600", color: "#0f172a" }}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center items-center mb-20">
              <Text className="text-base text-slate-500">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/sign-up")}>
                <Text className="text-base font-semibold text-primary">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
