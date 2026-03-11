import { Image } from "expo-image";
import { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({
  images,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View>
      <Image
        source={{ uri: images[activeIndex] }}
        style={styles.mainImage}
        contentFit="cover"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-3"
        contentContainerStyle={{ gap: 10 }}
      >
        {images.map((img, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveIndex(index)}
            className="rounded-xl overflow-hidden"
            style={[
              styles.thumbnail,
              activeIndex === index && styles.thumbnailActive,
            ]}
          >
            <Image
              source={{ uri: img }}
              style={styles.thumbnailImage}
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: SCREEN_WIDTH,
    height: 260,
    backgroundColor: "#f1f5f9",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#1C74E9",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
