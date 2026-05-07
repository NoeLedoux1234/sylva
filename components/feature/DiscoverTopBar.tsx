import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

type DiscoverTopBarProps = {
  onPressSearch: () => void;
  current: number;
  total: number;
};

const formatCount = (value: number): string =>
  value.toString().padStart(2, "0");

const DiscoverTopBarComponent = ({
  onPressSearch,
  current,
  total,
}: DiscoverTopBarProps) => {
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPressSearch();
  }, [onPressSearch]);

  return (
    <View
      className="absolute left-0 right-0 top-0 px-5 pb-3 flex-row items-center justify-between z-30"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Text
        className="text-bone text-[11px] uppercase"
        style={{ fontFamily: "Helvetica Neue", letterSpacing: 5.5 }}
      >
        SYLVA
      </Text>

      <Text
        className="text-white/55 text-[11px] uppercase"
        style={{ fontFamily: "Helvetica Neue", letterSpacing: 3.3 }}
      >
        {formatCount(current)} / {formatCount(total)}
      </Text>

      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Open search"
        className="w-11 h-11 rounded-full overflow-hidden items-center justify-center"
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
        <Ionicons name="search-outline" size={18} color={Colors.bone} />
      </Pressable>
    </View>
  );
};

export const DiscoverTopBar = memo(DiscoverTopBarComponent);
