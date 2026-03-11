import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellItemSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.dismissAll()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">
          Success
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main content */}
      <View className="flex-1 px-5 pt-6">
        {/* Checkmark */}
        <View className="items-center mb-6">
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <Ionicons name="checkmark" size={36} color="white" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-800 mt-5">
            Listing Published!
          </Text>
          <Text className="text-sm text-slate-500 text-center mt-2 px-4 leading-5">
            Great news! Your item is now live and visible to other students in
            the marketplace.
          </Text>
        </View>

        {/* Preview card */}
        <Text className="text-base font-bold text-slate-800 mb-3">Preview</Text>
        <View style={styles.previewCard}>
          <View className="flex-1 pr-3">
            <Text style={styles.categoryLabel}>ACADEMIC BOOKS</Text>
            <Text className="text-sm font-bold text-slate-800 mt-0.5">
              Used Calculus Textbook
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">
              Edition: 12th Revised
            </Text>
            <Text style={styles.priceText}>15,000 RWF</Text>
          </View>
          {/* Book placeholder */}
          <View style={styles.bookThumb}>
            <View style={styles.bookCover}>
              <Ionicons name="book" size={28} color="white" />
            </View>
          </View>
        </View>

        {/* What's next card */}
        <View style={styles.nextCard}>
          <Text className="text-sm font-bold text-slate-800 mb-1">
            What's next?
          </Text>
          <Text className="text-xs text-slate-500 leading-5">
            Keep your notifications on! You'll be alerted as soon as a buyer
            expresses interest or sends you a message.
          </Text>
          <TouchableOpacity className="flex-row items-center mt-3">
            <Text style={styles.learnMore}>Learn more</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color="#1C74E9"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom CTAs */}
      <View className="px-5 pb-8 gap-3">
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/my-listings")}
        >
          <Text style={styles.primaryBtnText}>View My Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.dismissAll()}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  checkOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  checkInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1C74E9",
    alignItems: "center",
    justifyContent: "center",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C74E9",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C74E9",
    marginTop: 6,
  },
  bookThumb: {
    width: 60,
    height: 76,
    borderRadius: 6,
    overflow: "hidden",
  },
  bookCover: {
    flex: 1,
    backgroundColor: "#0d9488",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  nextCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  learnMore: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C74E9",
  },
  primaryBtn: {
    backgroundColor: "#1C74E9",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryBtn: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "white",
  },
  secondaryBtnText: {
    color: "#1C74E9",
    fontWeight: "600",
    fontSize: 15,
  },
});
