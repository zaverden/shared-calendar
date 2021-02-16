import { google } from "googleapis";

export async function getCalendarsList() {
  const calendar = google.calendar("v3");
  return calendar.calendarList.list({
    minAccessRole: "owner",
  });
}
