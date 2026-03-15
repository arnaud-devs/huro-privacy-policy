import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PICKUP_STOPS = [
  { name: "Nyabugogo Logistics Hub", orders: 6 },
  { name: "Printing Shop", orders: 3 },
  { name: "Electronics Stall", orders: 3 },
];

export default function RiderHomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  const deliveriesToday = 24;
  const deliveriesGoal = 30;
  const progress = deliveriesToday / deliveriesGoal;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#64748b" />
          </View>
          <View>
            <Text style={styles.greetingSub}>Good morning,</Text>
            <Text style={styles.greetingName}>Eric</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* Online / Offline toggle */}
      <View style={styles.toggleWrap}>
        <TouchableOpacity
          style={[styles.toggleBtn, !isOnline && styles.toggleBtnActive]}
          onPress={() => setIsOnline(false)}
        >
          <Text style={[styles.toggleText, !isOnline && styles.toggleTextActive]}>
            OFFLINE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, isOnline && styles.toggleBtnActive]}
          onPress={() => setIsOnline(true)}
        >
          <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
            ONLINE
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Current Batch card */}
        <View style={styles.batchCard}>
          <View style={styles.batchHeader}>
            <Text style={styles.batchTitle}>Current Batch</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>PRIORITY</Text>
            </View>
          </View>

          <Text style={styles.pickupTime}>Pickup: 11:30 AM (18 mins)</Text>
          <Text style={styles.ordersTotal}>12 Orders Total</Text>

          {/* Route */}
          <View style={styles.routeWrap}>
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, { backgroundColor: "#1C74E9" }]} />
              <View>
                <Text style={styles.routeLabel}>PICKUP FROM</Text>
                <Text style={styles.routeLocation}>Nyabugogo Logistics Hub</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, { backgroundColor: "#22c55e" }]} />
              <View>
                <Text style={styles.routeLabel}>DELIVER TO</Text>
                <Text style={styles.routeLocation}>UR CST Main Gate</Text>
              </View>
            </View>
          </View>

          {/* Start Pickup button */}
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(rider)/pickup-batch")}
          >
            <Ionicons name="navigate-outline" size={18} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.startBtnText}>Start Pickup</Text>
          </TouchableOpacity>

          {/* Pickup Stops */}
          <View style={styles.stopsSection}>
            <Text style={styles.stopsTitle}>PICKUP STOPS</Text>
            {PICKUP_STOPS.map((stop, i) => (
              <View key={i} style={styles.stopRow}>
                <View style={styles.stopDot} />
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopOrders}>{stop.orders} orders</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {/* Deliveries today */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DELIVERIES TODAY</Text>
            <Text style={styles.statValue}>
              {deliveriesToday}{" "}
              <Text style={styles.statGoal}>/ {deliveriesGoal}</Text>
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>

          {/* Today's pay */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TODAY'S PAY</Text>
            <Text style={styles.statValue}>128,400</Text>
            <Text style={styles.statCurrency}>RWF</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f1f5f9" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  greetingSub: { fontSize: 12, color: "#64748b" },
  greetingName: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Toggle
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "white" },
  toggleText: { fontSize: 12, fontWeight: "700", color: "#94a3b8" },
  toggleTextActive: { color: "#0f172a" },

  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  // Batch card
  batchCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  batchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  batchTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  priorityBadge: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityText: { fontSize: 11, fontWeight: "700", color: "#1C74E9" },

  pickupTime: { fontSize: 22, fontWeight: "800", color: "#1C74E9", marginBottom: 4 },
  ordersTotal: { fontSize: 13, color: "#64748b", marginBottom: 16 },

  // Route
  routeWrap: { marginBottom: 20 },
  routeRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#e2e8f0",
    marginLeft: 5,
    marginVertical: 4,
  },
  routeLabel: { fontSize: 10, fontWeight: "700", color: "#94a3b8", letterSpacing: 0.5 },
  routeLocation: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  // Start button
  startBtn: {
    backgroundColor: "#1C74E9",
    borderRadius: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: { fontSize: 16, fontWeight: "700", color: "white" },

  // Stops
  stopsSection: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  stopsTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1C74E9",
    marginRight: 12,
  },
  stopName: { flex: 1, fontSize: 14, color: "#0f172a", fontWeight: "500" },
  stopOrders: { fontSize: 13, color: "#64748b" },

  // Stats
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  statGoal: { fontSize: 16, fontWeight: "600", color: "#94a3b8" },
  statCurrency: { fontSize: 12, fontWeight: "600", color: "#64748b", marginTop: 2 },
  progressTrack: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1C74E9",
    borderRadius: 3,
  },
});
