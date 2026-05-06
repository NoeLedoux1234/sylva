import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DiscoverSearchBar,
  type DiscoverSearchBarHandle,
} from "@/components/feature/DiscoverSearchBar";
import { DiscoverStatusRow } from "@/components/feature/DiscoverStatusRow";
import { HeroGrid } from "@/components/feature/HeroGrid";
import { GlassCard } from "@/components/primitives/GlassCard";
import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SpeciesRow } from "@/components/species/SpeciesRow";
import { SpeciesRowSkeleton } from "@/components/species/SpeciesRowSkeleton";
import { Colors } from "@/constants/theme";
import { useTaxa } from "@/hooks/useTaxa";
import type { TaxonSummary } from "@/types/taxon";

const SKELETON_KEYS: number[] = [0, 1, 2, 3, 4, 5];

const DiscoverScreen = () => {
  const router = useRouter();
  const inputRef = useRef<DiscoverSearchBarHandle>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const taxa = useTaxa(debouncedQuery);

  const handleFocusSearch = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleDebouncedChange = useCallback((value: string) => {
    setDebouncedQuery(value);
  }, []);

  const handlePressItem = useCallback(
    (id: number) => {
      router.push(`/species/${id}`);
    },
    [router],
  );

  const handleClearSearch = useCallback(() => {
    inputRef.current?.reset();
    inputRef.current?.focus();
  }, []);

  const renderItem = useCallback<ListRenderItem<TaxonSummary>>(
    ({ item }) => <SpeciesRow item={item} onPressItem={handlePressItem} />,
    [handlePressItem],
  );

  const keyExtractor = useCallback(
    (item: TaxonSummary) => String(item.id),
    [],
  );

  const hasQuery = debouncedQuery.trim().length > 0;
  const showInitialSkeletons =
    taxa.loading && taxa.results.length === 0 && !taxa.refreshing;

  const ListHeader = useCallback(
    () => (
      <View>
        <HeroGrid onFocusSearchPress={handleFocusSearch} />
        <DiscoverSearchBar
          ref={inputRef}
          onDebouncedChange={handleDebouncedChange}
        />
        <DiscoverStatusRow
          loading={taxa.loading}
          error={taxa.error}
          totalResults={taxa.totalResults}
          hasQuery={hasQuery}
        />
      </View>
    ),
    [
      handleFocusSearch,
      handleDebouncedChange,
      taxa.loading,
      taxa.error,
      taxa.totalResults,
      hasQuery,
    ],
  );

  const ListFooter = useMemo(() => {
    if (showInitialSkeletons) return null;
    if (taxa.loading && taxa.results.length > 0) {
      return (
        <View className="py-6 items-center">
          <ActivityIndicator color={Colors.moss300} />
        </View>
      );
    }
    return <View className="h-24" />;
  }, [showInitialSkeletons, taxa.loading, taxa.results.length]);

  const ListEmpty = useMemo(() => {
    if (showInitialSkeletons) {
      return (
        <View>
          {SKELETON_KEYS.map((key) => (
            <SpeciesRowSkeleton
              key={key}
              primaryWidth={140 + (key % 3) * 30}
              secondaryWidth={90 + (key % 4) * 20}
            />
          ))}
        </View>
      );
    }
    if (taxa.loading) return null;
    if (!hasQuery) return null;
    return (
      <View className="px-5 py-8">
        <GlassCard rounded="card">
          <View className="p-7 items-start gap-4">
            <Text
              className="text-bone text-xl font-medium tracking-tight"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              No species found
            </Text>
            <Text
              className="text-white/60 text-sm"
              style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
            >
              Try a different name, family, or common term. The wild keeps
              countless secrets — keep searching.
            </Text>
            <LiquidGlassButton size="sm" onPress={handleClearSearch}>
              Clear search
            </LiquidGlassButton>
          </View>
        </GlassCard>
      </View>
    );
  }, [showInitialSkeletons, taxa.loading, hasQuery, handleClearSearch]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={taxa.refreshing}
        onRefresh={taxa.refresh}
        tintColor={Colors.moss300}
      />
    ),
    [taxa.refreshing, taxa.refresh],
  );

  return (
    <SafeAreaView className="flex-1 bg-ink-deep" edges={["top"]}>
      <FlatList
        data={taxa.results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={taxa.loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
};

export default DiscoverScreen;
