import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PHONE_NUMBERS = [
  "+250 *** *** ***",
  "+250 078 *** ***",
  "+250 072 *** ***",
];

export default function SellItemPaymentScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payeeName, setPayeeName] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">
          Complete Your Listing
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Progress — step 3 active */}
      <View className="flex-row px-4 gap-2 pt-3 pb-4 bg-white">
        <View style={styles.stepInactive} />
        <View style={styles.stepInactive} />
        <View style={styles.stepActive} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Item Summary */}
        <View className="px-4 pt-5 pb-2">
          <Text style={styles.sectionLabel}>ITEM SUMMARY</Text>
        </View>
        <View style={styles.card}>
          <View className="flex-row items-center">
            {/* Placeholder book image */}
            <View style={styles.itemThumb}>
              <Ionicons name="book-outline" size={32} color="#94a3b8" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-slate-800">
                Used Calculus Textbook
              </Text>
              <Text style={styles.priceText}>Price: 15,000 RWF</Text>
              <Text className="text-xs text-slate-400 mt-0.5">
                Category: Books & Education
              </Text>
            </View>
          </View>
        </View>

        {/* Listing Fee */}
        <View style={styles.feeCard}>
          <Text className="text-sm text-slate-500 mb-1">Listing Fee</Text>
          <Text style={styles.feeAmount}>500 RWF</Text>
          <Text className="text-xs text-slate-400 text-center mt-1">
            This fee helps us keep the marketplace safe and active.
          </Text>
        </View>

        {/* Payment Method */}
        <View className="px-4 pt-5 pb-2">
          <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
        </View>

        <View className="px-4">
          {/* Mobile Money option */}
          <View style={styles.paymentOption}>
            <View style={styles.mmIcon}>
              <MaterialIcons name="phone-android" size={22} color="white" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-sm font-bold text-slate-800">
                Mobile Money
              </Text>
              <Text className="text-xs text-slate-500">*182*8*1*397680#</Text>
            </View>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color="white" />
            </View>
          </View>

          {/* Number Used to Pay */}
          <Text style={styles.fieldLabel}>Number Used to Pay</Text>
          <TextInput
            style={styles.input}
            placeholder="+250 7** *** ***"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            returnKeyType="next"
          />

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
          <View className="flex-row items-center justify-center mt-4 mb-2">
            <Ionicons name="lock-closed-outline" size={13} color="#94a3b8" />
            <Text className="text-xs text-slate-400 ml-1">
              Secure Payment Processing
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            /* handle payment & post */
            router.dismissAll();
          }}
        >
          <Text style={styles.ctaText}>Pay &amp; Post Listing</Text>
          <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <Text className="text-center text-xs text-slate-400 px-6 mt-2">
          By clicking "Pay &amp; Post", you agree to our Terms of Service
          regarding marketplace listings and fees.
        </Text>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepActive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1C74E9",
  },
  stepInactive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e2e8f0",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C74E9",
    marginTop: 2,
  },
  feeCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  feeAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1C74E9",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "white",
    marginBottom: 18,
  },
  mmIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 14,
    color: "#1e293b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#fff",
    marginBottom: 8,
    minHeight: 48,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 16,
  },
  ctaButton: {
    backgroundColor: "#1C74E9",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    alignSelf: "center",
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalRowActive: {
    backgroundColor: "#f0f7ff",
  },
  modalRowText: {
    fontSize: 14,
    color: "#334155",
  },
  modalRowTextActive: {
    color: "#1C74E9",
    fontWeight: "600",
  },
});
