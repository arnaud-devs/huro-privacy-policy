import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
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
import { updateProfile } from "@/store/slices/userSlice";
import { placeOrder, clearPendingOrder } from "@/store/slices/ordersSlice";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.user);
  const pendingOrder = useAppSelector((state) => state.orders.pendingOrder);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  async function pickAvatar() {
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

  async function handleComplete() {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Please enter your full name and phone number.");
      return;
    }

    const result = await dispatch(
      updateProfile({ fullName: fullName.trim(), phone: phone.trim(), avatarUri: avatarUri ?? undefined })
    );

    if (updateProfile.fulfilled.match(result)) {
      if (pendingOrder) {
        const orderResult = await dispatch(placeOrder(pendingOrder));
        dispatch(clearPendingOrder());
        if (placeOrder.fulfilled.match(orderResult)) {
          router.replace("/orders/order-status");
        } else {
          const msg = (orderResult.payload as string) || "Failed to place order.";
          Alert.alert("Order Failed", msg);
          router.replace("/(tabs)");
        }
      } else {
        router.replace("/(tabs)");
      }
    } else {
      Alert.alert("Error", (result.payload as string) || "Failed to update profile.");
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Profile</Text>
            <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>
              Set your name and a profile photo to get started.
            </Text>

            {/* Avatar picker */}
            <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera-outline" size={28} color="#94a3b8" />
                  <Text style={styles.avatarHint}>Add photo</Text>
                </View>
              )}
              <View style={styles.cameraCircle}>
                <Ionicons name="camera" size={14} color="white" />
              </View>
            </TouchableOpacity>

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color="#8D94A2" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A5B1"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Ionicons name="call-outline" size={20} color="#8D94A2" />
              <TextInput
                style={styles.input}
                placeholder="e.g. 0788123456"
                placeholderTextColor="#A0A5B1"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleComplete}
              />
            </View>

            <Text style={styles.terms}>
              By continuing you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Complete Profile</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={styles.skipFooterBtn}
          >
            <Text style={styles.skipFooterText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  scroll: { flexGrow: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { width: 34, height: 34, justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },

  body: { paddingHorizontal: 24, paddingTop: 12, flex: 1 },

  title: { fontSize: 28, fontWeight: "700", color: "#0f172a", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#64748b", marginBottom: 36, lineHeight: 22 },

  // Avatar
  avatarWrap: {
    alignSelf: "center",
    marginBottom: 36,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: { fontSize: 11, color: "#94a3b8", marginTop: 4 },
  cameraCircle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  // Input
  label: { fontSize: 13, fontWeight: "600", color: "#0f172a", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    backgroundColor: "#f8fafc",
    marginBottom: 32,
  },
  input: { flex: 1, fontSize: 15, color: "#0f172a" },

  terms: { fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 20 },
  termsLink: { color: "#1C74E9" },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  btn: {
    backgroundColor: "#1C74E9",
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },

  skipBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  skipText: { fontSize: 14, fontWeight: "600", color: "#94a3b8" },

  skipFooterBtn: { alignItems: "center", paddingVertical: 12 },
  skipFooterText: { fontSize: 14, color: "#94a3b8", fontWeight: "500" },
});
