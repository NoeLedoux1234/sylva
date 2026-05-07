import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CardVideo } from "@/components/primitives/CardVideo";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import type { Collection } from "@/constants/collections";
import { Colors } from "@/constants/theme";
import { Videos } from "@/constants/videos";

const SCREEN_WIDTH = Dimensions.get("window").width;

type CollectionPageProps = {
  collection: Collection;
  isActive: boolean;
  onPressEnter: (slug: string) => void;
};

const CollectionPageComponent = ({
  collection,
  isActive,
  onPressEnter,
}: CollectionPageProps) => {
  const titleLines = collection.title.split("\n");

  const handlePress = useCallback(() => {
    onPressEnter(collection.slug);
  }, [collection.slug, onPressEnter]);

  return (
    <View
      className="flex-1 bg-ink-deep h-full"
      style={{ width: SCREEN_WIDTH }}
    >
      {isActive ? (
        <CardVideo source={Videos[collection.videoKey]} tint={0.45} />
      ) : null}

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-0"
        style={{ height: "25%" }}
      >
        <View className="flex-1 bg-black/30" />
        <View className="flex-1 bg-black/15" />
        <View className="flex-1" />
      </View>

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 bottom-0"
        style={{ height: "55%" }}
      >
        <View className="flex-1" />
        <View className="flex-1 bg-black/40" />
        <View className="flex-1 bg-black/75" />
      </View>

      <Animated.View
        entering={FadeInUp.duration(420).delay(80)}
        className="absolute left-0 right-0 bottom-0 px-7 pb-32"
      >
        <SectionLabel>{collection.accentLabel}</SectionLabel>
        <View className="w-10 h-px bg-bone/30 mt-2" />
        <View className="mt-5">
          {titleLines.map((line, index) => (
            <Text
              key={`${collection.slug}-line-${index}`}
              className="text-bone text-5xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 50 }}
              numberOfLines={1}
            >
              {line}
            </Text>
          ))}
        </View>
        <Text
          className="mt-4 text-bone/85 text-base"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 22 }}
        >
          {collection.subtitle}
        </Text>
        <Text
          className="mt-3 text-white/55 text-sm"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
          numberOfLines={3}
        >
          {collection.description}
        </Text>
        <View className="mt-7">
          <LiquidGlassButton
            onPress={handlePress}
            trailingIcon={
              <Ionicons name="chevron-forward" size={16} color={Colors.bone} />
            }
          >
            Entrer dans le voyage
          </LiquidGlassButton>
        </View>
      </Animated.View>
    </View>
  );
};

export const CollectionPage = memo(CollectionPageComponent);
