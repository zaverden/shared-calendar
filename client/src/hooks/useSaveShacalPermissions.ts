import {
  saveShacalPermissions,
  SaveShacalPermissionsParams,
} from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";
import { useInvalidateShacal } from "./useShacal";

export function useSaveShacalPermissions(): UseMutationResult<
  void,
  Error,
  SaveShacalPermissionsParams
> {
  const invalidateShacal = useInvalidateShacal();
  const m = useMutation<void, Error, SaveShacalPermissionsParams>(
    saveShacalPermissions,
    {
      onSuccess(_, { publicId }) {
        invalidateShacal(publicId);
      },
    }
  );
  return m;
}
