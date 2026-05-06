import { memo, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type DiscoverStatusRowProps = {
  loading: boolean;
  error: string | null;
  totalResults: number;
  hasQuery: boolean;
};

const PULSE_DURATION_MS = 900;

const StatusMessage = ({
  loading,
  error,
  totalResults,
  hasQuery,
}: DiscoverStatusRowProps) => {
  if (error) {
    return (
      <Text
        className="text-[11px] uppercase text-red-300"
        style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
      >
        Couldn&apos;t reach iNaturalist
      </Text>
    );
  }
  if (loading && hasQuery) {
    return (
      <Text
        className="text-[11px] uppercase text-white/55"
        style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
      >
        Searching…
      </Text>
    );
  }
  if (!loading && totalResults > 0) {
    return (
      <Text
        className="text-[11px] uppercase text-white/55"
        style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
      >
        {totalResults.toLocaleString()} results
      </Text>
    );
  }
  return (
    <Text
      className="text-[11px] uppercase text-white/40"
      style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
    >
      Living atlas
    </Text>
  );
};

const DiscoverStatusRowComponent = ({
  loading,
  error,
  totalResults,
  hasQuery,
}: DiscoverStatusRowProps) => {
  const pulse = useSharedValue<number>(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PULSE_DURATION_MS }),
        withTiming(0.4, { duration: PULSE_DURATION_MS }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(pulse);
    };
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View className="mt-2 mb-2 px-6 flex-row items-center justify-between">
      <StatusMessage
        loading={loading}
        error={error}
        totalResults={totalResults}
        hasQuery={hasQuery}
      />
      <View className="flex-row items-center gap-2">
        <Animated.View
          className="w-1.5 h-1.5 rounded-full bg-moss-300"
          style={dotStyle}
        />
        <Text
          className="text-[11px] uppercase text-white/55"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
        >
          Live
        </Text>
      </View>
    </View>
  );
};

export const DiscoverStatusRow = memo(DiscoverStatusRowComponent);
