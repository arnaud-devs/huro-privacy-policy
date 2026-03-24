import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile, updatePhone, fetchUserProfile } from "@/store/slices/userSlice";

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((s) => s.user);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [originalPhone, setOriginalPhone] = useState(user?.phone ?? "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile()).then((result) => {
      if (fetchUserProfile.fulfilled.match(result)) {
        const u = result.payload.data;
        setFullName(u.fullName ?? "");
        setPhone(u.phone ?? "");
        setOriginalPhone(u.phone ?? "");
      }
    });
  }, []);

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert("Required", "Full name cannot be empty.");
      return;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^\+\d{7,15}$/.test(trimmedPhone)) {
      Alert.alert("Invalid Phone", "Phone must be in international format, e.g. +250788123456");
      return;
    }

    const profileResult = await dispatch(
      updateProfile({ fullName: fullName.trim(), avatarUri: avatarUri ?? undefined })
    );
    if (!updateProfile.fulfilled.match(profileResult)) {
      Alert.alert("Profile Update Failed", (profileResult.payload as string) || "Could not update profile.");
      return;
    }

    if (trimmedPhone && trimmedPhone !== originalPhone) {
      const phoneResult = await dispatch(updatePhone({ phone: trimmedPhone }));
      if (!updatePhone.fulfilled.match(phoneResult)) {
        Alert.alert("Phone Update Failed", (phoneResult.payload as string) || "Could not update phone number.");
        return;
      }
    }

    Alert.alert("Saved", "Your profile has been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  }

  const displayAvatar = avatarUri ?? user?.avatarUrl ?? null;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading} style={styles.saveBtn}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#1C74E9" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar picker */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {displayAvatar ? (
                <Image
                  source={{ uri: displayAvatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitial}>
                    {fullName?.[0]?.toUpperCase() ?? "?"}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraBtn} onPress={handlePickAvatar}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </View>

          {/* Fields */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor="#94a3b8"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <View style={styles.divider} />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+250788123456"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              returnKeyType="done"
            />
            <Text style={styles.fieldHint}>Include country code, e.g. +250</Text>
          </View>

          {/* Read-only info */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.readOnlyRow}>
              <Text style={styles.readOnlyValue}>{user?.email ?? "—"}</Text>
              <View style={styles.lockedBadge}>
                <Ionicons name="lock-closed" size={11} color="#94a3b8" />
                <Text style={styles.lockedText}>Cannot change</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveFullBtn, isLoading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveFullBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

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
  saveBtn: { paddingHorizontal: 4, paddingVertical: 4, minWidth: 34, alignItems: "flex-end" },
  saveBtnText: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },

  scroll: { padding: 16, paddingBottom: 40 },

  // Avatar
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarWrap: { position: "relative", marginBottom: 8 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#e2e8f0" },
  avatarFallback: {
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 34, fontWeight: "800", color: "white" },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoText: { fontSize: 13, color: "#1C74E9", fontWeight: "500" },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  input: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0f172a",
    paddingVertical: 4,
  },

  // Read-only
  readOnlyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  readOnlyValue: { fontSize: 15, fontWeight: "500", color: "#64748b" },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lockedText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  fieldHint: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  // Bottom save
  saveFullBtn: {
    backgroundColor: "#1C74E9",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveFullBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
});
