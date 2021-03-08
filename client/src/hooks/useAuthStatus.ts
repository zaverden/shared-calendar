import { loadAuthStatus } from "@shacal/ui/data-access";
import { useQuery, UseQueryResult } from "react-query";

const AUTH_STATUS_KEY = "AUTH_STATUS";

export function useAuthStatus(): UseQueryResult<boolean> {
  return useQuery([AUTH_STATUS_KEY], loadAuthStatus);
}
