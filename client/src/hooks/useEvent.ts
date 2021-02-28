import { loadEvent, ShacalEvent } from "@shacal/ui/data-access";
import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";

const SHACAL_KEY = "EVENT";

export function useEvent(publicId: string): UseQueryResult<ShacalEvent, Error> {
  return useQuery([SHACAL_KEY, publicId], () => loadEvent(publicId), {
    retry(failureCount: number, error: Error) {
      return (
        error.message !== "401" && error.message !== "404" && failureCount < 3
      );
    },
  });
}

export function useInvalidateEvent(): (publicId: string) => void {
  const queryClient = useQueryClient();
  return useCallback(
    (publicId) => {
      queryClient.invalidateQueries([SHACAL_KEY, publicId]);
    },
    [queryClient]
  );
}

export function useSetEvent(): (event: ShacalEvent) => void {
  const queryClient = useQueryClient();
  return useCallback(
    (event) => {
      queryClient.setQueryData([SHACAL_KEY, event.publicId], event);
    },
    [queryClient]
  );
}
