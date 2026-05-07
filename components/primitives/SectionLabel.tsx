import type { ReactNode } from "react";
import { Text } from "react-native";

type SectionLabelAlign = "left" | "right";

type SectionLabelProps = {
  children: ReactNode;
  align?: SectionLabelAlign;
};

const alignClass: Record<SectionLabelAlign, string> = {
  left: "text-left",
  right: "text-right",
};

export const SectionLabel = ({ children, align = "left" }: SectionLabelProps) => (
  <Text
    className={`text-xs uppercase text-white/55 ${alignClass[align]}`}
    style={{ fontFamily: "Helvetica Neue", letterSpacing: 2.16 }}
  >
    {children}
  </Text>
);
