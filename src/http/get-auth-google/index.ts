import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getOAuth2Client } from "@architect/shared/oAuth2Client";

export const handler = withBaseUrl(
  async (
    _: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const authUrl = getOAuth2Client(baseUrl).generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.app.created"],
    });

    return redirect(authUrl);
  }
);
