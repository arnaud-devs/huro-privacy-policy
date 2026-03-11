import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-slate-900">Create Account</Text>
          <View className="w-8" />
        </View>

        <View className="flex-1 px-6 pt-6">
          <Text className="text-3xl font-bold text-slate-900 mb-2">
            Tell us about yourself
          </Text>
          <Text className="text-base text-slate-500 mb-8">
            Complete your profile to join the community.
          </Text>

          {/* Full Name Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-900 mb-2">Full Name</Text>
            <View className="flex-row items-center border border-slate-200 rounded-2xl px-4 h-14 bg-slate-50">
              <Ionicons name="person-outline" size={20} color="#8D94A2" className="mr-3" />
              <TextInput
                className="flex-1 text-base text-slate-900"
                placeholder="Enter your full name"
                placeholderTextColor="#A0A5B1"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Campus Selection */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-900 mb-2">Select Your Campus</Text>
            <TouchableOpacity className="flex-row items-center justify-between border border-slate-200 rounded-2xl px-4 h-14 bg-slate-50">
              <View className="flex-row items-center">
                <Ionicons name="school-outline" size={20} color="#8D94A2" className="mr-3" />
                <Text className="text-base text-slate-900">Choose your campus</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Terms Text */}
          <View className="mt-4 items-center">
            <Text className="text-sm text-slate-500 text-center leading-5">
              By clicking "Complete Sign Up", you agree to our{"\n"}
              <Text className="text-primary">Terms of Service</Text> and{" "}
              <Text className="text-primary">Privacy Policy</Text>.
            </Text>
          </View>

          <View className="flex-1" />

          {/* Complete Button */}
          <TouchableOpacity
            className="bg-primary rounded-3xl h-[52px] justify-center items-center mb-4 shadow-md shadow-primary/20"
            onPress={() => router.push("/account-created")}
          >
            <Text className="text-white text-base font-semibold">Complete Sign Up</Text>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity className="items-center py-3 mb-5">
            <Text className="text-base text-slate-500 font-medium">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
