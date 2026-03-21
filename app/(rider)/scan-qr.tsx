import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyPickupSignature } from "@/store/slices/riderSlice";

export default function ScanQRScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { isVerifying } = useAppSelector((state) => state.rider);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBack = () => {
    router.replace("/(rider)/active-delivery");
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isVerifying || !orderId) return;
    setScanned(true);

    const result = await dispatch(verifyPickupSignature({ orderId, signature: data }));
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
        (result.payload as string) || "QR code does not match this order.",
        [{ text: "Try Again", onPress: () => setScanned(false) }]
      );
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", marginBottom: 16 }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.scanBtn} onPress={requestPermission}>
          <Text style={styles.scanBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Customer QR Code</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned || isVerifying ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.targetBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <View style={styles.scannerLine} />
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.grabber} />

        <Text style={styles.sectionTitle}>VERIFYING DELIVERY</Text>

        {orderId && (
          <View style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{orderId.slice(0, 6).toUpperCase()}</Text>
              <Text style={styles.customerName}>Scan customer's QR code</Text>
            </View>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={20} color="#1C74E9" />
            </View>
          </View>
        )}

        {isVerifying ? (
          <View style={[styles.scanBtn, { opacity: 0.8 }]}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Verifying...</Text>
          </View>
        ) : scanned ? (
          <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85} onPress={() => setScanned(false)}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Scan Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.scanBtn, { opacity: 0.5 }]} activeOpacity={1}>
            <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Scanning QR...</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.manualBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(rider)/manual-code-entry",
              params: { orderId: orderId ?? "" },
            })
          }
        >
          <Text style={styles.manualBtnText}>Enter Code Manually</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Ask the customer to show their order QR code found in their HuzaGo app under 'Active Orders'.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  targetBox: {
    width: 260,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#1C74E9",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  scannerLine: {
    width: "80%",
    height: 2,
    backgroundColor: "#1C74E9",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 12,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: "#1C74E9",
    fontWeight: "500",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C74E9",
    height: 52,
    borderRadius: 26,
    marginBottom: 12,
    gap: 8,
  },
  scanBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  manualBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    height: 52,
    borderRadius: 26,
    marginBottom: 24,
  },
  manualBtnText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
});
