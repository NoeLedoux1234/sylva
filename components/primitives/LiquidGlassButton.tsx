import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useCallback, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

type LiquidGlassButtonSize = "sm" | "md";

type LiquidGlassButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  size?: LiquidGlassButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
};

const sizePadding: Record<LiquidGlassButtonSize, string> = {
  sm: "px-4 py-2.5",
  md: "px-5 py-3",
};

const sizeFont: Record<LiquidGlassButtonSize, string> = {
  sm: "text-[13px]",
  md: "text-[15px]",
};

export const LiquidGlassButton = ({
  children,
  onPress,
  size = "md",
  fullWidth = false,
  icon,
}: LiquidGlassButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 120 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 180 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPress?.();
  }, [onPress]);

  return (
    <Animated.View style={animatedStyle} className={fullWidth ? "w-full" : "self-start"}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        className={`relative overflow-hidden rounded-full ${sizePadding[size]} ${
          fullWidth ? "w-full" : ""
        }`}
      >
        <BlurView
          intensity={28}
          tint="dark"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: 1,
            borderColor: Colors.glassStroke,
            backgroundColor: Colors.glassTint,
          }}
        />
        <View
          className="absolute left-3 right-3 top-0 h-px rounded-full"
          style={{ backgroundColor: Colors.glassStrokeBright }}
        />
        <View className="flex-row items-center justify-center gap-2">
          {icon ? <View>{icon}</View> : null}
          <Text
            className={`text-bone tracking-tight font-medium ${sizeFont[size]}`}
            style={{ fontFamily: "Helvetica Neue" }}
          >
            {children}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};
