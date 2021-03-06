import { tryGetJsonMessage } from "utils";

export type SaveShacalPermissionsParams = {
  publicId: string;
  addPermissionGrantedTo: string[];
};
export async function saveShacalPermissions({
  publicId,
  addPermissionGrantedTo,
}: SaveShacalPermissionsParams): Promise<void> {
  const res = await fetch(`/api/c/s/${publicId}/p`, {
    method: "PUT",
    body: JSON.stringify({ addPermissionGrantedTo }),
  });
  if (res.status === 200) {
    return;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
