import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LeaveDeliveryModalProps {
  visible: boolean;
  pendingCount: number;
  onStay: () => void;
  onLeave: () => void;
}

export function LeaveDeliveryModal({
  visible,
  pendingCount,
  onStay,
  onLeave,
}: LeaveDeliveryModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Ionicons name="warning" size={40} color="#F59E0B" />
        <Text style={styles.modalTitle}>Leave Delivery?</Text>
        <Text style={styles.modalText}>
          You have {pendingCount} undelivered order(s). Are you sure you want to
          leave?
        </Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancelBtn} onPress={onStay}>
            <Text style={styles.modalCancelText}>Stay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalLeaveBtn} onPress={onLeave}>
            <Text style={styles.modalLeaveText}>Leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  modalText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  modalLeaveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  modalLeaveText: { fontSize: 14, fontWeight: "700", color: "white" },
});
