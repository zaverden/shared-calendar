import { buildJWTCookie, getJWT } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getAuthClient } from "@architect/shared/google/auth-client";
import {
  getGoogleAccount,
  GoogleAccount,
  saveGoogleAccount,
} from "@architect/shared/google/storage";
import { createUser, getUser, User } from "@architect/shared/user/storage";
import { getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

export const handler = withBaseUrl(
  async (
    req: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const { code } = req.queryStringParameters ?? {};

    if (code === undefined) {
      return redirect("/auth/error");
    }

    const oAuth2Client = getAuthClient(baseUrl);
    const { tokens } = await oAuth2Client.getToken(code);
    const tokenInfo = await oAuth2Client.getTokenInfo(
      tokens.access_token ?? ""
    );

    if (tokenInfo.sub === undefined) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          ok: false,
          message: "Goggle has not provided account ID",
        }),
      };
    }

    const user = await getUserByGoogleAccount({
      accountId: tokenInfo.sub,
      accessToken: tokens.access_token ?? "",
      refreshToken: tokens.refresh_token ?? "",
      expiryDate: tokens.expiry_date ?? 1,
    });

    const jwt = getJWT(user.userId, await getJWTSecret());

    return redirect("/", {
      cookies: [buildJWTCookie(jwt, getJWTCookieName())],
    });
  }
);

async function getUserByGoogleAccount(
  googleAccount: Omit<GoogleAccount, "userId">
): Promise<User> {
  const existingGoogleAccount = await getGoogleAccount(googleAccount.accountId);
  let user =
    existingGoogleAccount?.userId == null
      ? null
      : await getUser(existingGoogleAccount?.userId);
  if (user == null) {
    user = await createUser(googleAccount.accountId);
  }

  await saveGoogleAccount({
    ...googleAccount,
    userId: user.userId,
  });

  return user;
}
