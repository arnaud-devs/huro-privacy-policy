import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, logoutUser } from "@/store/slices/userSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RiderProfileScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useAppDispatch();
  const { user, tokens, isLoading, isAuthenticated } = useAppSelector(
    (state) => state.user,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          if (tokens?.refreshToken) {
            try {
              await dispatch(
                logoutUser({ refreshToken: tokens.refreshToken }),
              ).unwrap();
              console.log("Rider successfully logged out.");
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout failed:", error);
              console.log("Forcing client-side logout anyway.");
              router.replace("/(auth)/login");
            }
          } else {
            console.log("Logged out. No refresh token found.");
            router.replace("/(auth)/login");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-slate-100 flex-row items-center">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-slate-900 mr-8">
          Rider Profile
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="bg-white items-center py-6 border-b border-slate-100">
          <View className="relative">
            <Image
              source={{
                uri:
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
              }}
              className="w-24 h-24 rounded-full bg-slate-200"
            />
            {/* Online Status Dot */}
            <View className="absolute bottom-0 right-1 border-4 border-white rounded-full bg-green-500 w-6 h-6" />
          </View>

          <Text className="text-2xl font-bold text-slate-900 mt-4">
            {user?.fullName || "Rider Name"}
          </Text>
          <Text className="text-slate-500 text-sm mt-1">
            Rider ID: {user?.id?.slice(0, 8).toUpperCase() || "RD-104"}
          </Text>
          <Text className="text-slate-400 text-sm mt-1">
            {user?.phone || user?.email || "No contact info"}
          </Text>
        </View>

        <View className="px-4 py-6">
          {/* Status Card */}
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-6 shadow-sm shadow-slate-100/50 border border-slate-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-[#F0F6FF] items-center justify-center mr-3">
                <Feather name="radio" size={20} color="#1C74E9" />
              </View>
              <View>
                <Text className="text-slate-900 font-bold mb-0.5">Status</Text>
                <Text className="text-slate-500 text-sm">
                  {isOnline ? "You are currently online" : "You are offline"}
                </Text>
              </View>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: "#e2e8f0", true: "#1C74E9" }}
              thumbColor={"#ffffff"}
            />
          </View>

          {/* Details Section */}
          <Text className="text-slate-500 font-bold text-xs uppercase mb-3 ml-1">
            DETAILS
          </Text>
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-6 shadow-sm shadow-slate-100/50 border border-slate-100">
            <View className="flex-row items-center">
              <Ionicons
                name="bicycle-outline"
                size={24}
                color="#64748b"
                className="mr-3"
              />
              <Text className="text-slate-900 font-bold ml-2">Vehicle</Text>
            </View>
            <Text className="text-slate-500 font-medium">RAF 450R</Text>
          </View>

          {/* Help & Actions Section */}
          <Text className="text-slate-500 font-bold text-xs uppercase mb-3 ml-1">
            HELP & ACTIONS
          </Text>

          <Pressable className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-4 shadow-sm shadow-slate-100/50 border border-slate-100">
            <View className="flex-row items-center">
              <Feather
                name="headphones"
                size={20}
                color="#1C74E9"
                className="mr-3"
              />
              <Text className="text-slate-900 font-bold ml-3">
                Contact Support
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="bg-white rounded-2xl p-4 flex-row items-center justify-center mb-8 border border-red-100"
          >
            <Feather name="log-out" size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold ml-2">Logout</Text>
          </Pressable>

          <Text className="text-center text-slate-400 text-xs mb-8">
            App Version 1.0.3
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
