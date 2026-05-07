import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { View } from "react-native";

import { Radius } from "@/constants/theme";

type GlassCardRounding = "card" | "field" | "pill";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  rounded?: GlassCardRounding;
};

const radiusMap: Record<GlassCardRounding, number> = {
  card: Radius.card,
  field: Radius.field,
  pill: Radius.pill,
};

export const GlassCard = ({
  children,
  className,
  intensity = 20,
  rounded = "card",
}: GlassCardProps) => {
  const borderRadius = radiusMap[rounded];

  return (
    <View
      className={`relative overflow-hidden border border-white/10 ${className ?? ""}`}
      style={{ borderRadius }}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View
        className="absolute inset-0 bg-white/[0.04]"
        style={{ borderRadius }}
      />
      {children}
    </View>
  );
};
