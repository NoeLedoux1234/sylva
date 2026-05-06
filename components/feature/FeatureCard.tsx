import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { CardVideo } from "@/components/primitives/CardVideo";
import { Divider } from "@/components/primitives/Divider";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { Colors, Radius } from "@/constants/theme";

type FeatureCardVariant = "tall" | "wide" | "regular";

type FeatureCardProps = {
  variant?: FeatureCardVariant;
  videoSource: string;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  onPress?: () => void;
  alignBottomCenter?: boolean;
  children?: ReactNode;
};

const variantMinHeight: Record<FeatureCardVariant, number> = {
  tall: 420,
  wide: 230,
  regular: 260,
};

export const FeatureCard = ({
  variant = "regular",
  videoSource,
  topLeft,
  topRight,
  title,
  subtitle,
  ctaLabel,
  onCtaPress,
  onPress,
  alignBottomCenter = false,
  children,
}: FeatureCardProps) => {
  const minHeight = variantMinHeight[variant];

  const content = (
    <View
      className="relative overflow-hidden"
      style={{
        borderRadius: Radius.card,
        backgroundColor: Colors.cardBase,
        minHeight,
      }}
    >
      <CardVideo source={videoSource} tint={0.35} />
      <View className="flex-1 p-7 z-10" style={{ minHeight }}>
        {topLeft || topRight ? (
          <View className="flex-row items-start justify-between">
            <View className="flex-shrink">
              {typeof topLeft === "string" ? (
                <Text
                  className="text-sm text-white/60"
                  style={{ fontFamily: "Helvetica Neue" }}
                >
                  {topLeft}
                </Text>
              ) : (
                topLeft
              )}
            </View>
            <View className="flex-shrink">
              {typeof topRight === "string" ? (
                <Text
                  className="text-sm text-white/60"
                  style={{ fontFamily: "Helvetica Neue" }}
                >
                  {topRight}
                </Text>
              ) : (
                topRight
              )}
            </View>
          </View>
        ) : null}

        <View className="flex-1" />

        {children ? (
          <View className={alignBottomCenter ? "items-center" : "items-start"}>
            {children}
          </View>
        ) : null}

        {title || subtitle || ctaLabel ? (
          <View className={alignBottomCenter ? "items-center" : "items-start"}>
            {title ? (
              <Text
                className="text-2xl font-medium text-white tracking-tight"
                style={{ fontFamily: "Helvetica Neue" }}
              >
                {title}
              </Text>
            ) : null}
            {title && subtitle ? (
              <View className="w-full mt-3">
                <Divider />
              </View>
            ) : null}
            {subtitle ? (
              <Text
                className={`text-xs text-white/75 mt-3 ${
                  alignBottomCenter ? "text-center" : ""
                }`}
                style={{ fontFamily: "Helvetica Neue", lineHeight: 18 }}
              >
                {subtitle}
              </Text>
            ) : null}
            {ctaLabel ? (
              <View className="mt-4">
                <LiquidGlassButton size="sm" onPress={onCtaPress}>
                  {ctaLabel}
                </LiquidGlassButton>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};
