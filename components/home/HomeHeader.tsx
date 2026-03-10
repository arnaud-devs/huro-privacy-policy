import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=11" }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.nameText}>Alex Chen</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bellButton}>
        <Ionicons name="notifications-outline" size={22} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFE4E6",
    marginRight: 12,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  greetingText: {
    fontSize: 13,
    color: "#64748B",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C74E9",
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});