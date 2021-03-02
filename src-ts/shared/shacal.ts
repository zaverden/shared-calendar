import * as D from "@begin/data";
import * as R from "runtypes";
import { getId } from "./utils";

const SHACAL_TABLE = "SHACAL";
const Shacal = R.Record({
  publicId: R.String,
  userId: R.String,
  googleAccountId: R.String,
  googleCalendarId: R.String,
  addPermissionGrantedTo: R.Array(R.String),
});
export type Shacal = R.Static<typeof Shacal>;

export async function createShacal(
  userId: string,
  googleAccountId: string,
  googleCalendarId: string
): Promise<Shacal> {
  const publicId = getId();
  const record = await D.set<{ data: Shacal }>({
    table: SHACAL_TABLE,
    key: publicId,
    data: {
      publicId,
      userId,
      googleAccountId,
      googleCalendarId,
      addPermissionGrantedTo: [],
    },
  });
  return record.data;
}

export async function getShacal(publicId: string): Promise<Shacal | null> {
  const r = await D.get({
    table: SHACAL_TABLE,
    key: publicId,
  });
  const shacalResult = Shacal.validate(r?.data);
  return shacalResult.success ? shacalResult.value : null;
}

export async function deleteShacal(publicId: string): Promise<void> {
  await D.destroy({
    table: SHACAL_TABLE,
    key: publicId,
  });
}

export async function replaceShacal(shacal: Shacal): Promise<Shacal> {
  const record = await D.set<{ data: Shacal }>({
    table: SHACAL_TABLE,
    key: shacal.publicId,
    data: shacal,
  });
  return record.data;
}
