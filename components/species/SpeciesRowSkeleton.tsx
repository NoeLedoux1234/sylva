import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type SpeciesRowSkeletonProps = {
  primaryWidth?: number;
  secondaryWidth?: number;
};

const SHIMMER_DURATION_MS = 850;

const SpeciesRowSkeletonComponent = ({
  primaryWidth = 180,
  secondaryWidth = 120,
}: SpeciesRowSkeletonProps) => {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: SHIMMER_DURATION_MS }),
        withTiming(0, { duration: SHIMMER_DURATION_MS }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.04 + progress.value * 0.06,
  }));

  return (
    <View className="flex-row items-center py-3 px-5 border-b border-white/[0.06]">
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        <Animated.View
          className="bg-bone"
          style={[{ width: "100%", height: "100%" }, shimmerStyle]}
        />
      </View>
      <View className="flex-1 ml-4 gap-2">
        <View
          style={{
            height: 14,
            width: primaryWidth,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        >
          <Animated.View
            className="bg-bone"
            style={[{ width: "100%", height: "100%" }, shimmerStyle]}
          />
        </View>
        <View
          style={{
            height: 12,
            width: secondaryWidth,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
        >
          <Animated.View
            className="bg-bone"
            style={[{ width: "100%", height: "100%" }, shimmerStyle]}
          />
        </View>
      </View>
    </View>
  );
};

export const SpeciesRowSkeleton = memo(SpeciesRowSkeletonComponent);
