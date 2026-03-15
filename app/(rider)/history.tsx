import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RiderHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Today");

  const historyData = [
    {
      id: "124",
      location: "Campus Drop Zone",
      amount: "RWF 12,400",
      deliveries: 26,
      time: "Completed 2:35 PM",
      timeIcon: "clock",
    },
    {
      id: "123",
      location: "UR Main Gate",
      amount: "RWF 8,200",
      deliveries: 18,
      time: "Completed 12:10 PM",
      timeIcon: "clock",
    },
    {
      id: "122",
      location: "Nyabugogo Hub",
      amount: "RWF 10,500",
      deliveries: 22,
      time: "Completed yesterday",
      timeIcon: "calendar",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-bold text-slate-900 mr-8">
          HISTORY
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-slate-100">
        <Pressable
          onPress={() => setActiveTab("Today")}
          className={`flex-1 items-center py-4 border-b-2 ${
            activeTab === "Today" ? "border-primary" : "border-transparent"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "Today" ? "text-primary" : "text-slate-500"
            }`}
          >
            Today
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("This Week")}
          className={`flex-1 items-center py-4 border-b-2 ${
            activeTab === "This Week" ? "border-primary" : "border-transparent"
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "This Week" ? "text-primary" : "text-slate-500"
            }`}
          >
            This Week
          </Text>
        </Pressable>
      </View>

      {/* Content List */}
      <ScrollView 
        className="flex-1 px-4 pt-4" 
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {historyData.map((item, index) => (
          <View
            key={item.id}
            className="border border-slate-100 rounded-3xl p-5 mb-4 bg-white"
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-primary font-bold text-xs uppercase">
                BATCH #{item.id}
              </Text>
              <Text className="text-slate-900 font-bold text-base">
                {item.amount}
              </Text>
            </View>

            <Text className="text-slate-900 font-bold text-lg mb-3">
              {item.location}
            </Text>

            <View className="flex-row items-center mb-2">
              <Feather name="package" size={16} color="#64748b" />
              <Text className="text-slate-500 text-sm ml-2">
                {item.deliveries} deliveries
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <Feather name={item.timeIcon as any} size={16} color="#64748b" />
              <Text className="text-slate-500 text-sm ml-2">
                {item.time}
              </Text>
            </View>

            <Pressable className="bg-[#F0F6FF] py-3 rounded-xl items-center mt-1">
              <Text className="text-primary font-bold text-sm">
                View Details
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
