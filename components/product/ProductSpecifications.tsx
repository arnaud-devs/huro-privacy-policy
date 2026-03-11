import { View, Text } from "react-native";

interface Spec {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specs: Spec[];
}

export default function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  return (
    <View className="mx-4 mt-6">
      <Text className="text-lg font-bold text-slate-900 mb-3">Specifications</Text>

      {specs.map((spec, index) => (
        <View
          key={index}
          className="flex-row justify-between py-3 border-b border-slate-100"
        >
          <Text className="text-sm text-slate-500">{spec.label}</Text>
          <Text className="text-sm font-semibold text-slate-900">{spec.value}</Text>
        </View>
      ))}
    </View>
  );
}
