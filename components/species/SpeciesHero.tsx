import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

const HERO_HEIGHT = 460;
const PARALLAX_FACTOR = 0.4;
const ZOOM_DIVISOR = 600;

type SpeciesHeroProps = {
  photoUrl: string | null;
  scrollY: SharedValue<number>;
  onDoubleTap: () => void;
};

const SpeciesHeroComponent = ({
  photoUrl,
  scrollY,
  onDoubleTap,
}: SpeciesHeroProps) => {
  const heartScale = useSharedValue<number>(0);

  const doubleTap = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .maxDuration(280)
        .onEnd((_event, success) => {
          "worklet";
          if (!success) return;
          heartScale.value = withSequence(
            withTiming(1.2, { duration: 220 }),
            withTiming(1, { duration: 120 }),
            withDelay(180, withTiming(0, { duration: 200 })),
          );
          runOnJS(onDoubleTap)();
        }),
    [onDoubleTap, heartScale],
  );

  const imageStyle = useAnimatedStyle(() => {
    const translateY = scrollY.value * PARALLAX_FACTOR;
    const overPull = Math.max(0, -scrollY.value);
    const scale = 1 + overPull / ZOOM_DIVISOR;
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartScale.value > 0 ? 1 : 0,
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <View
      className="w-full overflow-hidden bg-ink-soft"
      style={{ height: HERO_HEIGHT }}
    >
      <GestureDetector gesture={doubleTap}>
        <Animated.View
          style={[{ width: "100%", height: HERO_HEIGHT }, imageStyle]}
        >
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={400}
              placeholder={{ blurhash: "L7E.{rRj00xu_3RjM{xu00ay~qof" }}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-moss-800">
              <Ionicons name="leaf-outline" size={64} color={Colors.boneDim} />
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 bottom-0"
        style={{ height: 220 }}
      >
        <View className="flex-1" />
        <View style={{ height: 80, backgroundColor: "rgba(5,7,6,0.35)" }} />
        <View style={{ height: 80, backgroundColor: "rgba(5,7,6,0.75)" }} />
        <View style={{ height: 60, backgroundColor: Colors.inkDeep }} />
      </View>

      <View
        pointerEvents="none"
        className="absolute inset-0 items-center justify-center"
      >
        <Animated.View style={heartStyle}>
          <Ionicons name="heart" size={120} color={Colors.bone} />
        </Animated.View>
      </View>
    </View>
  );
};

export const SpeciesHero = memo(SpeciesHeroComponent);
