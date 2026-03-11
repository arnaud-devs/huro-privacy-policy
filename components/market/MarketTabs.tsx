import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MarketTabsProps {
  activeTab: 'Campus Store' | 'Used Market';
  onTabChange: (tab: 'Campus Store' | 'Used Market') => void;
}

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  const isCampus = activeTab === 'Campus Store';
  const isUsed = activeTab === 'Used Market';

  return (
    <View className="px-4 mt-2 mb-2">
      <View className="flex-row bg-slate-100 rounded-full p-1 border border-slate-200">
        <TouchableOpacity
          className="flex-1 rounded-full py-2 items-center justify-center"
          style={isCampus ? styles.activeTab : undefined}
          onPress={() => onTabChange('Campus Store')}
        >
          <Text
            className="text-sm"
            style={isCampus ? styles.activeText : styles.inactiveText}
          >
            Campus Store
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 rounded-full py-2 items-center justify-center"
          style={isUsed ? styles.activeTab : undefined}
          onPress={() => onTabChange('Used Market')}
        >
          <Text
            className="text-sm"
            style={isUsed ? styles.activeText : styles.inactiveText}
          >
            Used Market
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeText: {
    color: '#1C74E9',
    fontWeight: '700',
  },
  inactiveText: {
    color: '#64748b',
    fontWeight: '600',
  },
});
