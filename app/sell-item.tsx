import { updatePendingListing } from "@/store/slices/marketplaceSlice";
import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

type PhotoSlot = "main" | "back" | "optional";

interface PhotoState {
  main: string | null;
  back: string | null;
  optional: string | null;
}

export default function SellItemScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pendingListing } = useSelector(
    (state: RootState) => state.marketplace,
  );

  const [photos, setPhotos] = useState<PhotoState>({
    main: null,
    back: null,
    optional: null,
  });

  useEffect(() => {
    if (pendingListing.imageUris && pendingListing.imageUris.length > 0) {
      setPhotos({
        main: pendingListing.imageUris[0] || null,
        back: pendingListing.imageUris[1] || null,
        optional: pendingListing.imageUris[2] || null,
      });
    }
  }, [pendingListing.imageUris]);

  async function pickImage(slot: PhotoSlot) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => {
        const newPhotos = { ...prev, [slot]: result.assets[0].uri };

        // Also update redux immediately so it persists if we navigate
        const imageUris = [
          newPhotos.main,
          newPhotos.back,
          newPhotos.optional,
        ].filter((uri): uri is string => !!uri);
        dispatch(updatePendingListing({ imageUris }));

        return newPhotos;
      });
    }
  }

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
        {/* spacer to balance the X */}
        <View style={{ width: 24 }} />
      </View>

      {/* Step Progress */}
      <View className="flex-row px-4 gap-2 mb-6">
        <View style={styles.stepActive} />
        <View style={styles.stepInactive} />
        <View style={styles.stepInactive} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
      >
        <Text className="text-xl font-bold text-slate-800 mb-5">
          Item Photos
        </Text>

        {/* Required Photo 1 */}
        <UploadRow
          label="UPLOAD PHOTO 1: MAIN"
          required
          uri={photos.main}
          onPress={() => pickImage("main")}
        />

        {/* Required Photo 2 */}
        <UploadRow
          label="UPLOAD PHOTO 2: BACK/SIDE"
          required
          uri={photos.back}
          onPress={() => pickImage("back")}
        />

        {/* Optional Photo */}
        <TouchableOpacity
          onPress={() => pickImage("optional")}
          style={styles.optionalBox}
        >
          {photos.optional ? (
            <Image
              source={{ uri: photos.optional }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="add" size={28} color="#94a3b8" />
              <Text className="text-xs text-slate-400 mt-1 tracking-widest uppercase">
                Optional
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bottom photo tips (for optional slot) */}
        <View className="bg-blue-50 rounded-xl p-4 mt-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb-outline" size={16} color="#1C74E9" />
            <Text className="text-sm font-semibold text-slate-700 ml-1">
              Photo Tips
            </Text>
          </View>
          <TipLine text="Front of the item (Main photo)" />
          <TipLine text="Back or side view" />
          <TipLine text="Any defects or damage" />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          className="bg-primary rounded-full py-4 items-center mx-4 mb-2"
          onPress={() => {
            if (!photos.main || !photos.back) {
              alert("Please add at least the main and back/side photos.");
              return;
            }
            const imageUris = [
              photos.main,
              photos.back,
              photos.optional,
            ].filter((uri): uri is string => !!uri);
            dispatch(updatePendingListing({ imageUris }));
            router.push("/sell-item-details");
          }}
        >
          <Text className="text-white font-bold text-base">Next</Text>
        </TouchableOpacity>
        <Text className="text-center text-xs text-slate-400 px-6">
          By posting, you agree to the Marketplace Terms of Service and
          Community Guidelines.
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─── */

function UploadRow({
  label,
  required,
  uri,
  onPress,
}: {
  label: string;
  required?: boolean;
  uri: string | null;
  onPress: () => void;
}) {
  return (
    <View className="flex-row mb-4 gap-3">
      {/* Upload box */}
      <TouchableOpacity onPress={onPress} style={styles.uploadBox}>
        {uri ? (
          <Image
            source={{ uri }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <Ionicons name="camera-outline" size={28} color="#1C74E9" />
            <Text
              className="text-xs font-semibold text-primary mt-2 text-center"
              style={{ maxWidth: 90 }}
            >
              {label}
            </Text>
          </View>
        )}
        {required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tips card */}
      <View className="flex-1 bg-blue-50 rounded-xl p-3 justify-center">
        <View className="flex-row items-center mb-2">
          <Ionicons name="bulb-outline" size={14} color="#1C74E9" />
          <Text className="text-xs font-semibold text-slate-700 ml-1">
            Photo Tips
          </Text>
        </View>
        <TipLine text="Front of the item (Main photo)" />
        <TipLine text="Back or side view" />
        <TipLine text="Any defects or damage" />
      </View>
    </View>
  );
}

function TipLine({ text }: { text: string }) {
  return (
    <View className="flex-row items-start mb-0.5">
      <Text className="text-slate-400 mr-1 text-xs">•</Text>
      <Text className="text-xs text-slate-600 flex-1">{text}</Text>
    </View>
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
  uploadBox: {
    width: 130,
    height: 120,
    borderWidth: 2,
    borderColor: "#1C74E9",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7ff",
    overflow: "hidden",
  },
  optionalBox: {
    height: 80,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    overflow: "hidden",
  },
  requiredBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#1C74E9",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  requiredText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
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
});
