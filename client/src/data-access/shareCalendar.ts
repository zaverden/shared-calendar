import { tryGetJsonMessage } from "utils";

export async function shareCalendar(googleCalendarId: string): Promise<string> {
  const res = await fetch(`/api/c/s/${encodeURIComponent(googleCalendarId)}`, {
    method: "POST",
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.publicId;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
