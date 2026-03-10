import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountCreatedScreen() {
  const router = useRouter();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // route to tabs or dashboard
      router.push("/(tabs)");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Blue top border gradient look-alike */}
          <View style={styles.topBar} />

          <View style={styles.content}>
            {/* Success Icon */}
            <View style={styles.iconGlow}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark" size={40} color="#1C74E9" />
              </View>
            </View>

            {/* Titles */}
            <Text style={styles.title}>Account Created!</Text>
            <Text style={styles.subtitle}>
              Welcome to <Text style={styles.linkText}>One Campus</Text>, Alex!
              {"\n"}
              Your journey to a smarter campus{"\n"}life starts now.
            </Text>

            {/* ID Card */}
            <View style={styles.idCard}>
              <View style={styles.avatarContainer}>
                {/* Mock avatar using an icon */}
                <Ionicons
                  name="person"
                  size={24}
                  color="#64748B"
                  style={styles.avatarIcon}
                />
              </View>
              <View style={styles.idInfo}>
                <Text style={styles.idName}>Alex Thompson</Text>
                <Text style={styles.idNumber}>Student ID: #88294</Text>
              </View>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Active</Text>
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.redirectText}>
              Redirecting to dashboard in 5 seconds...
            </Text>
          </View>

          {/* Bottom Gradient overlay */}
          <View style={styles.bottomOverlay} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help getting started?{" "}
            <Text style={styles.helpLink}>Visit Help Center</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    overflow: "hidden",
    position: "relative",
  },
  topBar: {
    height: 6,
    backgroundColor: "#1C74E9",
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  iconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(28, 116, 233, 0.1)", // Light blue glow
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C74E9",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  linkText: {
    color: "#1C74E9",
  },
  idCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE4E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarIcon: {
    marginTop: 4,
  },
  idInfo: {
    flex: 1,
  },
  idName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 13,
    color: "#64748B",
  },
  badgeContainer: {
    backgroundColor: "#DCFCE7", // Light green background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#166534", // Dark green text
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#1C74E9",
    borderRadius: 24,
    height: 52,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  redirectText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(239, 246, 255, 0.4)", // Light blue gradient effect
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  helpLink: {
    color: "#1C74E9",
  },
});
