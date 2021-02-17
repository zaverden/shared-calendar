import * as D from "@begin/data";
import * as R from "runtypes";
import { getId } from "./utils";

const SHACAL_TABLE = "USERS";
const Shacal = R.Record({
  publicId: R.String,
  userId: R.String,
  googleCalendarId: R.String,
  addPermissionGrantedTo: R.Array(R.String),
});
export type Shacal = R.Static<typeof Shacal>;

export async function createShacal(
  userId: string,
  googleCalendarId: string
): Promise<Shacal> {
  const publicId = getId();
  const record = await D.set<{ data: Shacal }>({
    table: SHACAL_TABLE,
    key: publicId,
    data: {
      publicId,
      userId,
      googleCalendarId,
      addPermissionGrantedTo: [],
    },
  });
  return record.data;
}

export async function deleteShacal(publicId: string): Promise<void> {
  await D.destroy({
    table: SHACAL_TABLE,
    key: publicId,
  });
}
