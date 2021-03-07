import { HttpFunctionRequest, HttpFunctionResponse, redirect } from "@architect/shared/begin";
import { formatDeleteCookie, getJWTCookieName, sanitizeReturnUrl } from "../utils";

export const handler = async (
  req: HttpFunctionRequest,
): Promise<HttpFunctionResponse> => {
  const { r: returnUrl } = req.queryStringParameters ?? {};

  return redirect(sanitizeReturnUrl(returnUrl), {
    cookies: [
      formatDeleteCookie(getJWTCookieName())
    ]
  });
};
