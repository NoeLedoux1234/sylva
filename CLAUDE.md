# Sylva — project conventions

## Concept

Sylva is a nature-immersive React Native app to explore the wild flora and fauna of the world. The user can browse species, search through the iNaturalist taxonomy, open a detailed sheet for any species, and curate a personal "Herbier" (collection) of favorites. The product is intentionally decorative: every screen is composed around looping nature footage and glass-morphism surfaces. Functional minimalism, sensorial maximalism.

## Stack

- **Expo SDK 54** with **expo-router** v6 (file-based navigation)
- **TypeScript** strict
- **NativeWind v4** + **Tailwind v3** (className-based styling)
- **react-native-reanimated** v4 + **react-native-worklets** (animations)
- **react-native-gesture-handler** v2 (gestures)
- **expo-video** (looping background videos)
- **expo-blur** (liquid glass surfaces)
- **expo-image** (cached, fast images)
- **@react-native-async-storage/async-storage** (favorites persistence — bonus dep)
- **iNaturalist API** (`https://api.inaturalist.org/v1`) — public, no auth

## Architecture

```
sylva/
├── app/                          # expo-router file-based routing
│   ├── _layout.tsx               # root layout (providers, fonts, status bar)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # custom translucent tab bar
│   │   ├── index.tsx             # Discover (hero grid + FlatList + search)
│   │   └── herbier.tsx           # Favorites collection
│   └── species/
│       └── [id].tsx              # dynamic species detail
├── components/
│   ├── primitives/               # atomic ui (LiquidGlassButton, GlassCard, …)
│   ├── feature/                  # composed feature blocks (FeatureCard, HeroGrid, …)
│   └── species/                  # species-specific blocks (SpeciesRow, SpeciesHero, …)
├── constants/
│   ├── theme.ts                  # design tokens (colors, type, motion)
│   └── videos.ts                 # cdn video URLs + cards mapping
├── hooks/
│   ├── useTaxa.ts                # paginated search hook (iNaturalist)
│   ├── useTaxon.ts               # single species detail
│   ├── useFavorites.ts           # consume favorites context
│   └── useDebounce.ts            # debounce values (search input)
├── store/
│   ├── favorites-context.tsx     # useReducer + Context provider (bonus)
│   └── favorites-types.ts
├── lib/
│   └── api.ts                    # iNaturalist fetch helpers
├── types/
│   └── taxon.ts                  # Taxon, TaxonSummary, ConservationStatus, …
├── global.css                    # tailwind directives
└── tailwind.config.js
```

## Conventions

- **TypeScript strict.** No `any`, no non-null assertions (`!`), no inline type assertions.
- **`type` over `interface`** for data shapes. Reserve `interface` for class contracts.
- **`enum`** for fixed-string unions (e.g. `enum Rank { Species = "species", Genus = "genus" }`).
- **Property names in english.** No french abbreviations.
- **Zero comments** in code unless documenting a non-obvious invariant. Self-explanatory naming only.
- **No `console.log`** in shipped code.
- **Functional components** with arrow-function declarations exported as named exports.
- **Memoization is the default** in lists: `React.memo` on row components, `useCallback` for event handlers passed down, `useMemo` for derived data.
- **Hooks live in `hooks/`** — never inline a fetch in a component.

### Styling

- **NativeWind classes** for layout, color, typography. Inline `style={{ … }}` only when an animated style is required (Reanimated `useAnimatedStyle`).
- **Design tokens** live in `tailwind.config.js` and `constants/theme.ts`. Never hard-code a hex value in a component.
- **Spacing via `gap`**, not margin, when inside flex/grid containers.

### Animations

- **Reanimated worklets** for gesture-driven animation. UI thread only.
- Use **`useSharedValue` + `useAnimatedStyle`** for continuous values (scroll position, gesture translation).
- Use **`Layout` animations** (`entering`, `exiting`, `layout` props) on FlatList items.
- Never animate a parent that re-renders frequently — animate the leaf component.

### State

- **One `FavoritesProvider`** at the root, backed by `useReducer` + `AsyncStorage` (bonus).
- A custom hook **`useFavorites()`** is the only consumer. The raw context is never imported elsewhere.
- The reducer is pure; persistence happens in a dedicated effect.

## Git workflow

- Default branch on GitHub: `develop`.
- All work happens in **feature branches** named `feat/<scope>` (e.g. `feat/design-system`, `feat/discover-screen`).
- Each feature branch is opened as a **PR into `develop`** with a clean commit history (squash if many WIP commits).
- Conventional commits enforced by **commitlint + husky**.
- Final release: `develop` → `main` PR, then `npm run release` from `main` and `git push --follow-tags`.

### Commit format

```
<type>(<scope>): <subject>
```

Scopes used in this project: `design-system`, `state`, `api`, `nav`, `discover`, `species`, `herbier`, `anim`, `gestures`, `polish`, `deps`, `tooling`.

## Agent dispatch

- Each feature branch is implemented by **frontend-engineer** (most cases) or **backend-engineer** (api/data layer).
- Every feature branch ends with: **test-runner** (typecheck + expo build) → **feature-dev:code-reviewer** → **git-ops** (commit + push + PR).
- No agent ever bypasses this flow.

## Evaluation checklist (cahier des charges)

- [x] Multi-screen with **expo-router**: layouts, Link/router, dynamic `[id]` page
- [x] **TypeScript** strict
- [x] **TextInput** + **FlatList** with infinite scroll
- [x] Custom hooks for API
- [x] **useCallback** + memoization
- [x] **react-native-reanimated**: SharedValue, worklet, Layout animation, performant
- [x] Global state: **`useReducer` inside Context Provider** (bonus +2)
- [x] **react-native-gesture-handler** (bonus +2)
- [x] **AsyncStorage** as a dependency not seen in course (bonus +2)
