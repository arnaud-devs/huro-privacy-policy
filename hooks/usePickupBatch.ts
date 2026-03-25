import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  dispatchBatch,
  fetchBatchDetail,
  loadSampleBatchDetail,
  markAllPickedUp,
  pickupOrder,
  setDeliveryPhase,
  SAMPLE_ORDER_DETAILS,
} from "@/store/slices/riderSlice";

export type ItemStatus = "not-collected" | "collected" | "out-of-stock";

export interface PickupItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
}

export interface PickupOrder {
  orderId: string;
  customerName: string;
  items: PickupItem[];
}

export function usePickupBatch() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { batchId } = useLocalSearchParams<{ batchId: string }>();

  const { batchDetail, isLoadingBatchDetail, claimedOrderIds, pickedUpOrderIds } =
    useAppSelector((state) => state.rider);

  const [pickupOrders, setPickupOrders] = useState<PickupOrder[]>([]);
  const [isPickingUp, setIsPickingUp] = useState(false);

  useEffect(() => {
    if (batchId) {
      dispatch(fetchBatchDetail(batchId)).then((result) => {
        if (fetchBatchDetail.rejected.match(result)) {
          dispatch(loadSampleBatchDetail(batchId));
        }
      });
    }
  }, [batchId]);

  useEffect(() => {
    const orders = batchDetail?.orders ?? [];
    const claimed = orders.filter((o) => claimedOrderIds.includes(o.id));

    const mapped: PickupOrder[] = claimed.map((order) => {
      const detail = SAMPLE_ORDER_DETAILS[order.id];
      const alreadyDone = pickedUpOrderIds.includes(order.id);
      return {
        orderId: order.id,
        customerName:
          detail?.snapshotName ?? `Order #${order.id.slice(0, 6).toUpperCase()}`,
        items: (order.orderItems ?? []).map((item) => ({
          id: item.id,
          name: item.productName,
          quantity: item.quantity,
          status: alreadyDone ? ("collected" as ItemStatus) : ("not-collected" as ItemStatus),
        })),
      };
    });

    setPickupOrders(mapped);
  }, [batchDetail, claimedOrderIds, pickedUpOrderIds]);

  const totalItems = pickupOrders.reduce((sum, o) => sum + o.items.length, 0);
  const collectedItems = pickupOrders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.status === "collected").length,
    0
  );
  const allCollected = totalItems > 0 && collectedItems === totalItems;
  const allAlreadyPickedUp =
    pickupOrders.length > 0 &&
    pickupOrders.every((o) => pickedUpOrderIds.includes(o.orderId));

  const toggleItem = (orderId: string, itemId: string) => {
    setPickupOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) => {
            if (item.id !== itemId) return item;
            const next: ItemStatus =
              item.status === "not-collected"
                ? "collected"
                : item.status === "collected"
                ? "out-of-stock"
                : "not-collected";
            return { ...item, status: next };
          }),
        };
      })
    );
  };

  const handleMarkAll = () => {
    const ids = pickupOrders.map((o) => o.orderId);
    dispatch(markAllPickedUp(ids));
  };

  const confirmPickupAndDeliver = async () => {
    setIsPickingUp(true);
    const failed: string[] = [];

    for (const order of pickupOrders) {
      if (pickedUpOrderIds.includes(order.orderId)) continue;
      const result = await dispatch(pickupOrder(order.orderId));
      if (!pickupOrder.fulfilled.match(result)) {
        failed.push(order.orderId);
      }
    }

    if (failed.length > 0 && failed.length === pickupOrders.length) {
      setIsPickingUp(false);
      Alert.alert("Pickup Failed", "Could not mark orders as picked up. Please try again.");
      return;
    }

    if (failed.length > 0) {
      Alert.alert(
        "Partial Pickup",
        `${pickupOrders.length - failed.length} marked as picked up, ${failed.length} failed.`
      );
    }

    if (batchId) {
      const dispatchResult = await dispatch(dispatchBatch(batchId));
      if (!dispatchBatch.fulfilled.match(dispatchResult)) {
        setIsPickingUp(false);
        Alert.alert(
          "Dispatch Failed",
          (dispatchResult.payload as string) || "Could not dispatch batch. Please try again."
        );
        return;
      }
    }

    setIsPickingUp(false);
    dispatch(setDeliveryPhase("delivering"));
    router.push("/(rider)/active-delivery");
  };

  const handleStartDelivery = () => {
    const notCollected = pickupOrders.some((o) =>
      o.items.some((i) => i.status === "not-collected")
    );
    const outOfStock = pickupOrders.some((o) =>
      o.items.some((i) => i.status === "out-of-stock")
    );

    if (notCollected) {
      Alert.alert(
        "Items Not Collected",
        "Some items are still not collected. Please collect or mark them as out-of-stock before starting delivery."
      );
      return;
    }

    if (outOfStock) {
      Alert.alert(
        "Out of Stock Items",
        "Some items are out of stock. The customer will be notified. Continue with delivery?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: confirmPickupAndDeliver },
        ]
      );
      return;
    }

    confirmPickupAndDeliver();
  };

  const handleContinueToDelivery = () => {
    dispatch(setDeliveryPhase("delivering"));
    router.push("/(rider)/active-delivery");
  };

  return {
    batchId,
    isLoadingBatchDetail,
    pickupOrders,
    pickedUpOrderIds,
    totalItems,
    collectedItems,
    allCollected,
    allAlreadyPickedUp,
    isPickingUp,
    toggleItem,
    handleMarkAll,
    handleStartDelivery,
    handleContinueToDelivery,
  };
}
