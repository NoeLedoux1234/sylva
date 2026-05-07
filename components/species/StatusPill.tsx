import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GlassCard } from "@/components/primitives/GlassCard";
import { Colors } from "@/constants/theme";

enum ConservationKey {
  LeastConcern = "least concern",
  NearThreatened = "near threatened",
  Vulnerable = "vulnerable",
  Endangered = "endangered",
  CriticallyEndangered = "critically endangered",
  Extinct = "extinct",
}

const dotColorByKey: Record<ConservationKey, string> = {
  [ConservationKey.LeastConcern]: Colors.moss300,
  [ConservationKey.NearThreatened]: "#E0C66A",
  [ConservationKey.Vulnerable]: "#E08A4A",
  [ConservationKey.Endangered]: "#D85C5C",
  [ConservationKey.CriticallyEndangered]: "#F08080",
  [ConservationKey.Extinct]: Colors.boneDim,
};

const isConservationKey = (value: string): value is ConservationKey => {
  const known: readonly string[] = Object.values(ConservationKey);
  return known.includes(value);
};

type StatusPillProps = {
  label: string;
  variant?: "conservation" | "neutral" | "soft";
  delayMs?: number;
};

const formatLabel = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return raw;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const resolveDotColor = (label: string, variant: StatusPillProps["variant"]): string => {
  if (variant !== "conservation") return Colors.moss300;
  const normalized = label.trim().toLowerCase();
  if (isConservationKey(normalized)) {
    return dotColorByKey[normalized];
  }
  return Colors.bone;
};

const StatusPillComponent = ({
  label,
  variant = "neutral",
  delayMs = 0,
}: StatusPillProps) => {
  const dotColor = useMemo(() => resolveDotColor(label, variant), [label, variant]);
  const formatted = useMemo(() => formatLabel(label), [label]);

  return (
    <Animated.View entering={FadeInDown.duration(360).delay(delayMs)}>
      <GlassCard rounded="pill">
        <View className="flex-row items-center gap-2 px-3.5 py-1.5">
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              backgroundColor: dotColor,
            }}
          />
          <Text
            className="text-bone text-[11px] uppercase"
            style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.6 }}
          >
            {formatted}
          </Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

export const StatusPill = memo(StatusPillComponent);
