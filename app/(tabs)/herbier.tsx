import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  type ListRenderItem,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { CardVideo } from "@/components/primitives/CardVideo";
import { GlassCard } from "@/components/primitives/GlassCard";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { HeadlineStack } from "@/components/feature/HeadlineStack";
import { SpeciesRow } from "@/components/species/SpeciesRow";
import { SwipeToDeleteRow } from "@/components/species/SwipeToDeleteRow";
import { Colors } from "@/constants/theme";
import { Videos, VideoKey } from "@/constants/videos";
import { useFavorites } from "@/hooks/useFavorites";
import type { FavoriteEntry } from "@/store/favorites-types";

const HerbierScreen = () => {
  const router = useRouter();
  const { state, remove, clear } = useFavorites();

  const entries = useMemo(() => state.entries, [state.entries]);
  const count = entries.length;

  const handlePressItem = useCallback(
    (id: number) => {
      router.push(`/species/${id}`);
    },
    [router],
  );

  const handleRemove = useCallback(
    (id: number) => {
      remove(id);
    },
    [remove],
  );

  const handleClearAll = useCallback(() => {
    Alert.alert(
      "Clear herbier?",
      "All saved species will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clear },
      ],
    );
  }, [clear]);

  const handleGoDiscover = useCallback(() => {
    router.replace("/");
  }, [router]);

  const renderItem = useCallback<ListRenderItem<FavoriteEntry>>(
    ({ item }) => (
      <Animated.View
        entering={FadeInDown.duration(360).springify().damping(18)}
        exiting={FadeOutLeft.duration(280)}
        layout={LinearTransition.duration(300)}
      >
        <SwipeToDeleteRow id={item.id} onDelete={handleRemove}>
          <SpeciesRow item={item} onPressItem={handlePressItem} />
        </SwipeToDeleteRow>
      </Animated.View>
    ),
    [handleRemove, handlePressItem],
  );

  const keyExtractor = useCallback(
    (item: FavoriteEntry) => String(item.id),
    [],
  );

  const ListHeader = useCallback(
    () => (
      <View className="px-5 pt-6 pb-4">
        <View className="h-px w-10 bg-white/30" />
        <Text
          className="mt-3 text-[10px] uppercase text-white/55"
          style={{ fontFamily: "Helvetica Neue", letterSpacing: 3 }}
        >
          Sylva — Your herbier
        </Text>

        <View className="mt-4">
          <HeadlineStack
            line1="Your herbier."
            line2="Where wonder is kept."
          />
        </View>

        <View className="mt-6 h-44 overflow-hidden rounded-card relative">
          <CardVideo source={Videos[VideoKey.Wildflowers]} tint={0.4} />
          <View className="flex-1 p-6 z-10 justify-end">
            <SectionLabel>Kept species</SectionLabel>
            <Text
              className="mt-1 text-bone text-5xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              {count}
            </Text>
            <Text
              className="text-white/55 text-sm mt-1"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Tap to revisit · slide to remove
            </Text>
          </View>
        </View>

        <View className="mt-10 flex-row items-end justify-between">
          <View className="flex-1">
            <Text
              className="text-bone text-3xl font-normal tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Recent additions
            </Text>
            <Text
              className="text-white/45 text-3xl font-normal tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Most recent first.
            </Text>
          </View>
          {count > 0 ? (
            <Pressable
              onPress={handleClearAll}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Clear all favorites"
            >
              <Text
                className="text-white/55 text-xs uppercase tracking-[0.18em]"
                style={{ fontFamily: "Helvetica Neue" }}
              >
                Clear all
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="mb-4" />
      </View>
    ),
    [count, handleClearAll],
  );

  const ListEmpty = useCallback(
    () => (
      <Animated.View
        entering={FadeIn.duration(400)}
        className="px-5 pt-4"
      >
        <GlassCard rounded="card">
          <View className="p-7 items-start gap-4">
            <Ionicons
              name="leaf-outline"
              size={36}
              color={Colors.moss300}
            />
            <Text
              className="text-bone text-xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Your herbier is empty
            </Text>
            <Text
              className="text-white/60 text-sm"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
            >
              Open Discover, double-tap any species photo to add it here.
            </Text>
            <LiquidGlassButton size="sm" onPress={handleGoDiscover}>
              Go discover
            </LiquidGlassButton>
          </View>
        </GlassCard>
      </Animated.View>
    ),
    [handleGoDiscover],
  );

  if (!state.hydrated) {
    return (
      <SafeAreaView className="flex-1 bg-ink-deep" edges={["top"]}>
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(220)}
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={Colors.moss300} />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-ink-deep" edges={["top"]}>
      <Animated.FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
        removeClippedSubviews={false}
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10}
      />
    </SafeAreaView>
  );
};

export default HerbierScreen;
