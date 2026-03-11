import { Ionicons } from "@expo/vector-icons";
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

const CATEGORIES = [
  "Textbooks",
  "Electronics",
  "Clothing & Fashion",
  "Furniture",
  "Sports & Fitness",
  "Food & Drinks",
  "Services",
  "Stationery",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;
type Condition = (typeof CONDITIONS)[number];

export default function SellItemDetailsScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<Condition>("New");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">
          Sell Item
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Progress — step 2 active */}
      <View className="flex-row px-4 gap-2 mb-6">
        <View style={styles.stepInactive} />
        <View style={styles.stepActive} />
        <View style={styles.stepInactive} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Listing Title */}
        <Text style={styles.label}>Listing Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Organic Chemistry Textbook (10th Ed)"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text
            style={[styles.dropdownText, !category && { color: "#94a3b8" }]}
          >
            {category || "Select a category"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#94a3b8" />
        </TouchableOpacity>

        {/* Price */}
        <Text style={styles.label}>Price (RWF)</Text>
        <TextInput
          style={styles.input}
          placeholder="RWF 0.0"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
          returnKeyType="next"
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell buyers about the condition, any defects, or why you're selling..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Condition */}
        <Text style={styles.label}>Condition</Text>
        <View className="flex-row gap-2 flex-wrap mb-5">
          {CONDITIONS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCondition(c)}
              style={[
                styles.conditionPill,
                condition === c && styles.conditionPillActive,
              ]}
            >
              <Text
                style={[
                  styles.conditionText,
                  condition === c && styles.conditionTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meetup Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#1C74E9" />
          <View className="ml-2 flex-1">
            <Text className="text-sm font-semibold text-slate-800">
              Meetup Location
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              By default, listings are shown to students on your campus.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          className="bg-primary rounded-full py-4 items-center mx-4 mb-2"
          onPress={() => {
            /* navigate to step 3 (review & post) */
          }}
        >
          <Text className="text-white font-bold text-base">Next</Text>
        </TouchableOpacity>
        <Text className="text-center text-xs text-slate-400 px-6">
          By posting, you agree to the Marketplace Terms of Service and
          Community Guidelines.
        </Text>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text className="text-base font-bold text-slate-800 mb-4 px-4">
            Select a Category
          </Text>
          <ScrollView>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryRow,
                  category === cat && styles.categoryRowActive,
                ]}
                onPress={() => {
                  setCategory(cat);
                  setCategoryModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryRowText,
                    category === cat && styles.categoryRowTextActive,
                  ]}
                >
                  {cat}
                </Text>
                {category === cat && (
                  <Ionicons name="checkmark" size={18} color="#1C74E9" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
    marginTop: 4,
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
    marginBottom: 16,
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
  textArea: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#fff",
    minHeight: 110,
    marginBottom: 16,
  },
  conditionPill: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  conditionPillActive: {
    borderColor: "#1C74E9",
    backgroundColor: "#f0f7ff",
  },
  conditionText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  conditionTextActive: {
    color: "#1C74E9",
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
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
    maxHeight: "60%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    alignSelf: "center",
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryRowActive: {
    backgroundColor: "#f0f7ff",
  },
  categoryRowText: {
    fontSize: 14,
    color: "#334155",
  },
  categoryRowTextActive: {
    color: "#1C74E9",
    fontWeight: "600",
  },
});
