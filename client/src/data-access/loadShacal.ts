import { tryGetJsonMessage } from "utils";
import { ShacalEvent } from "./event";

export type Shacal = {
  owned: boolean;
  canAdd: boolean;
  addPermissionGrantedTo?: string[];
  events: ShacalEvent[];
};
export async function loadShacal(publicId: string): Promise<Shacal> {
  const res = await fetch(`/api/c/s/${publicId}`);
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
