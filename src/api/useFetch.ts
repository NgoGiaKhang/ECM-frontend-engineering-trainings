import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiErrorResponse } from "./types";
import { REQUEST_CANCELED_CODE } from "./api";

type UseFetchState<T> = {
  data: T | null;

  loading: boolean;

  error: ApiErrorResponse | null;
};

type QueryKey = readonly unknown[];

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

type UseFetchOptions<T> = {
  onError?: (error: ApiErrorResponse) => void;
  onSuccess?: (data: T) => void;
};

export function useFetch<T>(queryKey: QueryKey, fetcher: Fetcher<T>, options?: UseFetchOptions<T>) {
  const abortRef = useRef<AbortController | null>(null);
  const key = JSON.stringify(queryKey);
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,

    loading: true,

    error: null,
  });

  const execute = useCallback(async () => {
    // abort previous request
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const data = await fetcher(controller.signal);

      // component unmounted
      // request aborted
      if (controller.signal.aborted) {
        return;
      }

      setState({
        data,

        loading: false,

        error: null,
      });

      options?.onSuccess?.(data);
      return data;
    } catch (e: unknown) {
      const error = e as ApiErrorResponse;
      // 1. Check if the error was formatted as a cancellation by your Axios interceptor
      const isCanceledByInterceptor = error?.code === REQUEST_CANCELED_CODE;

      // 2. Check the AbortController signal directly, in case the cancellation happened locally
      const isCanceledBySignal = controller.signal.aborted;

      if (isCanceledByInterceptor || isCanceledBySignal) {
        console.log(
          "Request safely canceled. Dropping error execution stream.",
        );
        return; // Exit the function silently without triggering UI error states/toasts
      }

      setState({
        data: null,
        loading: false,
        error: error as ApiErrorResponse,
      });
      options?.onError?.(error as ApiErrorResponse);  
    }
  }, [fetcher]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void execute();

    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    ...state,
    refetch: execute,
    abort,
  };
}
