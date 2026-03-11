import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface TimelineStep {
  label: string;
  time: string;
  status: "done" | "active" | "pending";
}

interface OrderTimelineProps {
  steps: TimelineStep[];
}

export default function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <View className="px-6 py-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={index} className="flex-row">
            {/* Left: dot + line */}
            <View className="items-center mr-4" style={styles.dotColumn}>
              <View
                style={[
                  styles.dot,
                  step.status === "done" && styles.dotDone,
                  step.status === "active" && styles.dotActive,
                  step.status === "pending" && styles.dotPending,
                ]}
              >
                {step.status === "done" && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
                {step.status === "active" && (
                  <Ionicons name="cube-outline" size={14} color="#1C74E9" />
                )}
              </View>
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Right: text */}
            <View className="pb-6 flex-1">
              <Text
                className="text-base font-bold"
                style={step.status === "active" ? styles.activeLabel : styles.doneLabel}
              >
                {step.label}
              </Text>
              <Text
                className="text-xs mt-0.5"
                style={step.status === "active" ? styles.activeTime : styles.doneTime}
              >
                {step.time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dotColumn: { width: 28 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: "#1C74E9" },
  dotActive: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#1C74E9",
  },
  dotPending: { backgroundColor: "#e2e8f0" },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#1C74E9",
    marginTop: 2,
    marginBottom: 2,
    minHeight: 20,
  },
  activeLabel: { color: "#1C74E9" },
  doneLabel: { color: "#0f172a" },
  activeTime: { color: "#1C74E9" },
  doneTime: { color: "#94a3b8" },
});
