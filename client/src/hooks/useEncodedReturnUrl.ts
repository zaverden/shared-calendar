import { useLocation } from "react-router-dom";

export function useEncodedReturnUrl() {
  const { pathname, search } = useLocation();
  return encodeURIComponent(pathname + search);
}
