import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { TaxonSummary } from "@/types/taxon";

type SpeciesRowProps = {
  item: TaxonSummary;
  onPressItem: (id: number) => void;
};

const PLACEHOLDER_COLOR = Colors.moss800;

const SpeciesRowComponent = ({ item, onPressItem }: SpeciesRowProps) => {
  const handlePress = useCallback(() => {
    onPressItem(item.id);
  }, [item.id, onPressItem]);

  const displayName = item.preferredCommonName ?? item.name;
  const showScientific = item.preferredCommonName !== null;

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center py-3 px-5 border-b border-white/[0.06]"
      accessibilityRole="button"
      accessibilityLabel={`Open ${displayName}`}
    >
      {item.photo ? (
        <Image
          source={{ uri: item.photo.url }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            backgroundColor: PLACEHOLDER_COLOR,
          }}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: "L6E.{rRj00xu_3RjM{xu00ay~qof" }}
        />
      ) : (
        <View
          className="bg-moss-700 items-center justify-center"
          style={{ width: 64, height: 64, borderRadius: 14 }}
        >
          <Ionicons name="leaf-outline" size={22} color={Colors.boneDim} />
        </View>
      )}

      <View className="flex-1 ml-4">
        <Text
          className={`text-bone text-base font-medium ${
            showScientific ? "" : "italic"
          }`}
          style={{ fontFamily: "Helvetica Neue" }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayName}
        </Text>
        {showScientific ? (
          <Text
            className="text-white/55 text-sm italic"
            style={{ fontFamily: "Helvetica Neue" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        ) : null}
        <Text
          className="mt-1 text-[11px] uppercase text-white/40"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
          numberOfLines={1}
        >
          {item.rank}
          {item.iconicTaxonName ? ` · ${item.iconicTaxonName}` : ""}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Colors.boneDim} />
    </Pressable>
  );
};

export const SpeciesRow = memo(SpeciesRowComponent);
