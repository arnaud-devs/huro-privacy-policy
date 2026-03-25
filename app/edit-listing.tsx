import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { ListingCondition, updateListing } from "@/store/slices/marketplaceSlice";

const CONDITIONS: { label: string; value: ListingCondition }[] = [
  { label: "Like New", value: "LIKE_NEW" },
  { label: "Good", value: "GOOD" },
  { label: "Fair", value: "FAIR" },
  { label: "For Parts", value: "FOR_PARTS" },
];

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const listing = useAppSelector((s) =>
    s.marketplace.myListings.find((l) => l.id === id)
  );
  const { isUpdating, updateError } = useAppSelector((s) => s.marketplace);
  const { categories, isLoading: categoriesLoading } = useAppSelector((s) => s.categories);

  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing ? String(listing.askingPrice) : "");
  const [isNegotiable, setIsNegotiable] = useState(listing?.isNegotiable ?? false);
  const [condition, setCondition] = useState<ListingCondition>(listing?.condition ?? "GOOD");
  const [selectedCategoryId, setSelectedCategoryId] = useState(listing?.category ? undefined : undefined);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newImageUris, setNewImageUris] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  async function pickImage() {
    if (newImageUris.length >= 5) {
      Alert.alert("Maximum 5 images allowed");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewImageUris((prev) => [...prev, result.assets[0].uri]);
    }
  }

  function removeNewImage(index: number) {
    setNewImageUris((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!title.trim() || !price.trim()) {
      Alert.alert("Please fill in title and price.");
      return;
    }
    if (!id) return;

    const result = await dispatch(
      updateListing({
        listingId: id,
        title: title.trim(),
        description: description.trim(),
        condition,
        askingPrice: parseFloat(price),
        isNegotiable,
        ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
        ...(newImageUris.length > 0 ? { imageUris: newImageUris } : {}),
      })
    );

    if (updateListing.fulfilled.match(result)) {
      router.back();
    }
  }

  if (!listing) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Listing not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-slate-800">Edit Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Existing images */}
          {listing.images && listing.images.length > 0 && (
            <View className="mb-4">
              <Text style={styles.label}>Current Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {listing.images.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={styles.existingThumb} contentFit="cover" />
                ))}
              </ScrollView>
            </View>
          )}

          {/* New image picker */}
          <Text style={styles.label}>Replace Images (up to 5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {newImageUris.map((uri, i) => (
              <View key={i} style={styles.newThumbWrap}>
                <Image source={{ uri }} style={styles.newThumb} contentFit="cover" />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeNewImage(i)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            {newImageUris.length < 5 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                <Ionicons name="camera-outline" size={26} color="#1C74E9" />
                <Text className="text-xs text-primary mt-1 font-semibold">Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Item title"
            placeholderTextColor="#94a3b8"
            returnKeyType="next"
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setCategoryModalVisible(true)}>
            <Text style={[styles.dropdownText, !selectedCategory && { color: "#94a3b8" }]}>
              {selectedCategory?.name ?? listing.category?.name ?? "Select a category"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94a3b8" />
          </TouchableOpacity>

          {/* Price */}
          <Text style={styles.label}>Price (RWF)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
            returnKeyType="next"
          />

          {/* Negotiable */}
          <View className="flex-row items-center justify-between mb-4 px-1">
            <View>
              <Text style={[styles.label, { marginBottom: 2 }]}>Negotiable</Text>
              <Text className="text-xs text-slate-500">Allow buyers to make offers</Text>
            </View>
            <Switch
              trackColor={{ false: "#e2e8f0", true: "#1C74E9" }}
              thumbColor="#fff"
              ios_backgroundColor="#e2e8f0"
              onValueChange={setIsNegotiable}
              value={isNegotiable}
            />
          </View>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          {/* Condition */}
          <Text style={styles.label}>Condition</Text>
          <View className="flex-row gap-2 flex-wrap mb-5">
            {CONDITIONS.map((c) => (
              <TouchableOpacity
                key={c.value}
                onPress={() => setCondition(c.value)}
                style={[styles.conditionPill, condition === c.value && styles.conditionPillActive]}
              >
                <Text style={[styles.conditionText, condition === c.value && styles.conditionTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {updateError ? (
            <Text className="text-red-500 text-sm text-center mb-2">{updateError}</Text>
          ) : null}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center mx-4 mb-2"
            onPress={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Category Modal */}
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
          <Text className="text-base font-bold text-slate-800 mb-4 px-4">Select a Category</Text>
          <ScrollView>
            {categoriesLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} color="#1C74E9" />
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryRow, selectedCategoryId === cat.id && styles.categoryRowActive]}
                  onPress={() => { setSelectedCategoryId(cat.id); setCategoryModalVisible(false); }}
                >
                  <Text style={[styles.categoryRowText, selectedCategoryId === cat.id && styles.categoryRowTextActive]}>
                    {cat.name}
                  </Text>
                  {selectedCategoryId === cat.id && <Ionicons name="checkmark" size={18} color="#1C74E9" />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6, marginTop: 4 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#1e293b", backgroundColor: "#fff", marginBottom: 16 },
  dropdown: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", marginBottom: 16 },
  dropdownText: { fontSize: 14, color: "#1e293b" },
  textArea: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, fontSize: 14, color: "#1e293b", backgroundColor: "#fff", minHeight: 110, marginBottom: 16 },
  conditionPill: { borderWidth: 1.5, borderColor: "#cbd5e1", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  conditionPillActive: { borderColor: "#1C74E9", backgroundColor: "#f0f7ff" },
  conditionText: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  conditionTextActive: { color: "#1C74E9", fontWeight: "700" },
  existingThumb: { width: 80, height: 80, borderRadius: 10, marginRight: 8 },
  newThumbWrap: { position: "relative", marginRight: 8 },
  newThumb: { width: 80, height: 80, borderRadius: 10 },
  removeBtn: { position: "absolute", top: -6, right: -6 },
  addImageBtn: { width: 80, height: 80, borderWidth: 2, borderColor: "#1C74E9", borderStyle: "dashed", borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f7ff", marginRight: 8 },
  footer: { paddingTop: 12, paddingBottom: 24, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: { backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 12, paddingBottom: 40, maxHeight: "60%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#cbd5e1", alignSelf: "center", marginBottom: 12 },
  categoryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  categoryRowActive: { backgroundColor: "#f0f7ff" },
  categoryRowText: { fontSize: 14, color: "#334155" },
  categoryRowTextActive: { color: "#1C74E9", fontWeight: "600" },
});
