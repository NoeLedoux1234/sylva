import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";

import { SylvaTabBar } from "@/components/feature/SylvaTabBar";

const renderTabBar = (props: BottomTabBarProps) => <SylvaTabBar {...props} />;

const TabsLayout = () => {
  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#050706" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="herbier" options={{ title: "Herbier" }} />
    </Tabs>
  );
};

export default TabsLayout;
