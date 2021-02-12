import { google, Auth } from "googleapis";
import { Result } from "../result";
import { getGoogleAccount, GoogleAccount, saveGoogleAccount } from "./storage";

export async function authorizeGoogleApi(
  authClient: Auth.OAuth2Client,
  accountId: string
): Promise<Result<null>> {
  const account = await getGoogleAccount(accountId);
  if (account == null) {
    return { success: false, message: `Unknown accountId '${accountId}'` };
  }
  authClient.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    expiry_date: account.expiryDate,
  });

  if (account.expiryDate < Date.now()) {
    const refreshResult = await refreshToken(authClient, account);
    if (refreshResult.success === false) {
      return refreshResult;
    }
  }
  google.options({
    auth: authClient,
  });
  return { success: true, value: null };
}

async function refreshToken(
  authClient: Auth.OAuth2Client,
  account: GoogleAccount
): Promise<Result<null>> {
  try {
    const { credentials } = await authClient.refreshAccessToken();
    authClient.setCredentials(credentials);
    await saveGoogleAccount({
      ...account,
      accessToken: credentials.access_token ?? "",
      refreshToken: credentials.refresh_token ?? "",
      expiryDate: credentials.expiry_date ?? Date.now(),
    });
    return { success: true, value: null };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
