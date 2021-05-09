import * as D from "@begin/data";
import * as R from "runtypes";
import { getId } from "../utils";

const USER_TABLE = "USERS";

const MyEvent = R.Record({
  publicId: R.String,
  summary: R.String,
  start: R.String,
});
export type MyEvent = R.Static<typeof MyEvent>;

const User = R.Record({
  userId: R.String,
  googleAccountId: R.String,
  email: R.String,
  sharedCalendars: R.Dictionary(R.String, "string"),
  myEvents: R.Dictionary(MyEvent, "string").Or(R.Undefined),
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
    data: { userId, email, googleAccountId, sharedCalendars: {}, myEvents: {} },
  });
  return userRecord.data;
}

export async function updateUser(user: User): Promise<void> {
  await D.set<{ data: User }>({
    table: USER_TABLE,
    key: user.userId,
    data: user,
  });
}

export async function updateMyEvent(user: User, event: MyEvent): Promise<void> {
  const myEvents = user.myEvents ?? {};
  if (
    event.publicId in myEvents &&
    areEventsEqual(myEvents[event.publicId]!, event)
  ) {
    // nothing to update
    return;
  }

  // include only expected fields
  const { publicId, start, summary } = event;
  const updatedUser = {
    ...user,
    myEvents: {
      ...user.myEvents,
      [event.publicId]: { publicId, start, summary },
    },
  };
  await updateUser(updatedUser);
}

function areEventsEqual(a: MyEvent, b: MyEvent): boolean {
  return (
    a.publicId === b.publicId && a.start === b.start && a.summary === b.summary
  );
}
