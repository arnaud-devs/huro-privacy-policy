import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  allAlreadyPickedUp: boolean;
  allCollected: boolean;
  isPickingUp: boolean;
  onStartDelivery: () => void;
  onContinueToDelivery: () => void;
}

export function PickupBottomBar({
  allAlreadyPickedUp,
  allCollected,
  isPickingUp,
  onStartDelivery,
  onContinueToDelivery,
}: Props) {
  if (allAlreadyPickedUp) {
    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.deliveryBtn}
          activeOpacity={0.85}
          onPress={onContinueToDelivery}
        >
          <Ionicons name="navigate" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.deliveryBtnText}>Continue to Delivery</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={[
          styles.deliveryBtn,
          (!allCollected || isPickingUp) && styles.deliveryBtnDisabled,
        ]}
        activeOpacity={0.85}
        onPress={onStartDelivery}
        disabled={isPickingUp}
      >
        {isPickingUp ? (
          <ActivityIndicator color="white" style={{ marginRight: 8 }} />
        ) : (
          <Ionicons
            name="bicycle-outline"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={styles.deliveryBtnText}>
          {isPickingUp
            ? "Marking as Picked Up..."
            : allCollected
            ? "Start Delivery"
            : "Collect All Items First"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  deliveryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  deliveryBtnDisabled: {
    backgroundColor: "#94A3B8",
    shadowColor: "#94A3B8",
  },
  deliveryBtnText: { fontSize: 15, fontWeight: "700", color: "white" },
});
