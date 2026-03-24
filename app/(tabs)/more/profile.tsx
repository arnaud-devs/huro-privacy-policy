import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, logoutUser } from "@/store/slices/userSlice";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuItem = {
  icon: string;
  label: string;
  color: string;
  route: string | null;
  danger?: boolean;
};

type Section = {
  title: string;
  items: MenuItem[];
};

const SECTIONS: Section[] = [
  {
    title: "MY ORDERS",
    items: [
      {
        icon: "cube-outline",
        label: "Active Orders",
        color: "#1C74E9",
        route: "/(tabs)/orders",
      },
      {
        icon: "time-outline",
        label: "Order History",
        color: "#1C74E9",
        route: "/(tabs)/orders",
      },
    ],
  },
  {
    title: "HELP & SUPPORT",
    items: [
      {
        icon: "chatbox-outline",
        label: "Chat with Support",
        color: "#1C74E9",
        route: null,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        icon: "person-outline",
        label: "Edit Profile",
        color: "#1C74E9",
        route: "/(tabs)/more/edit-profile",
      },
      {
        icon: "notifications-outline",
        label: "Notifications",
        color: "#1C74E9",
        route: null,
      },
      {
        icon: "log-out-outline",
        label: "Logout",
        color: "#ef4444",
        route: null,
        danger: true,
      },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, tokens, isAuthenticated } = useAppSelector(
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
            await dispatch(logoutUser({ refreshToken: tokens.refreshToken }));
          }
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/more")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar card */}
        <View style={styles.avatarCard}>
        <Image
          source={{
            uri:
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          }}
          style={styles.avatar}
          contentFit="cover"
        />
        <Text style={styles.userName}>{user?.fullName || "User Name"}</Text>
        <Text style={styles.userEmail}>
          {user?.email || "user@example.com"}
        </Text>
      </View>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.row,
                  index < section.items.length - 1 && styles.rowBorder,
                ]}
                onPress={() =>
                  item.danger
                    ? handleLogout()
                    : item.route && router.push(item.route as any)
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconWrap,
                    item.danger && styles.iconWrapDanger,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={item.color}
                  />
                </View>
                <Text
                  style={[
                    styles.rowLabel,
                    item.danger && styles.rowLabelDanger,
                  ]}
                >
                  {item.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={item.danger ? "#ef4444" : "#94a3b8"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: 40 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 34, height: 34, justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#0f172a" },

  // Avatar card
  avatarCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e2e8f0",
    marginBottom: 12,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 3,
  },
  userEmail: { fontSize: 13, color: "#64748b" },

  // Sections
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconWrapDanger: { backgroundColor: "#fef2f2" },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: "#0f172a" },
  rowLabelDanger: { color: "#ef4444" },
});
