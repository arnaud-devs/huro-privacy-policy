import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

export default function RiderTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1C74E9",
        tabBarInactiveTintColor: "#64748B",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 85,
          paddingBottom: Platform.OS === "ios" ? 30 : 22,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 4,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "EARNINGS",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "wallet" : "wallet-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "HISTORY",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "time" : "time-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pickup-batch"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
