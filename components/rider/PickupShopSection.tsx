import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PickupStatus = "not-collected" | "collected" | "out-of-stock" | "pending";

export type PickupItem = {
  id: string;
  name: string;
  status: PickupStatus;
};

export type ShopBatch = {
  name: string;
  orders: number;
  items: PickupItem[];
};

const STATUS_META: Record<
  PickupStatus,
  { label: string; color: string; tileBorder?: string; tileBackground?: string }
> = {
  "not-collected": {
    label: "NOT COLLECTED",
    color: "#94A3B8",
  },
  collected: {
    label: "COLLECTED",
    color: "#1C74E9",
    tileBorder: "#BBD5FA",
    tileBackground: "#F5F9FF",
  },
  "out-of-stock": {
    label: "OUT OF STOCK",
    color: "#F87171",
  },
  pending: {
    label: "PENDING",
    color: "#94A3B8",
  },
};

export function PickupShopSection({
  shop,
  onItemToggle,
  onOrderPress,
}: {
  shop: ShopBatch;
  onItemToggle?: (shopName: string, itemId: string) => void;
  onOrderPress?: () => void;
}) {
  return (
    <View style={styles.shopSection}>
      <View style={styles.shopHeader}>
        <TouchableOpacity style={styles.shopNameWrap} onPress={onOrderPress} activeOpacity={0.7}>
          <Ionicons name="storefront-outline" size={18} color="#475569" />
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopCount}>({shop.orders} orders)</Text>
          {onOrderPress && <Ionicons name="chevron-forward" size={16} color="#94a3b8" />}
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </View>

      {shop.name === "Snack Shop" && (
        <TouchableOpacity style={styles.confirmAllBtn} activeOpacity={0.85}>
          <Ionicons name="cube-outline" size={17} color="#FFFFFF" />
          <Text style={styles.confirmAllText}>Confirm All Pickups</Text>
        </TouchableOpacity>
      )}

      <View style={styles.itemsGrid}>
        {shop.items.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => onItemToggle?.(shop.name, item.id)}
              style={[
                styles.itemCard,
                meta.tileBorder ? { borderColor: meta.tileBorder } : null,
                meta.tileBackground ? { backgroundColor: meta.tileBackground } : null,
              ]}
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemId}>{item.id}</Text>
                <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={[styles.itemStatus, { color: meta.color }]}>{meta.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shopSection: {
    marginBottom: 16,
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shopNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shopName: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "800",
  },
  shopCount: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
  },
  reportText: {
    fontSize: 14,
    color: "#1C74E9",
    fontWeight: "700",
  },
  confirmAllBtn: {
    height: 42,
    borderRadius: 14,
    backgroundColor: "#1C74E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: "#1C74E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmAllText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  itemCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCE5F0",
    padding: 10,
    minHeight: 94,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
    marginBottom: 8,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
});
