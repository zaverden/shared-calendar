import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  getBaseUrl,
} from "@architect/shared/begin";
import { getOAuth2Client } from "@architect/shared/oAuth2Client";

export async function handler(
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> {
  const authUrl = getOAuth2Client(getBaseUrl(req)).generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.app.created"],
  });

  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  };
}
