import "@/global.css";

import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<View style={{ flex: 1 }}><ActivityIndicator style={{ flex: 1 }} color="#1C74E9" /></View>}
        persistor={persistor}
      >
        <Stack initialRouteName="(auth)">
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(rider)" options={{ headerShown: false }} />
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
      </PersistGate>
    </Provider>
  );
}
