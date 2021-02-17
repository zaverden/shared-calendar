import { google } from "googleapis";

export type Calendar = {
  id: string;
  summary: string;
  description?: string | null;
  color: string;
};

export async function getCalendarsList(): Promise<Calendar[]> {
  const calendar = google.calendar("v3");
  const res = await calendar.calendarList.list({
    minAccessRole: "writer",
  });
  return (
    res.data.items?.map((it) => ({
      id: it.id!,
      summary: it.summary!,
      description: it.description,
      color: it.backgroundColor!,
    })) ?? []
  );
}

export async function hasWritePermissionToCalendar(
  googleCalendarId: string
): Promise<boolean> {
  const calendar = google.calendar("v3");
  const res = await calendar.calendarList
    .get({
      calendarId: googleCalendarId,
    })
    .catch(() => ({ data: { accessRole: undefined } }));

  const accessRole = res.data.accessRole;

  return accessRole === "writer" || accessRole === "owner";
}
