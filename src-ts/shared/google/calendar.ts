import * as R from "runtypes";
import { calendar_v3, google } from "googleapis";
import { Result } from "../result";

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
  location: string;
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
    location: rawEvent.location ?? "",
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
    orderBy: "startTime",
    singleEvents: true,
    timeMin: new Date().toISOString(),
    timeZone: "UTC",
    maxResults: 20,
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
    timeZone: "UTC",
  });
  if (res.data.status === "cancelled") {
    return null;
  }
  return buildCalendarEvent(res.data);
}

export async function addAttendee(
  googleCalendarId: string,
  googleEventId: string,
  email: string
): Promise<Result<null>> {
  const calendar = google.calendar("v3");
  const eventRes = await calendar.events.get({
    calendarId: googleCalendarId,
    eventId: googleEventId,
    timeZone: "UTC",
  });
  if (eventRes.data.status === "cancelled") {
    return { success: false, message: "Event not found" };
  }

  const attendees = [
    ...(eventRes.data.attendees ?? []),
    {
      email,
      responseStatus: "accepted",
    },
  ];
  const patchRes = await calendar.events.patch({
    calendarId: googleCalendarId,
    eventId: googleEventId,
    requestBody: { attendees },
    sendUpdates: "all",
  });
  if (200 <= patchRes.status && patchRes.status <= 299) {
    return { success: true, value: null };
  }

  console.log("addAttendee patch error", patchRes);
  return { success: false, message: `Patch failed with ${patchRes.status}` };
}

export const EventPayload = R.Record({
  summary: R.String,
  description: R.String,
  start: R.String,
  end: R.String,
  location: R.String,
});
export type EventPayload = R.Static<typeof EventPayload>;

export async function insertEvent(
  googleCalendarId: string,
  eventPayload: EventPayload
): Promise<Result<CalendarEvent>> {
  const calendar = google.calendar("v3");
  const insertRes = await calendar.events.insert({
    calendarId: googleCalendarId,
    requestBody: {
      summary: eventPayload.summary,
      description: eventPayload.description,
      location: eventPayload.location,
      start: {
        dateTime: eventPayload.start,
      },
      end: {
        dateTime: eventPayload.end,
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
    },
  });

  if (200 <= insertRes.status && insertRes.status <= 299) {
    return { success: true, value: buildCalendarEvent(insertRes.data) };
  }
  console.log("insertEvent error", insertRes);
  return { success: false, message: `Insert failed with ${insertRes.status}` };
}

export async function updateEvent(
  googleCalendarId: string,
  googleEventId: string,
  eventPayload: EventPayload
): Promise<Result<CalendarEvent>> {
  const calendar = google.calendar("v3");
  const patchRes = await calendar.events.patch({
    calendarId: googleCalendarId,
    eventId: googleEventId,
    sendUpdates: "all",
    requestBody: {
      summary: eventPayload.summary,
      description: eventPayload.description,
      location: eventPayload.location,
      start: {
        dateTime: eventPayload.start,
      },
      end: {
        dateTime: eventPayload.end,
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
    },
  });

  if (200 <= patchRes.status && patchRes.status <= 299) {
    return { success: true, value: buildCalendarEvent(patchRes.data) };
  }
  console.log("updateEvent error", patchRes);
  return { success: false, message: `Patch failed with ${patchRes.status}` };
}
