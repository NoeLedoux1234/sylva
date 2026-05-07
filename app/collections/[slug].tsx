import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  FadeInUp,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CardVideo } from "@/components/primitives/CardVideo";
import { GlassCard } from "@/components/primitives/GlassCard";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { SpeciesPhotoCard } from "@/components/species/SpeciesPhotoCard";
import {
  type Collection,
  findCollection,
} from "@/constants/collections";
import { Colors } from "@/constants/theme";
import { Videos } from "@/constants/videos";
import { useCollectionTaxa } from "@/hooks/useCollectionTaxa";
import type { Taxon } from "@/types/taxon";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = SCREEN_HEIGHT * 0.6;
const PARALLAX_FACTOR = 0.4;
const ZOOM_DIVISOR = 600;
const SHIMMER_DURATION_MS = 850;
const SKELETON_KEYS: number[] = [0, 1, 2, 3, 4, 5];
const MAX_STAGGER_INDEX = 11;

type GridPair = readonly [Taxon, Taxon | null];

const buildPairs = (taxa: readonly Taxon[]): GridPair[] => {
  const pairs: GridPair[] = [];
  for (let index = 0; index < taxa.length; index += 2) {
    const first = taxa[index];
    const second = index + 1 < taxa.length ? taxa[index + 1] : null;
    pairs.push([first, second]);
  }
  return pairs;
};

const SkeletonCardComponent = () => {
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: SHIMMER_DURATION_MS }),
        withTiming(0, { duration: SHIMMER_DURATION_MS }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.04 + progress.value * 0.06,
  }));

  return (
    <View className="flex-1 aspect-[3/4] rounded-card overflow-hidden bg-white/[0.04]">
      <Animated.View
        className="bg-bone"
        style={[{ width: "100%", height: "100%" }, shimmerStyle]}
      />
    </View>
  );
};

const SkeletonCard = memo(SkeletonCardComponent);

type CollectionHeroProps = {
  collection: Collection;
  scrollY: SharedValue<number>;
};

const CollectionHero = ({ collection, scrollY }: CollectionHeroProps) => {
  const titleLines = collection.title.split("\n");

  const heroStyle = useAnimatedStyle(() => {
    const translateY = scrollY.value * PARALLAX_FACTOR;
    const overPull = Math.max(0, -scrollY.value);
    const scale = 1 + overPull / ZOOM_DIVISOR;
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View
      className="w-full overflow-hidden bg-ink-soft"
      style={{ height: HERO_HEIGHT }}
    >
      <Animated.View
        style={[{ width: "100%", height: HERO_HEIGHT }, heroStyle]}
      >
        <CardVideo source={Videos[collection.videoKey]} tint={0.5} />
      </Animated.View>

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 top-0"
        style={{ height: "30%" }}
      >
        <View className="flex-1 bg-black/40" />
        <View className="flex-1 bg-black/20" />
        <View className="flex-1" />
      </View>

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 bottom-0"
        style={{ height: "55%" }}
      >
        <View className="flex-1" />
        <View className="flex-1 bg-black/40" />
        <View className="flex-1 bg-black/80" />
      </View>

      <View className="absolute left-0 right-0 bottom-0 px-7 pb-12">
        <SectionLabel>{collection.accentLabel}</SectionLabel>
        <View className="w-10 h-px bg-bone/30 mt-2" />
        <View className="mt-4">
          {titleLines.map((line, index) => (
            <Text
              key={`hero-line-${index}`}
              className="text-bone text-4xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 40 }}
              numberOfLines={1}
            >
              {line}
            </Text>
          ))}
        </View>
        <Text
          className="mt-3 text-bone/85 text-sm"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
        >
          {collection.subtitle}
        </Text>
        <Text
          className="mt-2 text-white/55 text-sm"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
          numberOfLines={3}
        >
          {collection.description}
        </Text>
      </View>
    </View>
  );
};

type CollectionGridProps = {
  taxa: readonly Taxon[];
  onPressTaxon: (id: number) => void;
};

const CollectionGrid = ({ taxa, onPressTaxon }: CollectionGridProps) => {
  const pairs = useMemo(() => buildPairs(taxa), [taxa]);
  return (
    <View>
      {pairs.map(([first, second], rowIndex) => {
        const firstStaggerIndex = Math.min(rowIndex * 2, MAX_STAGGER_INDEX);
        const secondStaggerIndex = Math.min(rowIndex * 2 + 1, MAX_STAGGER_INDEX);
        return (
          <View
            key={`row-${first.id}`}
            className="flex-row gap-4 mb-4"
          >
            <Animated.View
              className="flex-1"
              entering={FadeInUp.duration(360).delay(firstStaggerIndex * 40)}
            >
              <SpeciesPhotoCard taxon={first} onPress={onPressTaxon} />
            </Animated.View>
            {second ? (
              <Animated.View
                className="flex-1"
                entering={FadeInUp.duration(360).delay(secondStaggerIndex * 40)}
              >
                <SpeciesPhotoCard taxon={second} onPress={onPressTaxon} />
              </Animated.View>
            ) : (
              <View className="flex-1" />
            )}
          </View>
        );
      })}
    </View>
  );
};

const CollectionSkeletonGrid = () => (
  <View>
    {[0, 1, 2].map((rowIndex) => {
      const first = SKELETON_KEYS[rowIndex * 2];
      const second = SKELETON_KEYS[rowIndex * 2 + 1];
      return (
        <View key={`skeleton-row-${rowIndex}`} className="flex-row gap-4 mb-4">
          <SkeletonCard key={`skeleton-${first}`} />
          <SkeletonCard key={`skeleton-${second}`} />
        </View>
      );
    })}
  </View>
);

const CollectionDetail = () => {
  const params = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const collection = useMemo(() => findCollection(slug), [slug]);
  const taxonIds = useMemo(
    () => collection?.taxonIds ?? [],
    [collection],
  );
  const { taxa, loading, error, refresh } = useCollectionTaxa(taxonIds);

  const scrollY = useSharedValue<number>(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }, [router]);

  const handlePressTaxon = useCallback(
    (id: number) => {
      router.push({ pathname: "/species/[id]", params: { id: String(id) } });
    },
    [router],
  );

  if (!collection) {
    return (
      <View className="flex-1 bg-ink-deep items-center justify-center px-6">
        <GlassCard rounded="card">
          <View className="p-7 gap-4 items-start">
            <Text
              className="text-bone text-xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Collection introuvable
            </Text>
            <Text
              className="text-white/60 text-sm"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
            >
              Cette collection n&apos;existe plus ou n&apos;a jamais existé.
            </Text>
            <LiquidGlassButton
              size="sm"
              onPress={handleBack}
              icon={
                <Ionicons name="chevron-back" size={14} color={Colors.bone} />
              }
            >
              Retour
            </LiquidGlassButton>
          </View>
        </GlassCard>
      </View>
    );
  }

  const showSkeletons = loading && taxa.length === 0;
  const showErrorState = !loading && taxa.length === 0 && error !== null;

  return (
    <View className="flex-1 bg-ink-deep">
      <View
        className="absolute left-5 z-10"
        style={{ top: insets.top + 8 }}
      >
        <LiquidGlassButton
          size="sm"
          onPress={handleBack}
          icon={
            <Ionicons name="chevron-back" size={16} color={Colors.bone} />
          }
        >
          Retour
        </LiquidGlassButton>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        <CollectionHero collection={collection} scrollY={scrollY} />

        <View className="-mt-8 rounded-t-3xl bg-ink-deep px-5 pt-8 pb-32">
          <SectionLabel>Espèces sélectionnées</SectionLabel>
          <Text
            className="mt-2 text-white/55 text-sm"
            style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
          >
            Six fenêtres ouvertes sur ce voyage.
          </Text>

          <View className="mt-6">
            {showSkeletons ? (
              <CollectionSkeletonGrid />
            ) : showErrorState ? (
              <View className="py-6">
                <GlassCard rounded="card">
                  <View className="p-7 gap-4 items-start">
                    <Text
                      className="text-bone text-xl font-medium tracking-tight"
                      style={{ fontFamily: "Helvetica Neue" }}
                    >
                      Impossible de charger les espèces
                    </Text>
                    <Text
                      className="text-white/60 text-sm"
                      style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
                    >
                      {error}
                    </Text>
                    <LiquidGlassButton size="sm" onPress={refresh}>
                      Réessayer
                    </LiquidGlassButton>
                  </View>
                </GlassCard>
              </View>
            ) : (
              <CollectionGrid taxa={taxa} onPressTaxon={handlePressTaxon} />
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default CollectionDetail;
