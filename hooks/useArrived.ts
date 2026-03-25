import { useMemo } from "react";
import { Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAppDispatch } from "@/store/hooks";
import { setDeliveryPhase, SAMPLE_ORDER_DETAILS } from "@/store/slices/riderSlice";

export function useArrived() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const order = useMemo(() => {
    if (!orderId) return null;
    return SAMPLE_ORDER_DETAILS[orderId] ?? null;
  }, [orderId]);

  const handleCall = () => {
    if (order?.snapshotPhone) {
      Linking.openURL(`tel:${order.snapshotPhone.replace(/\s/g, "")}`);
    }
  };

  const handleVerifyDelivery = () => {
    router.push({ pathname: "/(rider)/scan-qr", params: { orderId: orderId! } });
  };

  const handleManualCode = () => {
    router.push({ pathname: "/(rider)/manual-code-entry", params: { orderId: orderId! } });
  };

  const handleGoBack = () => {
    dispatch(setDeliveryPhase("delivering"));
    router.back();
  };

  const handleReportIssue = () => {
    router.push({ pathname: "/(rider)/delivery-issues", params: { orderId: orderId! } });
  };

  return { order, handleCall, handleVerifyDelivery, handleManualCode, handleGoBack, handleReportIssue };
}
