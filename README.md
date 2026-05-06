# Sylva

A nature-immersive React Native app to explore the wild flora and fauna of the world. Browse species, search through the iNaturalist taxonomy, dive into rich detail sheets, and curate your personal **Herbier** of favorites — all wrapped in looping nature footage and glass-morphism surfaces.

> Functional minimalism, sensorial maximalism.

## Stack

- Expo SDK 54 · expo-router v6 · TypeScript strict
- NativeWind v4 · Tailwind v3
- react-native-reanimated v4 · react-native-gesture-handler v2
- expo-video · expo-blur · expo-image
- AsyncStorage · iNaturalist API

## Getting started

```bash
npm install
npx expo start
```

Open in iOS Simulator (`i`), Android Emulator (`a`) or scan the QR code with **Expo Go**.

## Scripts

| script | purpose |
| --- | --- |
| `npm start` | start expo dev server |
| `npm run ios` / `npm run android` | open in a simulator |
| `npm run lint` | run expo-lint |
| `npm run typecheck` | strict tsc no-emit |
| `npm run release` | bump version + tag (run from `main`) |

## Conventions

Code style, folder structure, design tokens and the agent workflow are documented in [`CLAUDE.md`](./CLAUDE.md).

## Architecture (TL;DR)

- `app/` — expo-router file-based screens
- `components/primitives/` — atomic UI (LiquidGlassButton, GlassCard…)
- `components/feature/` — composed feature blocks (FeatureCard, HeroGrid…)
- `components/species/` — species-specific blocks
- `hooks/` — `useTaxa`, `useTaxon`, `useFavorites`, `useDebounce`
- `store/` — `FavoritesProvider` (useReducer + Context + AsyncStorage)
- `lib/api.ts` — iNaturalist fetch helpers

## Git

- Default branch: `develop`
- Feature branches: `feat/<scope>` → PR → `develop`
- Final release: `develop` → `main` → `npm run release`
- Conventional commits enforced (commitlint + husky)
