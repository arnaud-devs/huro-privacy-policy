import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function AuthButton({ title, className, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-3xl h-[52px] justify-center items-center mb-10 shadow-md shadow-primary/20 ${className ?? ""}`}
      {...props}
    >
      <Text className="text-white text-base font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}
