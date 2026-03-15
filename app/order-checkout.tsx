import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DELIVERY_FEE = 1000;

function fmt(n: number) {
  return n.toLocaleString();
}

export default function OrderCheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    subtotal: string;
    itemName: string;
    itemImage: string;
  }>();

  const subtotal = params.subtotal ? Number(params.subtotal) : 11000;
  const total = subtotal + DELIVERY_FEE;
  const itemName = params.itemName ?? "Fresh Milk (1L)";
  const itemImage =
    params.itemImage ??
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80";

  const [phoneNumber, setPhoneNumber] = useState("+250 *** *** ***");
  const [payeeName, setPayeeName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── ORDER SUMMARY ── */}
        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>

        <View style={styles.card}>
          {/* Product row */}
          <View style={styles.productRow}>
            <Image
              source={{ uri: itemImage }}
              style={styles.productThumb}
              contentFit="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {itemName}
              </Text>
              <Text style={styles.productPrice}>Price: {fmt(subtotal)} RWF</Text>
              <Text style={styles.productCategory}>Category: Food &amp; Groceries</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          {/* Rows */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{fmt(subtotal)} RWF</Text>
          </View>
          <View style={[styles.summaryRow, { marginBottom: 0 }]}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{fmt(DELIVERY_FEE)} RWF</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={[styles.summaryRow, { marginBottom: 0 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{fmt(total)} RWF</Text>
          </View>
        </View>

        {/* ── PAYMENT METHOD ── */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          PAYMENT METHOD
        </Text>

        {/* Mobile Money card */}
        <View style={styles.paymentOption}>
          <View style={styles.mmIcon}>
            <MaterialIcons name="phone-android" size={22} color="white" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Mobile Money</Text>
            <Text style={styles.paymentSub}>*182*8*1*397680#</Text>
          </View>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={14} color="white" />
          </View>
        </View>

        {/* Number Used to Pay */}
        <Text style={styles.fieldLabel}>Number Used to Pay</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen((v) => !v)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>{phoneNumber}</Text>
          <Ionicons
            name={dropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#64748b"
          />
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {["+250 *** *** ***", "+250 78* *** ***", "+250 72* *** ***"].map(
              (num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPhoneNumber(num);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{num}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        )}

        {/* Name of Payee */}
        <Text style={styles.fieldLabel}>Name of Payee</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#94a3b8"
          value={payeeName}
          onChangeText={setPayeeName}
          returnKeyType="done"
        />

        {/* Secure badge */}
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
          <Text style={styles.secureText}>Secure Payment Processing</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.replace("/orders/order-status")}
        >
          <Text style={styles.ctaText}>Pay &amp; Post Listing</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="white"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        <Text style={styles.terms}>
          By clicking "Pay &amp; Post", you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {"\n"}regarding marketplace listings and fees.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#0f172a" },

  scroll: { padding: 16, paddingBottom: 20 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Product row
  productRow: { flexDirection: "row", alignItems: "flex-start" },
  productThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 3,
  },
  productPrice: { fontSize: 13, fontWeight: "600", color: "#1C74E9", marginBottom: 2 },
  productCategory: { fontSize: 12, color: "#94a3b8" },

  // Summary rows
  summaryDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: "#64748b" },
  summaryValue: { fontSize: 14, color: "#0f172a" },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#0f172a" },
  totalValue: { fontSize: 15, fontWeight: "700", color: "#1C74E9" },

  // Payment option
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

  // Fields
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 4,
  },
  dropdownText: { fontSize: 14, color: "#0f172a" },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemText: { fontSize: 14, color: "#0f172a" },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 14,
  },

  // Secure badge
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  secureText: { fontSize: 12, color: "#94a3b8", marginLeft: 5 },

  // Footer
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
  ctaText: { fontSize: 16, fontWeight: "700", color: "white" },
  terms: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 10,
    lineHeight: 18,
  },
  termsLink: { color: "#1C74E9" },
});
