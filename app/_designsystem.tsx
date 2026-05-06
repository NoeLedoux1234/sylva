import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeatureCard } from "@/components/feature/FeatureCard";
import { HeadlineStack } from "@/components/feature/HeadlineStack";
import { Divider } from "@/components/primitives/Divider";
import { GlassCard } from "@/components/primitives/GlassCard";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Videos, VideoKey } from "@/constants/videos";

export default function DesignSystemPreview() {
  return (
    <View className="flex-1 bg-ink-deep">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-6">
            <SectionLabel>01 / Sylva Design System</SectionLabel>
            <View className="mt-4">
              <HeadlineStack
                line1="Wander the wild,"
                line2="catalogue the living."
              />
            </View>
          </View>

          <View className="gap-3">
            <SectionLabel>02 / Buttons</SectionLabel>
            <View className="flex-row flex-wrap gap-3">
              <LiquidGlassButton size="md" onPress={() => undefined}>
                Discover species
              </LiquidGlassButton>
              <LiquidGlassButton size="sm" onPress={() => undefined}>
                Read more
              </LiquidGlassButton>
            </View>
            <LiquidGlassButton size="md" fullWidth onPress={() => undefined}>
              Open the herbier
            </LiquidGlassButton>
          </View>

          <View className="gap-3">
            <SectionLabel>03 / Glass card</SectionLabel>
            <GlassCard>
              <View className="p-6 gap-3">
                <Text
                  className="text-bone text-xl font-medium tracking-tight"
                  style={{ fontFamily: "Helvetica Neue" }}
                >
                  Translucent surface
                </Text>
                <Divider />
                <Text
                  className="text-white/65 text-sm"
                  style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
                >
                  A blurred backdrop layered with a hairline border and a
                  warm tint. Use it for floating filters, search inputs, and
                  inline metadata.
                </Text>
              </View>
            </GlassCard>
          </View>

          <View className="gap-3">
            <SectionLabel>04 / Feature cards</SectionLabel>
            <FeatureCard
              variant="tall"
              videoSource={Videos[VideoKey.ForestDawn]}
              topLeft="01 / In real time"
              topRight="Forest dawn"
              title="A canopy that breathes."
              subtitle="Browse the living taxonomy of the wild — from lichens to giants — composed under a moving sky."
              ctaLabel="Enter the forest"
              onCtaPress={() => undefined}
            />
            <FeatureCard
              variant="wide"
              videoSource={Videos[VideoKey.MossClose]}
              topLeft="02 / Texture"
              topRight="Moss"
              title="The smallest worlds."
              subtitle="Bryophytes, fungi, and the quiet residents of the forest floor."
              ctaLabel="Explore"
              onCtaPress={() => undefined}
            />
            <FeatureCard
              variant="regular"
              videoSource={Videos[VideoKey.GoldenHour]}
              topLeft="03 / Centered"
              alignBottomCenter
              title="Golden hour."
              subtitle="A short loop, perfectly held."
              ctaLabel="Save"
              onCtaPress={() => undefined}
            />
          </View>

          <View className="gap-3">
            <SectionLabel>05 / Divider</SectionLabel>
            <View className="h-12 justify-center">
              <Divider />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
