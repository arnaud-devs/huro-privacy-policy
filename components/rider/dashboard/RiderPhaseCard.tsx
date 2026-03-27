import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  apiLoaded: boolean;
  deliveryPhase: string;
  claimedOrderIds: string[];
  currentBatchId: string | null;
  deliveredOrderIds: string[];
  pickedUpOrderIds: string[];
  inDeliveryCount: number;
  pickedUpCount: number;
  assignedCount: number;
}

export function RiderPhaseCard({
  apiLoaded,
  deliveryPhase,
  claimedOrderIds,
  currentBatchId,
  deliveredOrderIds,
  pickedUpOrderIds,
  inDeliveryCount,
  pickedUpCount,
  assignedCount,
}: Props) {
  const router = useRouter();

  // ── Fallback: API not yet loaded, use persisted Redux state ──
  if (!apiLoaded) {
    if (deliveryPhase === "delivering" || deliveryPhase === "arrived") {
      return (
        <PhaseCard color="#1C74E9" icon="bicycle" title="Delivering Orders"
          subtitle={`${claimedOrderIds.length} pending · ${deliveredOrderIds.length} delivered`}
          ctaLabel="Continue Delivery" ctaIcon="navigate"
          onPress={() => router.push("/(rider)/active-delivery")}
        />
      );
    }
    if (deliveryPhase === "picking_up" && currentBatchId) {
      const allPickedUp = claimedOrderIds.every((id) => pickedUpOrderIds.includes(id));
      return (
        <PhaseCard color="#F59E0B" icon="bag-handle"
          title={allPickedUp ? "Ready to Deliver" : "Picking Up Orders"}
          subtitle={`${claimedOrderIds.length} order(s) assigned`}
          ctaLabel={allPickedUp ? "Continue to Dispatch" : "Continue Pickup"}
          ctaIcon="arrow-forward"
          onPress={() => router.push({ pathname: "/(rider)/pickup-batch", params: { batchId: currentBatchId } })}
        />
      );
    }
    return null;
  }

  // ── API loaded: drive from real order statuses ──
  if (inDeliveryCount > 0) {
    const pending = inDeliveryCount - deliveredOrderIds.length;
    return (
      <PhaseCard color="#1C74E9" icon="bicycle" title="Delivering Orders"
        subtitle={`${pending} pending · ${deliveredOrderIds.length} delivered`}
        ctaLabel="Continue Delivery" ctaIcon="navigate"
        onPress={() => router.push("/(rider)/active-delivery")}
      />
    );
  }

  if (pickedUpCount > 0) {
    return (
      <PhaseCard color="#1C74E9" icon="bag-check" title="Ready to Deliver"
        subtitle={`${pickedUpCount} order(s) picked up`}
        ctaLabel="Continue to Dispatch" ctaIcon="arrow-forward"
        onPress={() => router.push({ pathname: "/(rider)/pickup-batch", params: { batchId: currentBatchId ?? "" } })}
      />
    );
  }

  if (assignedCount > 0) {
    return (
      <PhaseCard color="#F59E0B" icon="bag-handle" title="Picking Up Orders"
        subtitle={`${assignedCount} order(s) assigned to you`}
        ctaLabel="Continue Pickup" ctaIcon="arrow-forward"
        onPress={() => router.push({ pathname: "/(rider)/pickup-batch", params: { batchId: currentBatchId ?? "" } })}
      />
    );
  }

  return null;
}

interface PhaseCardProps {
  color: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaIcon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}

function PhaseCard({ color, icon, title, subtitle, ctaLabel, ctaIcon, onPress }: PhaseCardProps) {
  return (
    <View style={[styles.phaseCard, { borderColor: color }]}>
      <View style={styles.phaseIconWrap}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.phaseTitle}>{title}</Text>
      <Text style={styles.phaseSubtitle}>{subtitle}</Text>
      <TouchableOpacity
        style={[styles.phaseCta, { backgroundColor: color }]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <Ionicons name={ctaIcon} size={18} color="white" style={{ marginRight: 6 }} />
        <Text style={styles.phaseCtaText}>{ctaLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  phaseCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  phaseIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  phaseTitle: { fontSize: 17, fontWeight: "800", color: "#0F172A" },
  phaseSubtitle: { fontSize: 13, color: "#64748B", marginTop: 4 },
  phaseCta: {
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 14,
    minWidth: 200,
  },
  phaseCtaText: { fontSize: 14, fontWeight: "700", color: "white" },
});
