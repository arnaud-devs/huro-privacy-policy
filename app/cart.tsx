import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

type BatchSlot = "12pm" | "3pm";

const INITIAL_ITEMS = [
  {
    id: "1",
    name: "Lay's Classic",
    price: 2000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "Fresh Milk (1L)",
    price: 4500,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
  },
];

const DELIVERY_SLOTS = [
  { id: "12pm", time: "12:00 PM", label: "Morning Slot" },
  { id: "3pm", time: "3:00 PM", label: "Afternoon Slot" },
];

const DELIVERY_FEE = 1000;

function fmt(n: number) {
  return n.toLocaleString();
}

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [slot, setSlot] = useState<BatchSlot>("12pm");

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: it.qty + delta } : it))
        .filter((it) => it.qty > 0),
    );
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Your Items ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          <Text style={styles.itemCountText}>{items.length} items</Text>
        </View>

        <View style={styles.card}>
          {items.map((item, i) => (
            <View key={item.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.itemRow}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>RWF {fmt(item.price)}</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    onPress={() => updateQty(item.id, -1)}
                    style={styles.stepBtn}
                  >
                    <Ionicons name="remove" size={14} color="#0f172a" />
                  </TouchableOpacity>
                  <Text style={styles.stepCount}>{item.qty}</Text>
                  <TouchableOpacity
                    onPress={() => updateQty(item.id, 1)}
                    style={styles.stepBtn}
                  >
                    <Ionicons name="add" size={14} color="#0f172a" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Delivery Batch ── */}
        <Text style={styles.sectionTitleSpaced}>Delivery Batch</Text>
        <View style={styles.slotRow}>
          {DELIVERY_SLOTS.map((s) => {
            const active = slot === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSlot(s.id as BatchSlot)}
                style={[styles.slotCard, active && styles.slotCardActive]}
              >
                <View style={styles.slotTopRow}>
                  <Text
                    style={[styles.slotTime, active && styles.slotTimeActive]}
                  >
                    {s.time}
                  </Text>
                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#1C74E9"
                    />
                  )}
                </View>
                <Text
                  style={[styles.slotLabel, active && styles.slotLabelActive]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Pickup Point ── */}
        <Text style={styles.sectionTitleSpaced}>Pickup Point</Text>
        <TouchableOpacity style={[styles.card, styles.pickupRow]}>
          <View style={styles.pinCircle}>
            <Ionicons name="location-outline" size={22} color="#1C74E9" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pickupName}>Main Gate</Text>
            <Text style={styles.pickupAddr}>
              University Avenue, South Entrance
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        {/* ── Order Summary ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{fmt(subtotal)} RWF</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{fmt(DELIVERY_FEE)} RWF</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={[styles.summaryRow, { marginBottom: 0 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{fmt(total)} RWF</Text>
          </View>
        </View>

        {/* ── Confirm CTA ── */}
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/order-checkout",
              params: {
                subtotal: String(subtotal),
                itemName: items[0]?.name ?? "",
                itemImage: items[0]?.image ?? "",
              },
            })
          }
        >
          <Text style={styles.confirmText}>Confirm Order</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <Text style={styles.terms}>
          By clicking "Confirm Order" you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text>
        </Text>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 34, height: 34, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },

  scroll: { padding: 16 },

  // Section headers
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  sectionTitleSpaced: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 24,
    marginBottom: 12,
  },
  itemCountText: { fontSize: 14, fontWeight: "600", color: "#1C74E9" },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },

  // Item row
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  itemPrice: { fontSize: 13, color: "#64748b" },

  // Stepper
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    minWidth: 16,
    textAlign: "center",
  },

  // Delivery batch slots
  slotRow: { flexDirection: "row", gap: 12 },
  slotCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "white",
  },
  slotCardActive: { borderColor: "#1C74E9", backgroundColor: "#eff6ff" },
  slotTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  slotTime: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  slotTimeActive: { color: "#1C74E9" },
  slotLabel: { fontSize: 12, color: "#64748b" },
  slotLabelActive: { color: "#1C74E9" },

  // Pickup point
  pickupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  pinCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  pickupName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  pickupAddr: { fontSize: 12, color: "#64748b", lineHeight: 17 },

  // Summary
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: "#64748b" },
  summaryValue: { fontSize: 14, color: "#0f172a" },
  summaryDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#1C74E9" },

  // CTA
  confirmBtn: {
    flexDirection: "row",
    backgroundColor: "#1C74E9",
    borderRadius: 14,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  confirmText: { fontSize: 16, fontWeight: "700", color: "white" },

  // Footer
  terms: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 14,
    lineHeight: 18,
  },
  termsLink: { color: "#1C74E9" },
});
