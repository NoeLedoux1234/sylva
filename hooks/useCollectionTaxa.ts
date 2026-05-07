import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { extractErrorMessage, fetchTaxon, isAbortError } from "@/lib/api";
import type { Taxon } from "@/types/taxon";

export type UseCollectionTaxaReturn = {
  taxa: Taxon[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

type SettledTaxon =
  | { status: "fulfilled"; value: Taxon }
  | { status: "rejected"; reason: unknown };

export const useCollectionTaxa = (
  taxonIds: readonly number[],
): UseCollectionTaxaReturn => {
  const [taxa, setTaxa] = useState<Taxon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (taxonIds.length === 0) {
      setTaxa([]);
      setLoading(false);
      setError(null);
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    const fetches = taxonIds.map((id) => fetchTaxon(id, controller.signal));

    Promise.allSettled(fetches)
      .then((results) => {
        if (controller.signal.aborted) return;
        const settled = results as SettledTaxon[];
        const fulfilled: Taxon[] = [];
        let lastRejection: unknown = null;
        for (const result of settled) {
          if (result.status === "fulfilled") {
            fulfilled.push(result.value);
          } else {
            lastRejection = result.reason;
          }
        }
        setTaxa(fulfilled);
        if (fulfilled.length === 0 && taxonIds.length > 0) {
          setError(extractErrorMessage(lastRejection));
        } else {
          setError(null);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (isAbortError(err) || controller.signal.aborted) return;
        setError(extractErrorMessage(err));
        setLoading(false);
      });

    return () => {
      controller.abort();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [taxonIds, refreshToken]);

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  return useMemo(
    () => ({
      taxa,
      loading,
      error,
      refresh,
    }),
    [taxa, loading, error, refresh],
  );
};
