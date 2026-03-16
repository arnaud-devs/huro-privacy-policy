import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export default function AuthButton({ title, className, isLoading, disabled, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-3xl h-[52px] justify-center items-center mb-10 shadow-md shadow-primary/20 ${className ?? ""} ${disabled || isLoading ? "opacity-70" : ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-base font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
