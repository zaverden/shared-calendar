import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getAuthClient } from "@architect/shared/google/auth-client";

export const handler = withBaseUrl(
  async (
    _: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const authUrl = getAuthClient(baseUrl).generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.app.created", "openid"],
    });

    return redirect(authUrl);
  }
);
