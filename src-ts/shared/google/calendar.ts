import { calendar_v3, google } from "googleapis";

export type Calendar = {
  id: string;
  summary: string;
  description: string;
  color: string;
};

export type CalendarEventAttendee = {
  email: string;
  status: "declined" | "tentative" | "accepted";
};
export type CalendarEvent = {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  attendees: CalendarEventAttendee[];
};

export async function getCalendarsList(): Promise<Calendar[]> {
  const calendar = google.calendar("v3");
  const res = await calendar.calendarList.list({
    minAccessRole: "writer",
  });
  return (
    res.data.items?.map((it) => ({
      id: it.id!,
      summary: it.summary ?? "",
      description: it.description ?? "",
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

function buildCalendarEvent(rawEvent: calendar_v3.Schema$Event): CalendarEvent {
  return {
    id: rawEvent.id!,
    summary: rawEvent.summary ?? "",
    description: rawEvent.description ?? "",
    start: rawEvent.start?.dateTime!,
    end: rawEvent.end?.dateTime!,
    attendees:
      rawEvent.attendees
        ?.filter(
          ({ email, responseStatus }) => email != null && responseStatus != null
        )
        .map(({ email, responseStatus }) => ({
          email: email!,
          status: responseStatus as "declined" | "tentative" | "accepted",
        })) ?? [],
  };
}

export async function getFollowingEvents(
  googleCalendarId: string
): Promise<CalendarEvent[]> {
  const calendar = google.calendar("v3");
  const res = await calendar.events.list({
    calendarId: googleCalendarId,
    maxAttendees: 100,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: new Date().toISOString(),
    timeZone: "UTC",
  });

  return (
    res.data.items
      ?.filter(({ start }) => start?.dateTime != null) // exclude whole day events
      .map(buildCalendarEvent) ?? []
  );
}

export async function getEvent(
  googleCalendarId: string,
  googleEventId: string
): Promise<CalendarEvent | null> {
  const calendar = google.calendar("v3");
  const res = await calendar.events.get({
    calendarId: googleCalendarId,
    eventId: googleEventId,
    maxAttendees: 100,
    timeZone: "UTC",
  });
  if (res.data.status === "cancelled") {
    return null;
  }
  return buildCalendarEvent(res.data);
}
