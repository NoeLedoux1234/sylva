import {
  type Taxon,
  type TaxonPhoto,
  type TaxonSummary,
  TaxonRank,
} from "@/types/taxon";

export const INATURALIST_BASE = "https://api.inaturalist.org/v1";

const DEFAULT_PER_PAGE = 24;
const DEFAULT_PAGE = 1;

export type TaxaSearchParams = {
  query?: string;
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
};

export type TaxaSearchResult = {
  results: TaxonSummary[];
  totalResults: number;
  page: number;
  perPage: number;
};

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

export const isAbortError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) return false;
  const record = error as { name?: unknown };
  return record.name === "AbortError";
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Unknown error";
};

const toTaxonRank = (raw: unknown): TaxonRank => {
  if (typeof raw !== "string") return TaxonRank.Species;
  const known = Object.values(TaxonRank) as string[];
  if (known.includes(raw)) return raw as TaxonRank;
  return TaxonRank.Species;
};

const mapPhoto = (raw: unknown): TaxonPhoto | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const url = record.medium_url ?? record.url;
  if (typeof url !== "string") return null;
  const attribution = typeof record.attribution === "string" ? record.attribution : "";
  return { url, attribution };
};

const mapTaxonSummary = (raw: unknown): TaxonSummary | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.id !== "number" || typeof record.name !== "string") return null;
  return {
    id: record.id,
    name: record.name,
    preferredCommonName:
      typeof record.preferred_common_name === "string" ? record.preferred_common_name : null,
    rank: toTaxonRank(record.rank),
    photo: mapPhoto(record.default_photo),
    iconicTaxonName:
      typeof record.iconic_taxon_name === "string" ? record.iconic_taxon_name : null,
  };
};

const mapAncestors = (raw: unknown): TaxonSummary[] => {
  if (!Array.isArray(raw)) return [];
  const ancestors: TaxonSummary[] = [];
  for (const item of raw) {
    const summary = mapTaxonSummary(item);
    if (summary) ancestors.push(summary);
  }
  return ancestors;
};

const extractLargePhoto = (raw: unknown): string | null => {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const first = raw[0];
  if (typeof first !== "object" || first === null) return null;
  const record = first as Record<string, unknown>;
  const photo = record.photo;
  if (typeof photo !== "object" || photo === null) return null;
  const photoRecord = photo as Record<string, unknown>;
  if (typeof photoRecord.large_url === "string") return photoRecord.large_url;
  if (typeof photoRecord.medium_url === "string") return photoRecord.medium_url;
  return null;
};

const extractConservationStatus = (raw: unknown): string | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.status_name === "string") return record.status_name;
  return null;
};

const mapTaxon = (raw: unknown): Taxon | null => {
  const summary = mapTaxonSummary(raw);
  if (!summary) return null;
  const record = raw as Record<string, unknown>;
  return {
    ...summary,
    wikipediaUrl: typeof record.wikipedia_url === "string" ? record.wikipedia_url : null,
    observationsCount:
      typeof record.observations_count === "number" ? record.observations_count : 0,
    conservationStatus: extractConservationStatus(record.conservation_status),
    ancestors: mapAncestors(record.ancestors),
    defaultPhotoLarge: extractLargePhoto(record.taxon_photos),
  };
};

const requestJson = async (url: string, signal?: AbortSignal): Promise<unknown> => {
  const response = await fetch(url, {
    signal,
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new ApiError(response.status, url, `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchTaxa = async (params: TaxaSearchParams): Promise<TaxaSearchResult> => {
  const page = params.page ?? DEFAULT_PAGE;
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;
  const trimmedQuery = params.query?.trim() ?? "";
  const search = new URLSearchParams();
  search.set("rank", TaxonRank.Species);
  search.set("locale", "fr");
  search.set("page", String(page));
  search.set("per_page", String(perPage));
  if (trimmedQuery.length > 0) {
    search.set("q", trimmedQuery);
  } else {
    search.set("order_by", "observations_count");
    search.set("order", "desc");
  }
  const url = `${INATURALIST_BASE}/taxa?${search.toString()}`;
  const json = await requestJson(url, params.signal);
  if (typeof json !== "object" || json === null) {
    throw new ApiError(0, url, "Invalid response payload");
  }
  const payload = json as Record<string, unknown>;
  const rawResults = Array.isArray(payload.results) ? payload.results : [];
  const results: TaxonSummary[] = [];
  for (const item of rawResults) {
    const summary = mapTaxonSummary(item);
    if (summary) results.push(summary);
  }
  return {
    results,
    totalResults: typeof payload.total_results === "number" ? payload.total_results : results.length,
    page: typeof payload.page === "number" ? payload.page : page,
    perPage: typeof payload.per_page === "number" ? payload.per_page : perPage,
  };
};

export const fetchTaxon = async (id: number, signal?: AbortSignal): Promise<Taxon> => {
  const url = `${INATURALIST_BASE}/taxa/${id}`;
  const json = await requestJson(url, signal);
  if (typeof json !== "object" || json === null) {
    throw new ApiError(0, url, "Invalid response payload");
  }
  const payload = json as Record<string, unknown>;
  const rawResults = Array.isArray(payload.results) ? payload.results : [];
  const first = rawResults[0];
  const taxon = mapTaxon(first);
  if (!taxon) {
    throw new ApiError(404, url, `Taxon ${id} not found`);
  }
  return taxon;
};
