import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  iconName,
  isPassword,
  ...props
}: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-8">
      <Text className="text-sm font-semibold text-slate-900 mb-2">{label}</Text>
      <View className="flex-row items-center border border-slate-200 rounded-xl px-4 h-[52px] bg-white">
        <Ionicons
          name={iconName}
          size={20}
          color="#8D94A2"
          className="mr-2.5"
        />
        <TextInput
          className="flex-1 text-base text-slate-900"
          placeholderTextColor="#A0A5B1"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-2 -mr-2"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#8D94A2"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
