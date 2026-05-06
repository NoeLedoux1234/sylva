import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { ScrollView, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { TaxonSummary } from "@/types/taxon";

type AncestryStripProps = {
  ancestors: TaxonSummary[];
};

const AncestryStripComponent = ({ ancestors }: AncestryStripProps) => {
  if (ancestors.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      {ancestors.map((ancestor, index) => {
        const isLast = index === ancestors.length - 1;
        return (
          <View key={ancestor.id} className="flex-row items-center">
            <View className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.05]">
              <Text
                className="text-bone/80 text-[11px] uppercase"
                style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.4 }}
              >
                {ancestor.name}
              </Text>
            </View>
            {isLast ? null : (
              <View className="px-1.5">
                <Ionicons
                  name="chevron-forward"
                  size={11}
                  color={Colors.boneDim}
                />
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export const AncestryStrip = memo(AncestryStripComponent);
