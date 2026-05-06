import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { extractErrorMessage, fetchTaxon, isAbortError } from "@/lib/api";
import type { Taxon } from "@/types/taxon";

export type UseTaxonReturn = {
  taxon: Taxon | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export const useTaxon = (id: number | undefined): UseTaxonReturn => {
  const [taxon, setTaxon] = useState<Taxon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<number>(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (id === undefined) {
      setTaxon(null);
      setLoading(false);
      setError(null);
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    fetchTaxon(id, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setTaxon(result);
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
  }, [id, refreshToken]);

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  return useMemo(
    () => ({
      taxon,
      loading,
      error,
      refresh,
    }),
    [taxon, loading, error, refresh],
  );
};
