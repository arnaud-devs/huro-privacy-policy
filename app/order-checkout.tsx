import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { placeOrder, clearOrderError, setPendingOrder } from "@/store/slices/ordersSlice";
import { fetchUserProfile } from "@/store/slices/userSlice";

function fmt(n: number) {
  return n.toLocaleString();
}

export default function OrderCheckoutScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isPlacing } = useAppSelector((state) => state.orders);
  const cartItems = useAppSelector((state) => state.cart.items);
  const allProducts = useAppSelector((state) => state.products.products);

  const params = useLocalSearchParams<{
    subtotal: string;
    batchId: string;
    deliveryZoneId: string;
    deliveryFee: string;
  }>();

  const subtotal = params.subtotal ? Number(params.subtotal) : 0;
  const deliveryFee = params.deliveryFee ? Number(params.deliveryFee) : 1000;
  const total = subtotal + deliveryFee;

  const firstItem = cartItems[0];
  const firstProduct = firstItem
    ? allProducts.find((p) => p.id === firstItem.productId)
    : null;
  const itemName = firstProduct?.name ?? firstItem?.product?.name ?? "Your order";
  const itemImage = firstProduct?.imageUrls?.[0] ?? firstItem?.product?.imageUrls?.[0];

  const [momoPhone, setMomoPhone] = useState("");
  const [momoName, setMomoName] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  async function handlePlaceOrder() {
    if (!momoPhone.trim() || !momoName.trim()) {
      Alert.alert("Missing details", "Please enter your MoMo phone number and name.");
      return;
    }
    if (!params.batchId) {
      Alert.alert("No batch selected", "Please go back and select a delivery batch.");
      return;
    }
    if (!params.deliveryZoneId) {
      Alert.alert("No pickup point", "Please go back and select a pickup point.");
      return;
    }

    dispatch(clearOrderError());

    const items = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const result = await dispatch(
      placeOrder({
        items,
        batchId: params.batchId,
        deliveryZoneId: params.deliveryZoneId,
        momoName: momoName.trim(),
        momoPhone: momoPhone.trim(),
        deliveryNote: deliveryNote.trim() || undefined,
      })
    );

    if (placeOrder.fulfilled.match(result)) {
      router.replace("/orders/order-status");
    } else {
      const msg = (result.payload as string) ?? "";
      if (msg.toLowerCase().includes("profile")) {
        // Refresh user from server — Redux state may be stale
        const profileResult = await dispatch(fetchUserProfile());
        const updatedUser = fetchUserProfile.fulfilled.match(profileResult)
          ? profileResult.payload.data
          : null;

        if (updatedUser?.profileComplete) {
          // Profile is actually complete on server — retry the order
          const retryResult = await dispatch(placeOrder({
            items,
            batchId: params.batchId,
            deliveryZoneId: params.deliveryZoneId,
            momoName: momoName.trim(),
            momoPhone: momoPhone.trim(),
            deliveryNote: deliveryNote.trim() || undefined,
          }));
          if (placeOrder.fulfilled.match(retryResult)) {
            router.replace("/orders/order-status");
          } else {
            Alert.alert("Order Failed", (retryResult.payload as string) || "Please try again.");
          }
        } else {
          // Profile genuinely incomplete — save order and redirect
          dispatch(setPendingOrder({
            items,
            batchId: params.batchId,
            deliveryZoneId: params.deliveryZoneId,
            momoName: momoName.trim(),
            momoPhone: momoPhone.trim(),
            deliveryNote: deliveryNote.trim() || undefined,
          }));
          router.push("/profile-setup");
        }
      } else {
        Alert.alert("Order Failed", msg || "Failed to place order. Please try again.");
      }
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── ORDER SUMMARY ── */}
          <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>

          <View style={styles.card}>
            <View style={styles.productRow}>
              <Image
                source={itemImage ? { uri: itemImage } : undefined}
                style={styles.productThumb}
                contentFit="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {itemName}
                  {cartItems.length > 1 ? ` +${cartItems.length - 1} more` : ""}
                </Text>
                <Text style={styles.productPrice}>Subtotal: {fmt(subtotal)} RWF</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{fmt(subtotal)} RWF</Text>
            </View>
            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{fmt(deliveryFee)} RWF</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={[styles.summaryRow, { marginBottom: 0 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{fmt(total)} RWF</Text>
            </View>
          </View>

          {/* ── PAYMENT METHOD ── */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>PAYMENT METHOD</Text>

          <View style={styles.paymentOption}>
            <View style={styles.mmIcon}>
              <MaterialIcons name="phone-android" size={22} color="white" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Mobile Money (MoMo)</Text>
              <Text style={styles.paymentSub}>Pay via MTN Mobile Money</Text>
            </View>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color="white" />
            </View>
          </View>

          {/* MoMo Phone */}
          <Text style={styles.fieldLabel}>MoMo Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 0788123456"
            placeholderTextColor="#94a3b8"
            value={momoPhone}
            onChangeText={setMomoPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          {/* MoMo Name */}
          <Text style={styles.fieldLabel}>Name on MoMo Account</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. JOHN DOE"
            placeholderTextColor="#94a3b8"
            value={momoName}
            onChangeText={setMomoName}
            autoCapitalize="characters"
            returnKeyType="next"
          />

          {/* Delivery Note (optional) */}
          <Text style={styles.fieldLabel}>Delivery Note <Text style={styles.optional}>(optional)</Text></Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Any special instructions..."
            placeholderTextColor="#94a3b8"
            value={deliveryNote}
            onChangeText={setDeliveryNote}
            multiline
            numberOfLines={3}
            returnKeyType="done"
          />

          <View style={styles.secureBadge}>
            <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
            <Text style={styles.secureText}>Secure Payment Processing</Text>
          </View>
        </ScrollView>

        {/* ── FOOTER CTA ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaButton, isPlacing && styles.ctaDisabled]}
            activeOpacity={0.85}
            onPress={handlePlaceOrder}
            disabled={isPlacing}
          >
            {isPlacing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.ctaText}>Pay &amp; Place Order</Text>
                <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.terms}>
            By clicking "Pay &amp; Place Order", you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { padding: 16, paddingBottom: 20 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  productRow: { flexDirection: "row", alignItems: "flex-start" },
  productThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: "#f1f5f9" },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: "700", color: "#0f172a", marginBottom: 3 },
  productPrice: { fontSize: 13, fontWeight: "600", color: "#1C74E9" },

  summaryDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: "#64748b" },
  summaryValue: { fontSize: 14, color: "#0f172a" },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  totalValue: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1C74E9",
    padding: 14,
    marginBottom: 18,
  },
  mmIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: { flex: 1, marginLeft: 12 },
  paymentName: { fontSize: 14, fontWeight: "700", color: "#0f172a" },
  paymentSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },

  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#0f172a", marginBottom: 8 },
  optional: { fontSize: 12, fontWeight: "400", color: "#94a3b8" },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 16,
  },
  inputMultiline: { height: 80, textAlignVertical: "top" },

  secureBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
  secureText: { fontSize: 12, color: "#94a3b8", marginLeft: 5 },

  footer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: "#1C74E9",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontSize: 16, fontWeight: "700", color: "white" },
  terms: { textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 10, lineHeight: 18 },
  termsLink: { color: "#1C74E9" },
});
