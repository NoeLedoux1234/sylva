import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassCard } from "@/components/primitives/GlassCard";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { AncestryStrip } from "@/components/species/AncestryStrip";
import { SpeciesHero } from "@/components/species/SpeciesHero";
import { SpeciesStatsRow } from "@/components/species/SpeciesStatsRow";
import { StatusPill } from "@/components/species/StatusPill";
import { Colors } from "@/constants/theme";
import { useFavorites } from "@/hooks/useFavorites";
import { useTaxon } from "@/hooks/useTaxon";
import type { Taxon, TaxonSummary } from "@/types/taxon";

const parseTaxonId = (raw: string | string[] | undefined): number | undefined => {
  if (typeof raw !== "string") return undefined;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
};

const formatRank = (rank: string): string => {
  if (rank.length === 0) return rank;
  return rank.charAt(0).toUpperCase() + rank.slice(1);
};

const toSummary = (taxon: Taxon): TaxonSummary => ({
  id: taxon.id,
  name: taxon.name,
  preferredCommonName: taxon.preferredCommonName,
  rank: taxon.rank,
  photo: taxon.photo,
  iconicTaxonName: taxon.iconicTaxonName,
});

type FloatingControlsProps = {
  topInset: number;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
};

const FloatingControls = ({
  topInset,
  isFavorite,
  onBack,
  onToggleFavorite,
}: FloatingControlsProps) => {
  const heartButtonScale = useSharedValue<number>(0.85);

  useEffect(() => {
    heartButtonScale.value = withSpring(1, { damping: 14, stiffness: 180 });
  }, [heartButtonScale]);

  const heartButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartButtonScale.value }],
  }));

  const handleFavoritePressIn = useCallback(() => {
    heartButtonScale.value = withTiming(0.92, { duration: 110 });
  }, [heartButtonScale]);

  const handleFavoritePressOut = useCallback(() => {
    heartButtonScale.value = withSpring(1, { damping: 12, stiffness: 220 });
  }, [heartButtonScale]);

  return (
    <>
      <View
        className="absolute left-5 z-10"
        style={{ top: topInset + 8 }}
      >
        <LiquidGlassButton
          size="sm"
          onPress={onBack}
          icon={<Ionicons name="chevron-back" size={16} color={Colors.bone} />}
        >
          Back
        </LiquidGlassButton>
      </View>
      <Animated.View
        className="absolute right-5 z-10"
        style={[{ top: topInset + 8 }, heartButtonStyle]}
      >
        <Pressable
          onPress={onToggleFavorite}
          onPressIn={handleFavoritePressIn}
          onPressOut={handleFavoritePressOut}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? "Remove from herbier" : "Add to herbier"
          }
          className="w-11 h-11 rounded-full items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "rgba(10,14,11,0.55)",
            borderWidth: 1,
            borderColor: Colors.glassStroke,
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? Colors.moss300 : Colors.bone}
          />
        </Pressable>
      </Animated.View>
    </>
  );
};

const SpeciesDetail = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const taxonId = useMemo(() => parseTaxonId(params.id), [params.id]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { taxon, loading, error, refresh } = useTaxon(taxonId);
  const { add, remove, isFavorite } = useFavorites();

  const scrollY = useSharedValue<number>(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const favoriteOfThis = useMemo(
    () => (taxonId !== undefined ? isFavorite(taxonId) : false),
    [isFavorite, taxonId],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }, [router]);

  const handleToggleFavorite = useCallback(() => {
    if (!taxon) return;
    Haptics.selectionAsync();
    if (favoriteOfThis) {
      remove(taxon.id);
    } else {
      add(toSummary(taxon));
    }
  }, [taxon, favoriteOfThis, add, remove]);

  const handleAddOnDoubleTap = useCallback(() => {
    if (!taxon) return;
    if (favoriteOfThis) return;
    Haptics.selectionAsync();
    add(toSummary(taxon));
  }, [taxon, favoriteOfThis, add]);

  const handleOpenWikipedia = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  if (loading && !taxon) {
    return (
      <Animated.View
        entering={FadeIn.duration(220)}
        exiting={FadeOut.duration(160)}
        className="flex-1 bg-ink-deep items-center justify-center"
      >
        <ActivityIndicator color={Colors.moss300} />
        <Text
          className="mt-4 text-[11px] uppercase text-white/55"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
        >
          Loading species
        </Text>
      </Animated.View>
    );
  }

  if (error && !taxon) {
    return (
      <View className="flex-1 bg-ink-deep items-center justify-center px-6">
        <GlassCard rounded="card">
          <View className="p-7 gap-4 items-start">
            <Text
              className="text-bone text-xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Couldn&apos;t load this species
            </Text>
            <Text
              className="text-white/60 text-sm"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
            >
              {error}
            </Text>
            <View className="flex-row gap-3">
              <LiquidGlassButton size="sm" onPress={refresh}>
                Try again
              </LiquidGlassButton>
              <LiquidGlassButton size="sm" onPress={handleBack}>
                Go back
              </LiquidGlassButton>
            </View>
          </View>
        </GlassCard>
      </View>
    );
  }

  if (!taxon) {
    return (
      <View className="flex-1 bg-ink-deep items-center justify-center">
        <Text
          className="text-[11px] uppercase text-white/55"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 1.98 }}
        >
          No species selected
        </Text>
      </View>
    );
  }

  const heroPhotoUrl = taxon.defaultPhotoLarge ?? taxon.photo?.url ?? null;
  const displayName = taxon.preferredCommonName ?? taxon.name;
  const showScientific = taxon.preferredCommonName !== null;
  const wikipediaUrl = taxon.wikipediaUrl;

  return (
    <View className="flex-1 bg-ink-deep">
      <FloatingControls
        topInset={insets.top}
        isFavorite={favoriteOfThis}
        onBack={handleBack}
        onToggleFavorite={handleToggleFavorite}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        <SpeciesHero
          photoUrl={heroPhotoUrl}
          scrollY={scrollY}
          onDoubleTap={handleAddOnDoubleTap}
        />

        <View className="-mt-8 rounded-t-3xl bg-ink-deep px-5 pt-8">
          <Animated.View entering={FadeInDown.duration(420).delay(60)}>
            <SectionLabel>{formatRank(taxon.rank)}</SectionLabel>
            <Text
              className={`mt-2 text-bone text-[34px] font-medium tracking-tight ${
                showScientific ? "" : "italic"
              }`}
              style={{ fontFamily: "Helvetica Neue", lineHeight: 38 }}
            >
              {displayName}
            </Text>
            {showScientific ? (
              <Text
                className="mt-1 text-white/55 italic text-lg"
                style={{ fontFamily: "Helvetica Neue" }}
              >
                {taxon.name}
              </Text>
            ) : null}
          </Animated.View>

          <View className="mt-5 flex-row flex-wrap gap-2">
            {taxon.conservationStatus ? (
              <StatusPill
                label={taxon.conservationStatus}
                variant="conservation"
                delayMs={120}
              />
            ) : null}
            {taxon.iconicTaxonName ? (
              <StatusPill
                label={taxon.iconicTaxonName}
                variant="neutral"
                delayMs={180}
              />
            ) : null}
            {favoriteOfThis ? (
              <Animated.View
                entering={FadeIn.duration(260)}
                exiting={FadeOut.duration(180)}
              >
                <GlassCard rounded="pill">
                  <View className="flex-row items-center gap-1.5 px-3.5 py-1.5">
                    <Ionicons
                      name="bookmark"
                      size={11}
                      color={Colors.moss300}
                    />
                    <Text
                      className="text-bone text-[11px] uppercase"
                      style={{
                        fontFamily: "Helvetica Neue",
                        letterSpacing: 1.6,
                      }}
                    >
                      In your herbier
                    </Text>
                  </View>
                </GlassCard>
              </Animated.View>
            ) : null}
          </View>

          <View className="mt-8">
            <LiquidGlassButton
              fullWidth
              onPress={handleToggleFavorite}
              icon={
                <Ionicons
                  name={favoriteOfThis ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={favoriteOfThis ? Colors.moss300 : Colors.bone}
                />
              }
            >
              {favoriteOfThis ? "Remove from herbier" : "Add to herbier"}
            </LiquidGlassButton>
            <Text
              className="mt-3 text-[10px] uppercase text-white/40 text-center"
              style={{ fontFamily: "Helvetica Neue", letterSpacing: 2.4 }}
            >
              Double-tap the photo to collect
            </Text>
          </View>

          <View className="mt-10 gap-4">
            <SectionLabel>Lineage</SectionLabel>
            <AncestryStrip ancestors={taxon.ancestors} />
          </View>

          <View className="mt-10">
            <SpeciesStatsRow
              observationsCount={taxon.observationsCount}
              iconicTaxonName={taxon.iconicTaxonName}
            />
          </View>

          {wikipediaUrl !== null ? (
            <View className="mt-8">
              <LiquidGlassButton
                fullWidth
                onPress={() => handleOpenWikipedia(wikipediaUrl)}
                icon={
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={Colors.bone}
                  />
                }
              >
                Open Wikipedia
              </LiquidGlassButton>
            </View>
          ) : null}

          <View className="mt-12 mb-4 items-center">
            <Text
              className="text-[10px] uppercase text-white/35 text-center"
              style={{ fontFamily: "Helvetica Neue", letterSpacing: 2.4 }}
            >
              Powered by iNaturalist · Photos by their respective contributors
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default SpeciesDetail;
