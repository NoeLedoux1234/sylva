import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { CardVideo } from "@/components/primitives/CardVideo";
import { Videos, VideoKey } from "@/constants/videos";

type SylvaSplashProps = {
  onFinish: () => void;
};

export const SylvaSplash = ({ onFinish }: SylvaSplashProps) => {
  const progress = useSharedValue(0);
  const hasFinished = useSharedValue(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(900, withTiming(2, { duration: 320 })),
    );
  }, [progress]);

  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      if (hasFinished.value) return;
      if (current >= 1.95) {
        hasFinished.value = true;
        runOnJS(handleFinish)();
      }
    },
    [],
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [1.6, 2], [1, 0], "clamp"),
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1, 1.6, 2],
      [0, 1, 1, 0],
      "clamp",
    ),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [12, 0], "clamp"),
      },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0 bg-ink-deep z-50 items-center justify-center"
      style={overlayStyle}
    >
      <CardVideo source={Videos[VideoKey.GoldenHour]} tint={0.55} />
      <Animated.View
        className="items-center justify-center"
        style={wordmarkStyle}
      >
        <View className="w-12 h-px bg-bone/60" />
        <Text
          className="mt-4 text-bone text-7xl font-medium"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 22 }}
        >
          SYLVA
        </Text>
        <Text
          className="mt-3 text-white/60 text-sm uppercase"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 7 }}
        >
          Atlas of the wild
        </Text>
      </Animated.View>
    </Animated.View>
  );
};
