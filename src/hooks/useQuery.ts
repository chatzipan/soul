import { useMemo } from "react";

import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useQueryWrapper<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TData, TQueryKey>) {
  const useQueryResult = useQuery<TQueryFnData, TData, TQueryKey>(options);

  const errorCode = useMemo(() => {
    // If queryFn throws an error of type MyError, you will be able to access the code property
    if (useQueryResult.error !== null) {
      return useQueryResult.error?.code;
    }

    return undefined;
  }, [useQueryResult.error]);

  if (useQueryResult?.data?.code?.startsWith("auth/")) {
    return undefined;
  }

  return {
    ...useQueryResult,
    errorCode,
  };
}
