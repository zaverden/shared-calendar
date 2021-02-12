import { google, Auth } from "googleapis";
import { credentials } from "./credentials";

export function getAuthClient(baseUrl: string): Auth.OAuth2Client {
  const { clientSecret, clientId } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${baseUrl}/auth/google/callback`
  );
  return oAuth2Client;
}
