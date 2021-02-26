import { shareCalendar } from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";
import { useInvalidateCalendarsList } from "./useCalendarsList";

export function useShareCalendar(): UseMutationResult<
  string,
  Error,
  string,
  string
> {
  const invalidateCalendarsList = useInvalidateCalendarsList();
  const m = useMutation<string, Error, string, string>(shareCalendar, {
    onMutate(googleCalendarId: string) {
      return googleCalendarId;
    },
    onSuccess() {
      invalidateCalendarsList();
    },
  });
  return m;
}
