import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  claimBatchOrder,
  fetchBatchDetail,
  loadSampleBatchDetail,
  setCurrentBatch,
  setDeliveryPhase,
  type BatchOrder,
} from "@/store/slices/riderSlice";

export function useBatchDetail(batchId: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { batchDetail, isLoadingBatchDetail, claimedOrderIds } = useAppSelector(
    (state) => state.rider
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (batchId) {
      // Try API first, fall back to sample data
      dispatch(fetchBatchDetail(batchId)).then((result) => {
        if (fetchBatchDetail.rejected.match(result)) {
          dispatch(loadSampleBatchDetail(batchId));
        }
      });
    }
  }, [batchId]);

  // Smart resume: after batch detail loads, check actual order statuses from the
  // server and redirect to the correct step — no dependency on Redux phase.
  useEffect(() => {
    if (!batchDetail || !batchId) return;

    const orders = batchDetail.orders ?? [];

    // IN_DELIVERY → batch already dispatched, go straight to active delivery
    if (orders.some((o) => o.status === "IN_DELIVERY")) {
      router.replace("/(rider)/active-delivery");
      return;
    }

    // PICKED_UP or RIDER_ASSIGNED → rider has work in progress, go to pickup screen
    if (
      orders.some((o) => o.status === "PICKED_UP") ||
      orders.some((o) => o.status === "RIDER_ASSIGNED")
    ) {
      router.replace({
        pathname: "/(rider)/pickup-batch",
        params: { batchId },
      } as any);
    }
    // PAID orders only → show claim UI (fall through, no redirect)
  }, [batchDetail?.id]);

  const riderCount = batchDetail?.riders?.length ?? 1;
  const isSoloRider = riderCount <= 1;

  // Solo rider: server auto-assigns on payment → orders arrive as RIDER_ASSIGNED.
  // No client-side claiming needed; the status-based redirect above handles routing.

  // Categorize orders
  const { availableOrders, takenOrders, myClaimedOrders } = useMemo(() => {
    const orders = batchDetail?.orders ?? [];
    const available: BatchOrder[] = [];
    const taken: BatchOrder[] = [];
    const myClaimed: BatchOrder[] = [];

    orders.forEach((order) => {
      if (claimedOrderIds.includes(order.id)) {
        myClaimed.push(order);
      } else if (order.pickupSignature && order.pickupSignature !== "rider-1") {
        taken.push(order);
      } else {
        available.push(order);
      }
    });

    return { availableOrders: available, takenOrders: taken, myClaimedOrders: myClaimed };
  }, [batchDetail, claimedOrderIds]);

  const toggleSelect = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAll = () => {
    const allAvailableIds = availableOrders.map((o) => o.id);
    setSelectedIds(allAvailableIds);
  };

  const handleClaimSelected = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("No Orders Selected", "Please select at least one order to claim.");
      return;
    }

    setIsClaiming(true);
    const failed: string[] = [];
    const succeeded: string[] = [];

    for (const orderId of selectedIds) {
      const result = await dispatch(
        claimBatchOrder({ batchId: batchId!, orderId })
      );
      if (claimBatchOrder.fulfilled.match(result)) {
        succeeded.push(orderId);
      } else {
        failed.push(orderId);
      }
    }

    // Update local state and set phase immediately so dashboard knows
    if (succeeded.length > 0) {
      dispatch(setCurrentBatch(batchId!));
      dispatch(setDeliveryPhase("picking_up"));
    }

    setIsClaiming(false);
    setSelectedIds([]);

    if (failed.length === 0) {
      Alert.alert(
        "Orders Claimed",
        `You claimed ${succeeded.length} order(s). Head to pickup!`
      );
    } else if (succeeded.length > 0) {
      Alert.alert(
        "Partially Claimed",
        `${succeeded.length} claimed, ${failed.length} failed. Some orders may already be taken.`
      );
    } else {
      Alert.alert("Claim Failed", "Could not claim the selected orders. They may already be taken by another rider.");
    }

    // Refresh batch detail to get updated state
    dispatch(fetchBatchDetail(batchId!));
  };

  const handleStartPickup = () => {
    if (claimedOrderIds.length === 0) {
      Alert.alert("No Claims", "Claim some orders first before starting pickup.");
      return;
    }
    dispatch(setDeliveryPhase("picking_up"));
    router.push({
      pathname: "/(rider)/pickup-batch",
      params: { batchId: batchId! },
    });
  };

  const totalItems = (order: BatchOrder) =>
    (order.orderItems ?? []).reduce((sum, item) => sum + item.quantity, 0);

  return {
    batchDetail,
    isLoadingBatchDetail,
    claimedOrderIds,
    riderCount,
    isSoloRider,
    availableOrders,
    takenOrders,
    myClaimedOrders,
    selectedIds,
    toggleSelect,
    selectAll,
    isClaiming,
    handleClaimSelected,
    handleStartPickup,
    totalItems,
  };
}
