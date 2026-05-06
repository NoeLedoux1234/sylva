import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { extractErrorMessage, fetchTaxa, isAbortError } from "@/lib/api";
import type { TaxonSummary } from "@/types/taxon";

type UseTaxaState = {
  results: TaxonSummary[];
  page: number;
  totalResults: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
};

export type UseTaxaReturn = Omit<UseTaxaState, "page"> & {
  loadMore: () => void;
  refresh: () => void;
};

const INITIAL_STATE: UseTaxaState = {
  results: [],
  page: 1,
  totalResults: 0,
  loading: false,
  refreshing: false,
  error: null,
  hasMore: false,
};

export const useTaxa = (query: string): UseTaxaReturn => {
  const [state, setState] = useState<UseTaxaState>(INITIAL_STATE);
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((prev) => ({
      ...prev,
      results: [],
      page: 1,
      loading: true,
      refreshing: false,
      error: null,
      hasMore: false,
      totalResults: 0,
    }));

    fetchTaxa({ query, page: 1, signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          results: res.results,
          page: 1,
          loading: false,
          refreshing: false,
          totalResults: res.totalResults,
          hasMore: res.results.length < res.totalResults,
          error: null,
        }));
      })
      .catch((err: unknown) => {
        if (isAbortError(err) || controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          refreshing: false,
          error: extractErrorMessage(err),
        }));
      });

    return () => {
      controller.abort();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [query, refreshToken]);

  const loadMore = useCallback(() => {
    if (state.loading || state.refreshing || !state.hasMore) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const nextPage = state.page + 1;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchTaxa({ query, page: nextPage, signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        setState((prev) => {
          const merged = [...prev.results, ...res.results];
          return {
            ...prev,
            results: merged,
            page: nextPage,
            loading: false,
            totalResults: res.totalResults,
            hasMore: merged.length < res.totalResults,
            error: null,
          };
        });
      })
      .catch((err: unknown) => {
        if (isAbortError(err) || controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          hasMore: false,
          error: extractErrorMessage(err),
        }));
      });
  }, [query, state.page, state.loading, state.refreshing, state.hasMore]);

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true, error: null }));
    setRefreshToken((token) => token + 1);
  }, []);

  return useMemo(
    () => ({
      results: state.results,
      totalResults: state.totalResults,
      loading: state.loading,
      refreshing: state.refreshing,
      error: state.error,
      hasMore: state.hasMore,
      loadMore,
      refresh,
    }),
    [state, loadMore, refresh],
  );
};
