import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyPickupSignature } from "@/store/slices/riderSlice";

const CODE_LENGTH = 6;

export default function ManualCodeEntryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { isVerifying } = useAppSelector((state) => state.rider);
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleBack = () => {
    router.replace({
      pathname: "/(rider)/scan-qr",
      params: { orderId: orderId ?? "" },
    });
  };

  const handleChangeText = (text: string) => {
    const filtered = text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(filtered);
  };

  async function handleVerify() {
    if (code.length < CODE_LENGTH || !orderId || isVerifying) return;
    const result = await dispatch(verifyPickupSignature({ orderId, signature: code }));
    if (verifyPickupSignature.fulfilled.match(result) && result.payload.valid) {
      router.push({
        pathname: "/(rider)/order-verified",
        params: {
          orderId,
          customerName: result.payload.order.customerName,
        },
      });
    } else {
      Alert.alert(
        "Invalid Code",
        (result.payload as string) || "The code does not match. Please try again.",
        [{ text: "Try Again", onPress: () => setCode("") }]
      );
    }
  }

  const CodeBox = ({ char }: { char?: string }) => (
    <View style={[styles.codeBox, char ? styles.codeBoxActive : null]}>
      {char ? (
        <Text style={styles.codeText}>{char}</Text>
      ) : (
        <View style={styles.dot} />
      )}
    </View>
  );

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
        <View style={styles.topSection}>
          {orderId ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ORDER #{orderId.slice(0, 6).toUpperCase()}</Text>
            </View>
          ) : null}

          <Text style={styles.title}>Pickup Verification</Text>
          <Text style={styles.subtitle}>
            Ask the customer for their 6-character pickup code to complete the delivery.
          </Text>

          {/* Hidden TextInput captures keyboard input */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={handleChangeText}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={CODE_LENGTH}
            keyboardType="default"
          />

          {/* Code boxes — tap to focus the input */}
          <TouchableOpacity
            style={styles.codeRow}
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            <CodeBox char={code[0]} />
            <CodeBox char={code[1]} />
            <CodeBox char={code[2]} />
            <CodeBox char={code[3]} />
            <CodeBox char={code[4]} />
            <CodeBox char={code[5]} />
          </TouchableOpacity>

          <Text style={styles.tapHint}>Tap the boxes to enter the code</Text>

          <TouchableOpacity
            style={[
              styles.mainBtn,
              code.length === CODE_LENGTH && !isVerifying ? styles.mainBtnActive : styles.mainBtnInactive,
            ]}
            activeOpacity={0.85}
            onPress={handleVerify}
            disabled={code.length < CODE_LENGTH || isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.mainBtnText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() =>
              router.replace({
                pathname: "/(rider)/scan-qr",
                params: { orderId: orderId ?? "" },
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={20} color="#334155" />
            <Text style={styles.secondaryBtnText}>Back to Scanner</Text>
          </TouchableOpacity>
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
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 48,
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
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  codeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  codeBox: {
    width: 54,
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
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#94A3B8",
  },
  tapHint: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 36,
  },
  mainBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mainBtnActive: {
    backgroundColor: "#1C74E9",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainBtnInactive: {
    backgroundColor: "#94A3B8",
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
});
