import { loadShacal, Shacal } from "@shacal/ui/data-access";
import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";

const SHACAL_KEY = "CALENDAR";

export function useShacal(publicId: string): UseQueryResult<Shacal, Error> {
  return useQuery([SHACAL_KEY, publicId], () => loadShacal(publicId), {
    retry(failureCount: number, error: Error) {
      return (
        error.message !== "401" && error.message !== "404" && failureCount < 3
      );
    },
  });
}

export function useInvalidateShacal(): (publicId: string) => void {
  const queryClient = useQueryClient();
  return useCallback(
    (publicId: string) => {
      queryClient.invalidateQueries([SHACAL_KEY, publicId]);
    },
    [queryClient]
  );
}
