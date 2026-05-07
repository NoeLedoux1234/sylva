import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LiquidGlassButton } from "@/components/primitives/LiquidGlassButton";
import { SectionLabel } from "@/components/primitives/SectionLabel";
import { Colors } from "@/constants/theme";

const SearchPlaceholder = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }, [router]);

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
      <View className="flex-1 items-center justify-center px-8">
        <SectionLabel>Bientôt</SectionLabel>
        <Text
          className="mt-4 text-bone text-3xl font-medium tracking-tight text-center"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 36 }}
        >
          Chercher{"\n"}dans l&apos;encyclopédie.
        </Text>
        <Text
          className="mt-4 text-white/55 text-sm text-center"
          style={{ fontFamily: "Helvetica Neue", lineHeight: 20 }}
        >
          Le moteur de recherche reviendra dans la prochaine version.
        </Text>
      </View>
    </View>
  );
};

export default SearchPlaceholder;
