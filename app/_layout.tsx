import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FavoritesProvider } from "@/store/favorites-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#050706" },
              animation: "fade",
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="species/[id]" />
          </Stack>
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
