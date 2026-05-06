import { Text, View } from "react-native";

type HeadlineStackProps = {
  line1: string;
  line2: string;
};

export const HeadlineStack = ({ line1, line2 }: HeadlineStackProps) => (
  <View>
    <Text
      className="text-bone text-3xl md:text-4xl font-normal tracking-tight"
      style={{ fontFamily: "Helvetica Neue", lineHeight: 38 }}
    >
      {line1}
    </Text>
    <Text
      className="text-white/45 text-3xl md:text-4xl font-normal tracking-tight mt-2"
      style={{ fontFamily: "Helvetica Neue", lineHeight: 38 }}
    >
      {line2}
    </Text>
  </View>
);
