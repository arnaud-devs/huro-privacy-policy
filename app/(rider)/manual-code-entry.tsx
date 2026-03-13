import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManualCodeEntryScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleBack = () => {
    router.replace("/(rider)/scan-qr");
  };

  const handleKeyPress = (val: string) => {
    if (val === "del") {
      setCode((prev) => prev.slice(0, -1));
    } else if (code.length < 4 && val !== "") {
      setCode((prev) => prev + val);
    }
  };

  const CodeDot = ({ char }: { char?: string }) => (
    <View style={[styles.codeBox, char ? styles.codeBoxActive : null]}>
      {char ? (
        <Text style={styles.codeText}>{char}</Text>
      ) : (
        <View style={styles.dot} />
      )}
    </View>
  );

  const KeyButton = ({ val }: { val: string }) => {
    if (val === "") return <View style={styles.keyBtnEmpty} />;
    return (
      <TouchableOpacity
        style={styles.keyBtn}
        onPress={() => handleKeyPress(val)}
        activeOpacity={0.7}
      >
        {val === "del" ? (
          <Ionicons name="backspace-outline" size={24} color="#334155" />
        ) : (
          <Text style={styles.keyText}>{val}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Pickup Code</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.contentContainer}>
        {/* Verification Info */}
        <View style={styles.topSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ORDER #1045</Text>
          </View>

          <Text style={styles.title}>Student Verification</Text>
          <Text style={styles.subtitle}>
            Ask the student for their 4-digit pickup code to complete the
            delivery.
          </Text>

          <View style={styles.codeRow}>
            <CodeDot char={code[0]} />
            <CodeDot char={code[1]} />
            <CodeDot char={code[2]} />
            <CodeDot char={code[3]} />
          </View>

          <TouchableOpacity
            style={[
              styles.mainBtn,
              code.length === 4 ? styles.mainBtnActive : styles.mainBtnInactive,
            ]}
            activeOpacity={0.85}
            onPress={() => {
              if (code.length === 4) {
                router.push("/(rider)/order-verified");
              }
            }}
          >
            <Text style={styles.mainBtnText}>Verify Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace("/(rider)/scan-qr")}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={20} color="#334155" />
            <Text style={styles.secondaryBtnText}>Back to Scanner</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Numpad */}
        <View style={styles.numpad}>
          <View style={styles.numRow}>
            <KeyButton val="1" />
            <KeyButton val="2" />
            <KeyButton val="3" />
          </View>
          <View style={styles.numRow}>
            <KeyButton val="4" />
            <KeyButton val="5" />
            <KeyButton val="6" />
          </View>
          <View style={styles.numRow}>
            <KeyButton val="7" />
            <KeyButton val="8" />
            <KeyButton val="9" />
          </View>
          <View style={styles.numRow}>
            <KeyButton val="" />
            <KeyButton val="0" />
            <KeyButton val="del" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "space-between",
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: "#1C74E9",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  codeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  codeBox: {
    width: 60,
    height: 64,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  codeBoxActive: {
    borderColor: "#1C74E9",
    backgroundColor: "#FFFFFF",
  },
  codeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#94A3B8",
  },
  mainBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainBtnActive: {
    backgroundColor: "#1C74E9",
  },
  mainBtnInactive: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  mainBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  secondaryBtnText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  numpad: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  numRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  keyBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  keyBtnEmpty: {
    flex: 1,
    height: 56,
    backgroundColor: "transparent",
  },
  keyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0F172A",
  },
});
