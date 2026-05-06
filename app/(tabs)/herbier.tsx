import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HerbierScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-ink-deep">
      <View className="flex-1 items-center justify-center">
        <Text
          className="text-bone text-xl"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Herbier
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HerbierScreen;
