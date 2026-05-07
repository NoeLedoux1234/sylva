import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { memo, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabIconConfig = {
  active: IoniconName;
  inactive: IoniconName;
};

const ICONS: Record<string, TabIconConfig> = {
  index: { active: "leaf", inactive: "leaf-outline" },
  herbier: { active: "bookmark", inactive: "bookmark-outline" },
};

const FALLBACK_ICON: TabIconConfig = {
  active: "ellipse",
  inactive: "ellipse-outline",
};

type TabSelectHandler = (
  routeKey: string,
  routeName: string,
  isFocused: boolean
) => void;

type TabItemProps = {
  routeKey: string;
  routeName: string;
  isFocused: boolean;
  label: string;
  iconConfig: TabIconConfig;
  onSelect: TabSelectHandler;
};

const TabItem = memo(
  ({
    routeKey,
    routeName,
    isFocused,
    label,
    iconConfig,
    onSelect,
  }: TabItemProps) => {
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

    const onPressActual = useCallback(() => {
      onSelect(routeKey, routeName, isFocused);
    }, [onSelect, routeKey, routeName, isFocused]);

    const iconName = isFocused ? iconConfig.active : iconConfig.inactive;
    const iconColor = isFocused ? Colors.white : Colors.textMuted;

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={label}
          onPress={onPressActual}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: isFocused ? Colors.surfaceActive : "transparent",
          }}
        >
          <Ionicons name={iconName} size={16} color={iconColor} />
          <Text
            style={{
              fontFamily: "Helvetica Neue",
              fontSize: 12,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: isFocused ? Colors.white : Colors.textMuted,
            }}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }
);

TabItem.displayName = "TabItem";

export const SylvaTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomOffset = useMemo(
    () => Math.max(insets.bottom, 16) + 8,
    [insets.bottom]
  );

  const handlePress = useCallback<TabSelectHandler>(
    (routeKey, routeName, isFocused) => {
      const event = navigation.emit({
        type: "tabPress",
        target: routeKey,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        Haptics.selectionAsync();
        navigation.navigate(routeName);
      }
    },
    [navigation]
  );

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        alignItems: "center",
      }}
    >
      <View className="relative overflow-hidden rounded-full border border-white/10">
        <BlurView
          intensity={32}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: Colors.glassTint }}
        />
        <View
          className="absolute left-4 right-4 top-0 h-px rounded-full"
          style={{ backgroundColor: Colors.glassStrokeBright }}
        />
        <View className="flex-row items-center gap-1 px-2 py-2">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const descriptor = descriptors[route.key];
            const optionTitle = descriptor?.options.title;
            const label =
              typeof optionTitle === "string" ? optionTitle : route.name;
            const iconConfig = ICONS[route.name] ?? FALLBACK_ICON;
            return (
              <TabItem
                key={route.key}
                routeKey={route.key}
                routeName={route.name}
                isFocused={isFocused}
                label={label}
                iconConfig={iconConfig}
                onSelect={handlePress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};
