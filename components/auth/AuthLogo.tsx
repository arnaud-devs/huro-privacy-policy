import { StyleSheet, Text, View } from "react-native";

export default function AuthLogo() {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>
        huza<Text style={styles.logoTextOrange}>Go</Text>
      </Text>
      <Text style={styles.logoSubtext}>Fast & Affordable Local Delivery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1363A5",
    letterSpacing: -1,
  },
  logoTextOrange: {
    color: "#F48C06",
  },
  logoSubtext: {
    fontSize: 8,
    color: "#1363A5",
    marginTop: -5,
  },
});
