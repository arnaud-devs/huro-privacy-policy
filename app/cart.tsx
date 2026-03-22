import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart, adjustQuantity, clearCart, updateCartItem, removeCartItem } from "@/store/slices/cartSlice";
import { fetchProducts } from "@/store/slices/productsSlice";
import { fetchOpenBatches, Batch } from "@/store/slices/batchesSlice";
import { fetchDeliveryZones, DeliveryZone } from "@/store/slices/deliveryZonesSlice";
import { fetchGates, Gate } from "@/store/slices/gatesSlice";

const DELIVERY_FEE = 1000;

function fmt(n: number | undefined | null) {
  return (n ?? 0).toLocaleString();
}

function formatScheduledAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function CartScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, itemCount, isLoading, isClearing, error } = useAppSelector(
    (state) => state.cart
  );
  const allProducts = useAppSelector((state) => state.products.products);
  const { batches, isLoading: batchesLoading } = useAppSelector((state) => state.batches);
  const { zones, isLoading: zonesLoading } = useAppSelector((state) => state.deliveryZones);
  const { gates, isLoading: gatesLoading } = useAppSelector((state) => state.gates);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showGatePicker, setShowGatePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchProducts({}));
    dispatch(fetchOpenBatches());
    dispatch(fetchDeliveryZones());
  }, [dispatch]);

  // Auto-select first batch when batches load
  useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0]);
    }
  }, [batches]);

  // Auto-select first zone when zones load, then fetch its gates
  useEffect(() => {
    if (zones.length > 0 && !selectedZone) {
      const first = zones[0];
      setSelectedZone(first);
      dispatch(fetchGates(first.id));
    }
  }, [zones]);

  // When zone changes manually, reset gate and fetch new gates
  function handleZoneSelect(zone: DeliveryZone) {
    setSelectedZone(zone);
    setSelectedGate(null);
    setShowZonePicker(false);
    dispatch(fetchGates(zone.id));
  }

  const deliveryFee = selectedZone?.deliveryFee ?? DELIVERY_FEE;
  const total = (subtotal ?? 0) + deliveryFee;

  function handleStepQty(productId: string, currentQty: number, delta: number) {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch(removeCartItem(productId));
    } else {
      dispatch(adjustQuantity({ productId, delta }));
      dispatch(updateCartItem({ productId, quantity: newQty }));
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 34 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1C74E9" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={{ width: 34 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchCart())}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {items.length > 0 ? (
          <TouchableOpacity
            onPress={() => dispatch(clearCart())}
            disabled={isClearing}
            style={styles.clearBtn}
          >
            {isClearing ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text style={styles.clearBtnText}>Clear</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="cart-outline" size={56} color="#cbd5e1" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Your Items ── */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            <Text style={styles.itemCountText}>{itemCount} items</Text>
          </View>

          <View style={styles.card}>
            {items.map((item, i) => {
              const fullProduct = allProducts.find((p) => p.id === item.productId);
              const name = fullProduct?.name ?? item.product?.name ?? "Unknown product";
              const imageUri = fullProduct?.imageUrls?.[0] ?? item.product?.imageUrls?.[0];
              const price = item.unitPrice > 0
                ? item.unitPrice
                : parseFloat(fullProduct?.price ?? "0");
              return (
                <View key={item.productId}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.itemRow}>
                    <Image
                      source={imageUri ? { uri: imageUri } : undefined}
                      style={styles.itemImage}
                      contentFit="cover"
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        RWF {fmt(price)}
                      </Text>
                    </View>
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        onPress={() => dispatch(removeCartItem(item.productId))}
                        style={styles.trashBtn}
                      >
                        <Ionicons name="trash-outline" size={15} color="#ef4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleStepQty(item.productId, item.quantity, -1)}
                        style={styles.stepBtn}
                      >
                        <Ionicons name="remove" size={14} color="#0f172a" />
                      </TouchableOpacity>
                      <Text style={styles.stepCount}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => handleStepQty(item.productId, item.quantity, 1)}
                        style={styles.stepBtn}
                      >
                        <Ionicons name="add" size={14} color="#0f172a" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Delivery Batch ── */}
          <Text style={styles.sectionTitleSpaced}>Delivery Batch</Text>
          {batchesLoading ? (
            <ActivityIndicator size="small" color="#1C74E9" style={{ marginVertical: 12 }} />
          ) : batches.length === 0 ? (
            <View style={styles.noBatchCard}>
              <Ionicons name="time-outline" size={20} color="#94a3b8" />
              <Text style={styles.noBatchText}>No open batches available right now</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingRight: 4 }}
            >
              {batches.map((batch) => {
                const active = selectedBatch?.id === batch.id;
                const isFull = batch.slotsRemaining === 0;
                return (
                  <TouchableOpacity
                    key={batch.id}
                    onPress={() => !isFull && setSelectedBatch(batch)}
                    disabled={isFull}
                    style={[
                      styles.slotCard,
                      active && styles.slotCardActive,
                      isFull && styles.slotCardDisabled,
                    ]}
                  >
                    <View style={styles.slotTopRow}>
                      <Text style={[styles.slotTime, active && styles.slotTimeActive]}>
                        {batch.slotLabel}
                      </Text>
                      {active && (
                        <Ionicons name="checkmark-circle" size={18} color="#1C74E9" />
                      )}
                    </View>
                    <Text style={[styles.slotLabel, active && styles.slotLabelActive]}>
                      {formatScheduledAt(batch.scheduledAt)}
                    </Text>
                    <View style={styles.fillRow}>
                      <View style={styles.fillBarBg}>
                        <View
                          style={[
                            styles.fillBarFg,
                            {
                              width: `${batch.fillPercent}%` as any,
                              backgroundColor: batch.fillPercent >= 80 ? "#ef4444" : "#1C74E9",
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.slotsText}>
                        {isFull ? "Full" : `${batch.slotsRemaining} left`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* ── Campus ── */}
          <Text style={styles.sectionTitleSpaced}>Campus</Text>
          {zonesLoading ? (
            <ActivityIndicator size="small" color="#1C74E9" style={{ marginVertical: 12 }} />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.card, styles.pickupRow]}
                onPress={() => setShowZonePicker((v) => !v)}
              >
                <View style={styles.pinCircle}>
                  <Ionicons name="business-outline" size={22} color="#1C74E9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickupName}>
                    {selectedZone ? selectedZone.name : "Select campus"}
                  </Text>
                  {selectedZone && (
                    <Text style={styles.pickupAddr}>
                      {selectedZone.pickupLabel} · RWF {selectedZone.deliveryFee.toLocaleString()} fee
                    </Text>
                  )}
                </View>
                <Ionicons
                  name={showZonePicker ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>

              {showZonePicker && (
                <View style={styles.zoneList}>
                  {zones.map((zone, i) => {
                    const active = selectedZone?.id === zone.id;
                    return (
                      <TouchableOpacity
                        key={zone.id}
                        style={[
                          styles.zoneItem,
                          i < zones.length - 1 && styles.zoneItemBorder,
                          active && styles.zoneItemActive,
                        ]}
                        onPress={() => handleZoneSelect(zone)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.zoneName, active && styles.zoneNameActive]}>
                            {zone.name}
                          </Text>
                          <Text style={styles.zoneLabel}>
                            {zone.pickupLabel} · {zone.type}
                          </Text>
                        </View>
                        <View style={styles.zoneFeeBox}>
                          <Text style={styles.zoneFee}>
                            RWF {zone.deliveryFee.toLocaleString()}
                          </Text>
                        </View>
                        {active && (
                          <Ionicons name="checkmark-circle" size={18} color="#1C74E9" style={{ marginLeft: 8 }} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {/* ── Gate ── */}
          {selectedZone && (
            <>
              <Text style={styles.sectionTitleSpaced}>Gate</Text>
              {gatesLoading ? (
                <ActivityIndicator size="small" color="#1C74E9" style={{ marginVertical: 12 }} />
              ) : gates.length === 0 ? (
                <View style={styles.noBatchCard}>
                  <Ionicons name="location-outline" size={20} color="#94a3b8" />
                  <Text style={styles.noBatchText}>No gates available for this campus</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.card, styles.pickupRow]}
                    onPress={() => setShowGatePicker((v) => !v)}
                  >
                    <View style={styles.pinCircle}>
                      <Ionicons name="location-outline" size={22} color="#1C74E9" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pickupName}>
                        {selectedGate ? selectedGate.name : "Select a gate"}
                      </Text>
                    </View>
                    <Ionicons
                      name={showGatePicker ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>

                  {showGatePicker && (
                    <View style={styles.zoneList}>
                      {gates.map((gate, i) => {
                        const active = selectedGate?.id === gate.id;
                        return (
                          <TouchableOpacity
                            key={gate.id}
                            style={[
                              styles.zoneItem,
                              i < gates.length - 1 && styles.zoneItemBorder,
                              active && styles.zoneItemActive,
                            ]}
                            onPress={() => {
                              setSelectedGate(gate);
                              setShowGatePicker(false);
                            }}
                          >
                            <Text style={[styles.zoneName, active && styles.zoneNameActive]}>
                              {gate.name}
                            </Text>
                            {active && (
                              <Ionicons name="checkmark-circle" size={18} color="#1C74E9" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Order Summary ── */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{fmt(subtotal)} RWF</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{fmt(deliveryFee)} RWF</Text>
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
                  batchId: selectedBatch?.id ?? "",
                  deliveryZoneId: selectedZone?.id ?? "",
                  gateId: selectedGate?.id ?? "",
                  deliveryFee: String(selectedZone?.deliveryFee ?? DELIVERY_FEE),
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
      )}
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
  clearBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  clearBtnText: { fontSize: 14, fontWeight: "600", color: "#ef4444" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },

  scroll: { padding: 16 },

  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 15, color: "#94a3b8", fontWeight: "600" },
  errorText: { fontSize: 14, color: "#ef4444", textAlign: "center", paddingHorizontal: 24 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#1C74E9",
    borderRadius: 10,
  },
  retryText: { color: "white", fontWeight: "700", fontSize: 14 },

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
  trashBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
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

  // Zone picker
  zoneList: {
    backgroundColor: "white",
    borderRadius: 14,
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  zoneItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  zoneItemBorder: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  zoneItemActive: { backgroundColor: "#eff6ff" },
  zoneName: { fontSize: 14, fontWeight: "600", color: "#0f172a", marginBottom: 2 },
  zoneNameActive: { color: "#1C74E9" },
  zoneLabel: { fontSize: 12, color: "#64748b" },
  zoneFeeBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  zoneFee: { fontSize: 12, fontWeight: "700", color: "#0f172a" },

  // No batches
  noBatchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  noBatchText: { fontSize: 13, color: "#94a3b8" },

  // Batch slot disabled
  slotCardDisabled: { opacity: 0.45 },

  // Fill bar
  fillRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  fillBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  fillBarFg: { height: 4, borderRadius: 4 },
  slotsText: { fontSize: 10, fontWeight: "600", color: "#64748b" },
});
