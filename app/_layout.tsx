import "@/global.css";

import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="product-details" options={{ headerShown: false }} />
        <Stack.Screen
          name="campus-product-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="chat" options={{ headerShown: false }} />

        <Stack.Screen name="sell-item" options={{ headerShown: false }} />
        <Stack.Screen
          name="sell-item-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sell-item-payment"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sell-item-success"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
