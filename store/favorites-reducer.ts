import {
  FavoritesActionType,
  type FavoritesAction,
  type FavoriteEntry,
  type FavoritesState,
} from "@/store/favorites-types";

export const initialFavoritesState: FavoritesState = {
  entries: [],
  hydrated: false,
};

export const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  switch (action.type) {
    case FavoritesActionType.Hydrate: {
      return { entries: action.payload, hydrated: true };
    }
    case FavoritesActionType.Add: {
      const { taxon, addedAt } = action.payload;
      const filtered = state.entries.filter((entry) => entry.id !== taxon.id);
      const next: FavoriteEntry = { ...taxon, addedAt };
      return { ...state, entries: [next, ...filtered] };
    }
    case FavoritesActionType.Remove: {
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.payload),
      };
    }
    case FavoritesActionType.Clear: {
      return { ...state, entries: [] };
    }
    default: {
      return state;
    }
  }
};
