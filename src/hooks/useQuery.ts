import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useQueryWrapper<
  TQueryFnData = unknown,
  TError extends { code?: string } = { code?: string },
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const useQueryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>(
    options,
  );

  const errorCode = useMemo(() => {
    if (useQueryResult.error && "code" in useQueryResult.error) {
      return (useQueryResult.error as { code?: string }).code;
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
    return undefined;
  }

  return {
    ...useQueryResult,
    errorCode,
  };
}
