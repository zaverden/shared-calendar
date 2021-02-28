import {
  joinEvent,
  JoinEventParams,
} from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";
import { useInvalidateEvent } from "./useEvent";

export function useJoinEvent(): UseMutationResult<
  void,
  Error,
  JoinEventParams
> {
  const invalidateEvent = useInvalidateEvent();
  const m = useMutation<void, Error, JoinEventParams>(joinEvent, {
    onSuccess(_, { publicId }) {
      invalidateEvent(publicId);
    },
  });
  return m;
}
