import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";

import { CollectionPager } from "@/components/feature/CollectionPager";
import { DiscoverTopBar } from "@/components/feature/DiscoverTopBar";
import { Collections } from "@/constants/collections";

const Discover = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [focused, setFocused] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, []),
  );

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePressEnter = useCallback(
    (slug: string) => {
      Haptics.selectionAsync();
      router.push({ pathname: "/collections/[slug]", params: { slug } });
    },
    [router],
  );

  const handlePressSearch = useCallback(() => {
    Haptics.selectionAsync();
    router.push("/search");
  }, [router]);

  return (
    <View className="flex-1 bg-ink-deep">
      <CollectionPager
        collections={Collections}
        activeIndex={activeIndex}
        focused={focused}
        onActiveChange={handleActiveChange}
        onPressEnter={handlePressEnter}
      />
      <DiscoverTopBar
        onPressSearch={handlePressSearch}
        current={activeIndex + 1}
        total={Collections.length}
      />
    </View>
  );
};

export default Discover;
