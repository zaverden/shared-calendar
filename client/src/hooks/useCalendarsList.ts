import { Calendar, loadCalendarsList } from "@shacal/ui/data-access";
import { useCallback } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";

const CALENDAR_LIST_KEY = "CALENDAR_LIST";

export function useCalendarsList(): UseQueryResult<Calendar[], Error> {
  return useQuery(CALENDAR_LIST_KEY, loadCalendarsList, {
    retry(failureCount: number, error: Error) {
      return error.message !== "401" && failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateCalendarsList(): () => void {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries(CALENDAR_LIST_KEY);
  }, [queryClient]);
}
