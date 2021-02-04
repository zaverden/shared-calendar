import { google } from "googleapis";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
} from "@architect/shared/begin";
import { credentials } from "@architect/shared/google-credentials";

export async function handler(
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> {
  const { domainName } = req.requestContext;
  const { clientSecret, clientId, redirectUri } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri(domainName)
  );
  const authUrl = oAuth2Client.generateAuthUrl({
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
