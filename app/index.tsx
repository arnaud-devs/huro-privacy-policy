import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Index() {
  const tokens = useSelector((state: RootState) => state.user.tokens);
  const role = useSelector((state: RootState) => state.user.user?.role);

  if (!tokens?.accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === "RIDER") {
    return <Redirect href={"/(rider)/(rider-tabs)" as any} />;
  }

  return <Redirect href={"/(tabs)" as any} />;
}
