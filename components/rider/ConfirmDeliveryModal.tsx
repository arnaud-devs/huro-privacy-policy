import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ConfirmDeliveryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ConfirmDeliveryModal({
  visible,
  onClose,
}: ConfirmDeliveryModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCustomerNotFound = () => {
    onClose();
    router.push("/(rider)/delivery-issues");
  };

  const handleCustomerCancelled = () => {
    onClose();
    router.push("/(rider)/report-cancellation");
  };

  const handleReturnOrder = () => {
    onClose();
    router.push("/(rider)/report-return");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          <View style={styles.grabber} />

          <Text style={styles.title}>Confirm Delivery</Text>

          {/* Delivered */}
          <TouchableOpacity
            style={[styles.button, styles.btnBlue]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={[styles.btnText, { color: "#FFFFFF" }]}>
              Mark as Delivered
            </Text>
          </TouchableOpacity>

          {/* Customer Not Found */}
          <TouchableOpacity
            style={[styles.button, styles.btnGray]}
            onPress={handleCustomerNotFound}
            activeOpacity={0.85}
          >
            <Ionicons name="person-remove-outline" size={20} color="#1E293B" />
            <Text style={[styles.btnText, { color: "#1E293B" }]}>
              Customer Not Found
            </Text>
          </TouchableOpacity>

          {/* Customer Cancelled */}
          <TouchableOpacity
            style={[styles.button, styles.btnGray]}
            onPress={handleCustomerCancelled}
            activeOpacity={0.85}
          >
            <Ionicons name="close-circle-outline" size={20} color="#1E293B" />
            <Text style={[styles.btnText, { color: "#1E293B" }]}>
              Customer Cancelled
            </Text>
          </TouchableOpacity>

          {/* Return Order */}
          <TouchableOpacity
            style={[styles.button, styles.btnRed]}
            onPress={handleReturnOrder}
            activeOpacity={0.85}
          >
            <Ionicons name="archive-outline" size={20} color="#DC2626" />
            <Text style={[styles.btnText, { color: "#DC2626" }]}>
              Return Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 26,
    marginBottom: 12,
    gap: 8,
  },
  btnBlue: {
    backgroundColor: "#1C74E9",
  },
  btnGray: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnRed: {
    backgroundColor: "#FEF2F2",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  dismissBtn: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  dismissText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
