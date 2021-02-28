import {
  updateEvent,
  UpdateEventParams,
  ShacalEvent,
} from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";
import { useSetEvent } from "./useEvent";

export function useUpdateEvent(): UseMutationResult<
  ShacalEvent,
  Error,
  UpdateEventParams
> {
  const setEvent = useSetEvent();
  const m = useMutation<ShacalEvent, Error, UpdateEventParams>(updateEvent, {
    onSuccess(event) {
      setEvent(event);
    },
  });
  return m;
}
