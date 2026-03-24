import { Image, View } from "react-native";

export default function AuthLogo() {
  return (
    <View className="items-center mt-5 mb-10">
      <Image
        source={require("@/assets/images/AuthLogo.png")}
        style={{ width: 180, height: 100 }}
        resizeMode="contain"
      />
    </View>
  );
}
