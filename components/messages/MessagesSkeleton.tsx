import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function useShimmer() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return opacity;
}

function Bone({ width, height, radius = 8, style }: { width: number | string; height: number; radius?: number; style?: any }) {
  const opacity = useShimmer();
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: "#e2e8f0", opacity }, style]}
    />
  );
}

function ConversationRowSkeleton() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16 }}>
      {/* Avatar */}
      <Bone width={52} height={52} radius={26} style={{ marginRight: 12 }} />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {/* Name + time */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Bone width={120} height={13} radius={6} />
          <Bone width={40} height={11} radius={5} />
        </View>
        {/* Context label */}
        <Bone width={80} height={10} radius={5} style={{ marginBottom: 6 }} />
        {/* Last message */}
        <Bone width="85%" height={11} radius={5} />
      </View>
    </View>
  );
}

export default function MessagesSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <View key={i}>
          <ConversationRowSkeleton />
          {i < 6 && <View style={{ height: 1, backgroundColor: "#f1f5f9", marginHorizontal: 16 }} />}
        </View>
      ))}
    </View>
  );
}
