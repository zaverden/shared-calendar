import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { sanitizeReturnUrl } from "@architect/shared/utils";

export const handler = withBaseUrl(
  async (
    req: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const returnUrl = req.queryStringParameters?.r;
    const authUrl = getAuthClient(baseUrl).generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
      ],
      state: sanitizeReturnUrl(returnUrl),
    });

    return redirect(authUrl);
  }
);
