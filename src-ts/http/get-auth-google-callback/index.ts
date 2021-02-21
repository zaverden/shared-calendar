import { buildAuthCookie, buildAuthToken } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { buildConfirmedEmailsCookie } from "@architect/shared/confirmed-emails";
import { getAuthClient } from "@architect/shared/google/auth-client";
import {
  getGoogleAccount,
  GoogleAccount,
  saveGoogleAccount,
} from "@architect/shared/google/storage";
import { createUser, getUser, User } from "@architect/shared/user/storage";
import {
  getConfirmedEmailsCookieName,
  getJWTCookieName,
  getJWTSecret,
  sanitizeReturnUrl,
} from "@architect/shared/utils";
import { URL } from "url";

export const handler = withBaseUrl(
  async (
    req: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const { code, state: returnUrl } = req.queryStringParameters ?? {};

    if (code === undefined) {
      return redirect("/auth/error");
    }

    const oAuth2Client = getAuthClient(baseUrl);
    const { tokens } = await oAuth2Client.getToken(code);
    const tokenInfo = await oAuth2Client.getTokenInfo(
      tokens.access_token ?? ""
    );

    console.log({ tokens, tokenInfo });

    if (tokenInfo.sub === undefined) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          ok: false,
          message: "Goggle has not provided account ID",
        }),
      };
    }

    const user = await getUserByGoogleAccount(
      {
        accountId: tokenInfo.sub,
        accessToken: tokens.access_token ?? "",
        refreshToken: tokens.refresh_token ?? "",
        expiryDate: tokens.expiry_date ?? 1,
      },
      tokenInfo.email ?? ""
    );

    const jwt = buildAuthToken(user.userId, getJWTSecret());
    const emailToken = buildConfirmedEmailsCookie(
      [user.email],
      getConfirmedEmailsCookieName(),
      getJWTSecret()
    );

    const url = new URL("/auth/email/callback", "https://fake");
    url.searchParams.append("t", emailToken);
    url.searchParams.append("r", sanitizeReturnUrl(returnUrl));

    return redirect(url.pathname + url.search, {
      cookies: [buildAuthCookie(jwt, getJWTCookieName())],
    });
  }
);

async function getUserByGoogleAccount(
  googleAccount: Omit<GoogleAccount, "userId">,
  email: string
): Promise<User> {
  const existingGoogleAccount = await getGoogleAccount(googleAccount.accountId);
  let user =
    existingGoogleAccount?.userId == null
      ? null
      : await getUser(existingGoogleAccount?.userId);
  if (user == null) {
    user = await createUser(googleAccount.accountId, email);
  }

  // https://googlecode.blogspot.com/2011/10/upcoming-changes-to-oauth-20-endpoint.html
  // under Change #3: Server-side auto-approval
  // > Refresh tokens are not returned for responses that were auto-approved
  // When user authorizes for the first time, server returns a refresh token.
  // For the second time a refresh token is omitted.
  // Refresh tokens are not expiring so we should reuse them.
  const refreshToken =
    googleAccount.refreshToken === ""
      ? existingGoogleAccount?.refreshToken ?? ""
      : googleAccount.refreshToken;

  await saveGoogleAccount({
    ...googleAccount,
    refreshToken,
    userId: user.userId,
  });

  return user;
}
