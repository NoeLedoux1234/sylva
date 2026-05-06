import type { BlurTint } from "expo-blur";
import { Platform } from "react-native";

const palette = {
  inkDeep: "#050706",
  ink: "#0A0E0B",
  inkSoft: "#11161A",
  cardBase: "#152019",
  moss50: "#EFF5EE",
  moss100: "#D6E4D2",
  moss200: "#A9C3A1",
  moss300: "#7CA371",
  moss400: "#598253",
  moss500: "#3F6638",
  moss600: "#2C4A26",
  moss700: "#1E331A",
  moss800: "#142010",
  moss900: "#0B1309",
  bark: "#3A2E22",
  barkLight: "#6B5840",
  bone: "#F2EFE7",
  boneDim: "#C5C2B7",
  glassTint: "rgba(255,255,255,0.04)",
  glassStroke: "rgba(255,255,255,0.18)",
  glassStrokeBright: "rgba(255,255,255,0.45)",
} as const;

const themeScheme = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: "#0A7EA4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0A7EA4",
  },
  dark: {
    text: palette.bone,
    background: palette.inkDeep,
    tint: palette.moss300,
    icon: palette.boneDim,
    tabIconDefault: palette.boneDim,
    tabIconSelected: palette.moss300,
  },
} as const;

export const Colors = {
  ...palette,
  ...themeScheme,
};

export const Fonts = Platform.select({
  ios: {
    sans: "Helvetica Neue",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Helvetica Neue, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, monospace",
  },
});

export const Type = {
  fontDisplay: "Helvetica Neue",
  fontBody: "Helvetica Neue",
  displayXL: { fontSize: 56, lineHeight: 58, letterSpacing: -1.2, fontWeight: "300" as const },
  displayLG: { fontSize: 40, lineHeight: 42, letterSpacing: -0.8, fontWeight: "400" as const },
  displayMD: { fontSize: 28, lineHeight: 32, letterSpacing: -0.4, fontWeight: "500" as const },
  bodyLG: { fontSize: 17, lineHeight: 24, letterSpacing: -0.1, fontWeight: "400" as const },
  bodyMD: { fontSize: 15, lineHeight: 22, letterSpacing: 0, fontWeight: "400" as const },
  bodySM: { fontSize: 13, lineHeight: 18, letterSpacing: 0, fontWeight: "400" as const },
  caption: { fontSize: 11, lineHeight: 14, letterSpacing: 1.8, fontWeight: "500" as const },
} as const;

export enum Motion {
  Soft = 220,
  Smooth = 320,
  Slow = 480,
}

type EasingPreset = {
  duration: number;
};

export const Easing: Record<"soft" | "smooth" | "slow", EasingPreset> = {
  soft: { duration: Motion.Soft },
  smooth: { duration: Motion.Smooth },
  slow: { duration: Motion.Slow },
};

export const Radius = {
  card: 24,
  pill: 999,
  field: 14,
  xs: 8,
} as const;

type GlassConfig = {
  tint: BlurTint;
  intensity: number;
  borderColor: string;
};

export const Glass: GlassConfig = {
  tint: "dark",
  intensity: 18,
  borderColor: Colors.glassStroke,
};
