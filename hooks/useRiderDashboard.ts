import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRiderBatches, fetchRiderOrders } from "@/store/slices/riderSlice";

export function useRiderDashboard() {
  const dispatch = useAppDispatch();
  const {
    batches,
    isFetchingBatches,
    orders,
    deliveryPhase,
    claimedOrderIds,
    currentBatchId,
    deliveredOrderIds,
    pickedUpOrderIds,
  } = useAppSelector((state) => state.rider);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.role?.toUpperCase() !== "RIDER") return;
    dispatch(fetchRiderBatches());
    dispatch(fetchRiderOrders());
  }, [dispatch, user?.role]);

  const refreshBatches = () => {
    dispatch(fetchRiderBatches());
    dispatch(fetchRiderOrders());
  };

  const apiLoaded = orders.length > 0;
  const inDeliveryOrders = orders.filter((o) => o.status === "IN_DELIVERY");
  const pickedUpOrders = orders.filter((o) => o.status === "PICKED_UP");
  const assignedOrders = orders.filter((o) => o.status === "RIDER_ASSIGNED");
  const activeOrders = orders.filter((o) =>
    ["RIDER_ASSIGNED", "PICKED_UP", "IN_DELIVERY"].includes(o.status)
  );

  const activeBatches = batches.filter((b) =>
    ["OPEN", "IN_PROGRESS", "DISPATCHED"].includes(b.status)
  );
  const upcomingBatches = batches.filter((b) => b.status === "CLOSED");

  const firstName = user?.fullName?.split(" ")[0] ?? "Rider";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning," : hour < 17 ? "Good afternoon," : "Good evening,";

  return {
    isFetchingBatches,
    activeBatches,
    upcomingBatches,
    activeOrders,
    inDeliveryOrders,
    pickedUpOrders,
    assignedOrders,
    apiLoaded,
    deliveryPhase,
    claimedOrderIds,
    currentBatchId,
    deliveredOrderIds,
    pickedUpOrderIds,
    firstName,
    greeting,
    refreshBatches,
  };
}
