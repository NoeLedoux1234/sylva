import { Ionicons } from "@expo/vector-icons";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pressable, TextInput, View } from "react-native";

import { GlassCard } from "@/components/primitives/GlassCard";
import { Colors } from "@/constants/theme";
import { useDebounce } from "@/hooks/useDebounce";

type DiscoverSearchBarProps = {
  onDebouncedChange: (value: string) => void;
  debounceMs?: number;
};

export type DiscoverSearchBarHandle = {
  focus: () => void;
  reset: () => void;
};

const DEFAULT_DEBOUNCE_MS = 320;
const PLACEHOLDER_COLOR = "rgba(242,239,231,0.4)";

export const DiscoverSearchBar = forwardRef<
  DiscoverSearchBarHandle,
  DiscoverSearchBarProps
>(({ onDebouncedChange, debounceMs = DEFAULT_DEBOUNCE_MS }, ref) => {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState<string>("");
  const debounced = useDebounce(query, debounceMs);

  useEffect(() => {
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      reset: () => {
        setQuery("");
      },
    }),
    [],
  );

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <View className="px-5 mt-6 mb-4">
      <GlassCard rounded="field">
        <View className="flex-row items-center px-4 py-3 gap-3">
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.bone}
            style={{ opacity: 0.6 }}
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search a species, a family, a name…"
            placeholderTextColor={PLACEHOLDER_COLOR}
            className="flex-1 text-bone text-base"
            style={{ fontFamily: "Helvetica Neue" }}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={handleClear}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.boneDim}
              />
            </Pressable>
          ) : null}
        </View>
      </GlassCard>
    </View>
  );
});

DiscoverSearchBar.displayName = "DiscoverSearchBar";
