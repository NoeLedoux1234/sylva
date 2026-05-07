import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";
import type { Taxon } from "@/types/taxon";

type SpeciesPhotoCardProps = {
  taxon: Taxon;
  onPress: (id: number) => void;
};

const resolvePhotoUrl = (taxon: Taxon): string | null =>
  taxon.defaultPhotoLarge ?? taxon.photo?.url ?? null;

const SpeciesPhotoCardComponent = ({
  taxon,
  onPress,
}: SpeciesPhotoCardProps) => {
  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: 120 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 180 });
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress(taxon.id);
  }, [onPress, taxon.id]);

  const photoUrl = resolvePhotoUrl(taxon);
  const displayName = taxon.preferredCommonName || taxon.name;
  const showScientific =
    Boolean(taxon.preferredCommonName) &&
    taxon.preferredCommonName !== taxon.name;

  return (
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${displayName}`}
        className="aspect-[3/4] rounded-card overflow-hidden bg-white/[0.04] relative"
      >
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
            placeholder={{ blurhash: "L7E.{rRj00xu_3RjM{xu00ay~qof" }}
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-moss-800">
            <Ionicons name="leaf-outline" size={28} color={Colors.boneDim} />
          </View>
        )}

        <View
          pointerEvents="none"
          className="absolute left-0 right-0 bottom-0"
          style={{ height: "40%" }}
        >
          <View className="flex-1" />
          <View className="flex-1 bg-black/30" />
          <View className="flex-1 bg-black/70" />
        </View>

        <View className="absolute left-0 right-0 bottom-0 px-3 pb-3">
          <Text
            className="text-bone text-base font-medium"
            style={{ fontFamily: "Helvetica Neue", lineHeight: 18 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {displayName}
          </Text>
          {showScientific ? (
            <Text
              className="text-white/65 text-xs italic mt-0.5"
              style={{ fontFamily: "Helvetica Neue" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {taxon.name}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const SpeciesPhotoCard = memo(SpeciesPhotoCardComponent);
