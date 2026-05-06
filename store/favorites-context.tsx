import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  favoritesReducer,
  initialFavoritesState,
} from "@/store/favorites-reducer";
import {
  FavoritesActionType,
  narrowFavoriteEntries,
  type FavoritesState,
} from "@/store/favorites-types";
import type { TaxonSummary } from "@/types/taxon";

const STORAGE_KEY = "sylva.favorites.v1";

type FavoritesContextValue = {
  state: FavoritesState;
  add: (taxon: TaxonSummary) => void;
  remove: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? narrowFavoriteEntries(JSON.parse(raw)) : [];
        if (!cancelled) {
          dispatch({ type: FavoritesActionType.Hydrate, payload: parsed });
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: FavoritesActionType.Hydrate, payload: [] });
        }
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries)).catch(
      () => {}
    );
  }, [state.entries, state.hydrated]);

  const add = useCallback((taxon: TaxonSummary) => {
    dispatch({
      type: FavoritesActionType.Add,
      payload: { taxon, addedAt: Date.now() },
    });
  }, []);

  const remove = useCallback((id: number) => {
    dispatch({ type: FavoritesActionType.Remove, payload: id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: FavoritesActionType.Clear });
  }, []);

  const isFavorite = useCallback(
    (id: number) => state.entries.some((entry) => entry.id === id),
    [state.entries]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ state, add, remove, clear, isFavorite }),
    [state, add, remove, clear, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (ctx === null) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
};
