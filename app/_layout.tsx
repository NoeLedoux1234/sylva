import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SylvaSplash } from "@/components/feature/SylvaSplash";
import { FavoritesProvider } from "@/store/favorites-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const RootLayout = () => {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <StatusBar style="light" backgroundColor="#050706" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#050706" },
              animation: "fade",
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="collections/[slug]" />
            <Stack.Screen name="search" />
            <Stack.Screen name="species/[id]" />
          </Stack>
          {!splashDone ? <SylvaSplash onFinish={handleSplashFinish} /> : null}
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
