import { memo, useCallback } from "react";
import {
  Dimensions,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { CollectionPage } from "@/components/feature/CollectionPage";
import type { Collection } from "@/constants/collections";

const SCREEN_WIDTH = Dimensions.get("window").width;

type CollectionPagerProps = {
  collections: readonly Collection[];
  activeIndex: number;
  focused: boolean;
  onActiveChange: (index: number) => void;
  onPressEnter: (slug: string) => void;
};

type LayoutDescriptor = {
  length: number;
  offset: number;
  index: number;
};

type IndicatorsProps = {
  total: number;
  activeIndex: number;
};

const IndicatorsComponent = ({ total, activeIndex }: IndicatorsProps) => {
  const dots: number[] = [];
  for (let index = 0; index < total; index += 1) {
    dots.push(index);
  }
  return (
    <View
      pointerEvents="none"
      className="absolute left-0 right-0 items-center"
      style={{ bottom: 128 }}
    >
      <View className="flex-row items-center gap-2">
        {dots.map((index) => {
          const isActive = index === activeIndex;
          return (
            <Animated.View
              key={index}
              layout={LinearTransition.duration(220)}
              className={
                isActive
                  ? "w-4 h-1.5 rounded-full bg-bone"
                  : "w-1.5 h-1.5 rounded-full bg-white/30"
              }
            />
          );
        })}
      </View>
    </View>
  );
};

const Indicators = memo(IndicatorsComponent);

const getItemLayout = (
  _data: ArrayLike<Collection> | null | undefined,
  index: number,
): LayoutDescriptor => ({
  length: SCREEN_WIDTH,
  offset: SCREEN_WIDTH * index,
  index,
});

const keyExtractor = (item: Collection): string => item.slug;

const CollectionPagerComponent = ({
  collections,
  activeIndex,
  focused,
  onActiveChange,
  onPressEnter,
}: CollectionPagerProps) => {
  const renderItem = useCallback<ListRenderItem<Collection>>(
    ({ item, index }) => (
      <CollectionPage
        collection={item}
        isActive={focused && index === activeIndex}
        onPressEnter={onPressEnter}
      />
    ),
    [activeIndex, focused, onPressEnter],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / SCREEN_WIDTH);
      if (nextIndex !== activeIndex) {
        onActiveChange(nextIndex);
      }
    },
    [activeIndex, onActiveChange],
  );

  return (
    <View className="flex-1 bg-ink-deep">
      <Animated.FlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        initialNumToRender={1}
        windowSize={3}
        maxToRenderPerBatch={1}
        removeClippedSubviews
      />
      <Indicators total={collections.length} activeIndex={activeIndex} />
    </View>
  );
};

export const CollectionPager = memo(CollectionPagerComponent);
