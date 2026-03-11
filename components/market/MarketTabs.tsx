import { View, Text, TouchableOpacity } from "react-native";

interface MarketTabsProps {
  activeTab: 'Campus Store' | 'Used Market';
  onTabChange: (tab: 'Campus Store' | 'Used Market') => void;
}

export default function MarketTabs({ activeTab, onTabChange }: MarketTabsProps) {
  return (
    <View className="px-4 mt-2 mb-2">
      <View className="flex-row bg-slate-100 rounded-full p-1 border border-slate-200">
        <TouchableOpacity 
          className={`flex-1 rounded-full py-2 items-center justify-center ${activeTab === 'Campus Store' ? 'bg-white shadow-sm' : ''}`}
          onPress={() => onTabChange('Campus Store')}
        >
          <Text className={`text-sm ${activeTab === 'Campus Store' ? 'text-primary font-bold' : 'text-slate-500 font-semibold'}`}>
            Campus Store
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 rounded-full py-2 items-center justify-center ${activeTab === 'Used Market' ? 'bg-white shadow-sm' : ''}`}
          onPress={() => onTabChange('Used Market')}
        >
          <Text className={`text-sm ${activeTab === 'Used Market' ? 'text-primary font-bold' : 'text-slate-500 font-semibold'}`}>
            Used Market
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
