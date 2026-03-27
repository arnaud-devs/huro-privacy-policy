import { useEffect, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRiderOrderDetail,
  markOrderDeliveredLocal,
  resetDeliverySession,
  setDeliveryPhase,
  SAMPLE_ORDER_DETAILS,
} from "@/store/slices/riderSlice";

export function useActiveDelivery() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { claimedOrderIds, deliveredOrderIds, currentBatchId, deliveryPhase, orderDetailsMap } =
    useAppSelector((state) => state.rider);

  // Fetch details for any claimed order not yet cached
  useEffect(() => {
    for (const id of claimedOrderIds) {
      if (!orderDetailsMap[id] && !SAMPLE_ORDER_DETAILS[id]) {
        dispatch(fetchRiderOrderDetail(id));
      }
    }
  }, [claimedOrderIds]);

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [hasArrived, setHasArrived] = useState(deliveryPhase === "arrived");

  // Build delivery queue from claimed orders
  const pendingOrders = useMemo(() => {
    return claimedOrderIds
      .filter((id) => !deliveredOrderIds.includes(id))
      .map((id) => {
        const detail = orderDetailsMap[id] ?? SAMPLE_ORDER_DETAILS[id];
        return {
          id,
          customerName: detail?.snapshotName ?? "Customer",
          address: detail?.customAddress ?? detail?.snapshotZoneName ?? "Unknown",
          zone: detail?.snapshotZoneName ?? "—",
          phone: detail?.snapshotPhone ?? "—",
          amount: detail?.payableAmount ?? 0,
          items: detail?.orderItems ?? [],
          pickupSignature: detail?.pickupSignature ?? null,
        };
      });
  }, [claimedOrderIds, deliveredOrderIds, orderDetailsMap]);

  const deliveredOrders = useMemo(() => {
    return deliveredOrderIds.map((id) => {
      const detail = orderDetailsMap[id] ?? SAMPLE_ORDER_DETAILS[id];
      return {
        id,
        customerName: detail?.snapshotName ?? "Customer",
        address: detail?.customAddress ?? detail?.snapshotZoneName ?? "Unknown",
      };
    });
  }, [deliveredOrderIds, orderDetailsMap]);

  const totalOrders = claimedOrderIds.length;
  const deliveredCount = deliveredOrderIds.length;
  const progress = totalOrders > 0 ? deliveredCount / totalOrders : 0;
  const zoneName = pendingOrders[0]?.zone ?? "Delivery Zone";

  const handleArrivedAtZone = () => {
    setHasArrived(true);
    dispatch(setDeliveryPhase("arrived"));
    Alert.alert(
      "Arrived!",
      `You've arrived at ${zoneName}. Now verify each order with the customer.`
    );
  };

  const handleVerifyOrder = (orderId: string) => {
    router.push({
      pathname: "/(rider)/scan-qr",
      params: { orderId },
    });
  };

  const handleCallCustomer = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  };

  const handleLeaveDelivery = () => {
    if (pendingOrders.length > 0) {
      setShowLeaveConfirm(true);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    dispatch(resetDeliverySession());
    router.replace("/(rider)/(rider-tabs)" as any);
  };

  return {
    currentBatchId,
    pendingOrders,
    deliveredOrders,
    deliveredCount,
    totalOrders,
    progress,
    zoneName,
    hasArrived,
    showLeaveConfirm,
    setShowLeaveConfirm,
    handleArrivedAtZone,
    handleVerifyOrder,
    handleCallCustomer,
    handleLeaveDelivery,
    finishSession,
  };
}
