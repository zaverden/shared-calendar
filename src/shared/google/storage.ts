import * as R from "runtypes";
import * as D from "@begin/data";

const GOOGLE_ACCOUNT_TABLE = "GOOGLE_ACCOUNT";

const GoogleAccount = R.Record({
  accountId: R.String,
  userId: R.String,
  accessToken: R.String,
  refreshToken: R.String,
  expiryDate: R.Number,
});
export type GoogleAccount = R.Static<typeof GoogleAccount>;

export async function getGoogleAccount(
  accountId: string
): Promise<GoogleAccount | null> {
  const r = await D.get({
    table: GOOGLE_ACCOUNT_TABLE,
    key: accountId,
  });
  const accountResult = GoogleAccount.validate(r?.account);
  return accountResult.success ? accountResult.value : null;
}

export async function saveGoogleAccount(account: GoogleAccount): Promise<void> {
  await D.set({
    table: GOOGLE_ACCOUNT_TABLE,
    key: account.accountId,
    account,
  });
}
