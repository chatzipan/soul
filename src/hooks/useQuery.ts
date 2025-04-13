import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

interface ApiError {
  response?: {
    status: number;
    data?: {
      code?: string;
      message?: string;
    };
  };
}

type ExtendedUseQueryResult<TData, TError> = UseQueryResult<TData, TError> & {
  errorCode: string | undefined;
  errorMessage: string | undefined;
};

export function useQueryWrapper<
  TQueryFnData = unknown,
  TError extends ApiError = ApiError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): ExtendedUseQueryResult<TData, TError> {
  const useQueryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>(
    options,
  );

  const errorCode = useMemo(() => {
    if (useQueryResult.error?.response?.data?.code) {
      return useQueryResult.error.response.data.code;
    }
    if (useQueryResult.error?.response?.status) {
      return `http_${useQueryResult.error.response.status}`;
    }
    return undefined;
  }, [useQueryResult.error]);

  const errorMessage = useMemo(() => {
    if (useQueryResult.error?.response?.data?.message) {
      return useQueryResult.error.response.data.message;
    }
    if (useQueryResult.error?.response?.data) {
      return useQueryResult.error.response.data as string;
    }
    return undefined;
  }, [useQueryResult.error]);

  if (
    useQueryResult.data &&
    typeof useQueryResult.data === "object" &&
    "code" in useQueryResult.data &&
    typeof (useQueryResult.data as { code?: string }).code === "string" &&
    (useQueryResult.data as { code: string }).code.startsWith("auth/")
  ) {
    return {
      ...useQueryResult,
      data: undefined as unknown as TData,
      error: null,
      isError: false,
      isLoading: false,
      isPending: false,
      isFetching: false,
      isSuccess: false,
      isInitialLoading: false,
      isLoadingError: false,
      isRefetching: false,
      isRefetchError: false,
      errorCode: undefined,
      errorMessage: undefined,
    } as unknown as ExtendedUseQueryResult<TData, TError>;
  }

  return {
    ...useQueryResult,
    errorCode,
    errorMessage,
  };
}
