import { memo } from "react";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/primitives/GlassCard";
import { SectionLabel } from "@/components/primitives/SectionLabel";

type SpeciesStatsRowProps = {
  observationsCount: number;
  iconicTaxonName: string | null;
};

const SpeciesStatsRowComponent = ({
  observationsCount,
  iconicTaxonName,
}: SpeciesStatsRowProps) => {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <GlassCard rounded="card">
          <View className="p-5 gap-3">
            <SectionLabel>Observations</SectionLabel>
            <Text
              className="text-bone text-3xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              {observationsCount.toLocaleString()}
            </Text>
          </View>
        </GlassCard>
      </View>
      <View className="flex-1">
        <GlassCard rounded="card">
          <View className="p-5 gap-3">
            <SectionLabel>Iconic group</SectionLabel>
            <Text
              className="text-bone text-2xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {iconicTaxonName ?? "—"}
            </Text>
          </View>
        </GlassCard>
      </View>
    </View>
  );
};

export const SpeciesStatsRow = memo(SpeciesStatsRowComponent);
