import { authorizeEmail, AuthorizeEmailParams } from "@shacal/ui/data-access";
import { useMutation, UseMutationResult } from "react-query";

export function useAuthorizeEmail(): UseMutationResult<
  void,
  Error,
  AuthorizeEmailParams
> {
  const m = useMutation<void, Error, AuthorizeEmailParams>(authorizeEmail);
  return m;
}
