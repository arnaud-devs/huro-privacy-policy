import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

export function HapticTab({ children, style, onPressIn, onPress, onLongPress, testID, accessibilityRole }: BottomTabBarButtonProps) {
  return (
    <Pressable
      style={typeof style === 'function' ? undefined : style}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
      testID={testID}
      accessibilityRole={accessibilityRole}
    >
      {typeof children === 'function' ? children({ pressed: false, hovered: false }) : children}
    </Pressable>
  );
}
