import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "../begin";
import { getAuthClient } from "../google/auth-client";
import { sanitizeReturnUrl } from "../utils";

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
