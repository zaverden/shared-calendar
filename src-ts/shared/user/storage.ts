import * as D from "@begin/data";
import * as R from "runtypes";
import { getId } from "../utils";

const USER_TABLE = "USERS";

const User = R.Record({
  userId: R.String,
  googleAccountId: R.String,
  email: R.String,
  sharedCalendars: R.Dictionary(R.String, "string"),
});
export type User = R.Static<typeof User>;

export async function getUser(userId: string): Promise<User | null> {
  const r = await D.get({
    table: USER_TABLE,
    key: userId,
  });
  const userResult = User.validate(r?.data);
  return userResult.success ? userResult.value : null;
}

export async function createUser(
  googleAccountId: string,
  email: string
): Promise<User> {
  const userId = getId();
  const userRecord = await D.set<{ data: User }>({
    table: USER_TABLE,
    key: userId,
    data: { userId, email, googleAccountId, sharedCalendars: {} },
  });
  return userRecord.data;
}
