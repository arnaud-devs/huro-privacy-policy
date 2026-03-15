import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LeaveDeliveryModalProps {
  visible: boolean;
  onReturn: () => void;
  onGoToDashboard: () => void;
}

export function LeaveDeliveryModal({
  visible,
  onReturn,
  onGoToDashboard,
}: LeaveDeliveryModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="warning-outline"
              size={28}
              color="#1C74E9"
              style={styles.icon}
            />
          </View>

          <Text style={styles.title}>You have active deliveries.</Text>
          <Text style={styles.description}>
            Are you sure you want to leave the delivery screen? Your progress
            will remain saved.
          </Text>

          <TouchableOpacity
            style={styles.returnBtn}
            activeOpacity={0.85}
            onPress={onReturn}
          >
            <Ionicons
              name="map-outline"
              size={20}
              color="#FFFFFF"
              style={styles.btnIcon}
            />
            <Text style={styles.returnBtnText}>Return to Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardBtn}
            activeOpacity={0.85}
            onPress={onGoToDashboard}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color="#475569"
              style={styles.btnIcon}
            />
            <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>

          <View style={styles.grabber} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  returnBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#1C74E9",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  returnBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dashboardBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dashboardBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },
  btnIcon: {
    marginRight: 8,
  },
  grabber: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginTop: 4,
  },
});
