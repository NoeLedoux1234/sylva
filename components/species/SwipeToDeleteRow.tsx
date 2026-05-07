import { Ionicons } from "@expo/vector-icons";
import { memo, type ReactNode, useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const REVEAL_THRESHOLD = 120;

type SwipeToDeleteRowProps = {
  id: number;
  onDelete: (id: number) => void;
  children: ReactNode;
};

const SwipeToDeleteRowComponent = ({
  id,
  onDelete,
  children,
}: SwipeToDeleteRowProps) => {
  const tx = useSharedValue(0);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .onUpdate((e) => {
          "worklet";
          tx.value = Math.min(0, e.translationX);
        })
        .onEnd(() => {
          "worklet";
          if (tx.value < -REVEAL_THRESHOLD) {
            tx.value = withTiming(
              -SCREEN_WIDTH,
              { duration: 240 },
              (finished) => {
                if (finished) runOnJS(onDelete)(id);
              },
            );
          } else {
            tx.value = withTiming(0, { duration: 220 });
          }
        }),
    [tx, id, onDelete],
  );

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  const revealStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, -tx.value / REVEAL_THRESHOLD),
  }));

  return (
    <View className="relative">
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: Colors.destructiveBg,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.destructiveBorder,
          },
          revealStyle,
        ]}
      >
        <View className="flex-1 flex-row items-center justify-end pr-6 gap-2">
          <Text
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{
              fontFamily: "Helvetica Neue",
              color: Colors.destructiveIcon,
            }}
          >
            Remove
          </Text>
          <Ionicons
            name="trash-outline"
            size={18}
            color={Colors.destructiveIcon}
          />
        </View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[{ backgroundColor: Colors.inkDeep }, rowStyle]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export const SwipeToDeleteRow = memo(SwipeToDeleteRowComponent);
