import {
  createEvent,
  CreateEventParams,
  ShacalEvent,
} from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";
import { useSetEvent } from "./useEvent";

export function useCreateEvent(): UseMutationResult<
  ShacalEvent,
  Error,
  CreateEventParams
> {
  const setEvent = useSetEvent();
  const m = useMutation<ShacalEvent, Error, CreateEventParams>(createEvent, {
    onSuccess(event) {
      setEvent(event);
    },
  });
  return m;
}
