import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1C74E9", // The blue color from the screenshots
        tabBarInactiveTintColor: "#64748B", // Grayish color for inactive
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 85, // Increased android height
          paddingBottom: Platform.OS === "ios" ? 30 : 22, // Increased bottom padding to lift text up
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
            <Ionicons
              size={24}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "MARKET",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "storefront" : "storefront-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarLabel: "Orders", // Using exact casing from screenshot
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "receipt" : "receipt-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "MESSAGES",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "MORE",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="ellipsis-vertical" color={color} />
          ),
        }}
      />
      {/* Hide the old explore screen from the tabs without deleting the file */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
