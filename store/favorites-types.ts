import type { TaxonSummary } from "@/types/taxon";

export type FavoriteEntry = TaxonSummary & {
  addedAt: number;
};

export enum FavoritesActionType {
  Hydrate = "favorites/hydrate",
  Add = "favorites/add",
  Remove = "favorites/remove",
  Clear = "favorites/clear",
}

export type FavoritesAddPayload = {
  taxon: TaxonSummary;
  addedAt: number;
};

export type FavoritesAction =
  | { type: FavoritesActionType.Hydrate; payload: FavoriteEntry[] }
  | { type: FavoritesActionType.Add; payload: FavoritesAddPayload }
  | { type: FavoritesActionType.Remove; payload: number }
  | { type: FavoritesActionType.Clear };

export type FavoritesState = {
  entries: FavoriteEntry[];
  hydrated: boolean;
};

export const narrowFavoriteEntries = (raw: unknown): FavoriteEntry[] => {
  if (!Array.isArray(raw)) return [];
  const result: FavoriteEntry[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    if (
      typeof record.id !== "number" ||
      typeof record.addedAt !== "number" ||
      typeof record.name !== "string"
    ) continue;
    result.push(item as FavoriteEntry);
  }
  return result;
};
