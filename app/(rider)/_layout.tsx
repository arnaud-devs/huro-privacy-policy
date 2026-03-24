import { Stack } from "expo-router";

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(rider-tabs)" />
      <Stack.Screen name="batch-detail" />
      <Stack.Screen name="pickup-batch" />
      <Stack.Screen name="active-delivery" />
      <Stack.Screen name="arrived" />
      <Stack.Screen name="scan-qr" />
      <Stack.Screen name="manual-code-entry" />
      <Stack.Screen name="order-verified" />
      <Stack.Screen name="order-detail" />
      <Stack.Screen name="delivery-issues" />
      <Stack.Screen name="report-cancellation" />
      <Stack.Screen name="order-cancelled" />
      <Stack.Screen name="report-return" />
      <Stack.Screen name="return-confirmed" />
      <Stack.Screen name="report-issue" />
    </Stack>
  );
}
