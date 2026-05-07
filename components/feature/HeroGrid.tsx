import { memo } from "react";
import { Text, View } from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { FeatureCard } from "@/components/feature/FeatureCard";
import { HeadlineStack } from "@/components/feature/HeadlineStack";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Videos, VideoKey } from "@/constants/videos";

type HeroGridProps = {
  onFocusSearchPress?: () => void;
  scrollY?: SharedValue<number>;
};

const HeroGridComponent = ({ onFocusSearchPress, scrollY }: HeroGridProps) => {
  const animatedHeroStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }
    const value = scrollY.value;
    return {
      opacity: interpolate(value, [0, 140], [1, 0], "clamp"),
      transform: [{ translateY: Math.min(0, -value * 0.25) }],
    };
  });

  return (
    <View className="px-5 pt-6 pb-4">
      <Animated.View style={animatedHeroStyle}>
        <View className="h-px w-10 bg-white/30" />
        <Text
          className="mt-3 text-[10px] uppercase text-white/55"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 3 }}
        >
          Sylva — Atlas of the wild
        </Text>

        <View className="mt-4">
          <HeadlineStack
            line1="Discover the wild."
            line2="From canopy to roots."
          />
        </View>
      </Animated.View>

      <View className="mt-6 gap-4">
        <FeatureCard
          variant="tall"
          videoSource={Videos[VideoKey.ForestDawn]}
          topLeft={<SectionLabel>01/</SectionLabel>}
          topRight={<SectionLabel align="right">Found in the wild</SectionLabel>}
          title={"Every species\nhas a story."}
          subtitle="Search through millions of living things curated by naturalists. Start a journey into life on Earth."
        />

        <FeatureCard
          variant="wide"
          videoSource={Videos[VideoKey.MistRiver]}
          topLeft={
            <Text
              className="text-bone text-2xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Where nature begins
            </Text>
          }
          topRight={<SectionLabel align="right">02/</SectionLabel>}
        />

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FeatureCard
              variant="regular"
              videoSource={Videos[VideoKey.Canopy]}
              topLeft={<SectionLabel>In real time</SectionLabel>}
              topRight={<SectionLabel align="right">03/</SectionLabel>}
              subtitle="From canopy to roots, every tap is a step deeper into the living world."
              ctaLabel="Begin exploring"
              onCtaPress={onFocusSearchPress}
            />
          </View>
          <View className="flex-1">
            <FeatureCard
              variant="regular"
              videoSource={Videos[VideoKey.MossClose]}
              topLeft={<SectionLabel>Just ask</SectionLabel>}
              topRight={<SectionLabel align="right">04/</SectionLabel>}
              alignBottomCenter
              subtitle={"Curated by\nnaturalists."}
            />
          </View>
        </View>
      </View>

      <View className="mt-12">
        <View className="h-px w-10 bg-white/30" />
        <Text
          className="mt-3 text-bone text-3xl font-normal tracking-tight"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Browse the encyclopedia.
        </Text>
        <Text
          className="text-white/45 text-3xl font-normal tracking-tight"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Find what calls you.
        </Text>
      </View>
    </View>
  );
};

export const HeroGrid = memo(HeroGridComponent);
