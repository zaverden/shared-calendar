import * as D from "@begin/data";
import { InputDocument } from "@begin/data";
import * as R from "runtypes";
import { CalendarEvent } from "./google/calendar";
import { Shacal } from "./shacal";
import { AssignFields } from "./ts-utils";
import { getId, getTTL } from "./utils";

const EVENT_MAP_TABLE = "EVENT_MAPS";
const ShacalEventMap = R.Record({
  googleEventId: R.String,
  publicId: R.String,
  userId: R.String,
});
export type ShacalEventMap = R.Static<typeof ShacalEventMap>;

const EVENT_TABLE = "EVENTS";
const ShacalEvent = R.Record({
  publicId: R.String,
  userId: R.String,
  shacalUserId: R.String,
  googleEventId: R.String,
  googleAccountId: R.String,
  googleCalendarId: R.String,
});
export type ShacalEvent = R.Static<typeof ShacalEvent>;

export async function getEventMaps(
  googleEventIds: string[]
): Promise<Map<string, ShacalEventMap>> {
  if (googleEventIds.length === 0) {
    return new Map<string, ShacalEvent>();
  }

  const data = await D.get(
    googleEventIds.map((eid) => ({ table: EVENT_MAP_TABLE, key: eid }))
  );
  const maps = data
    .map((d) => d.data)
    .filter((m): m is ShacalEventMap => ShacalEventMap.guard(m))
    .map((m) => [m.googleEventId, m] as const);
  return new Map(maps);
}

function buildEventMapDocument(
  publicId: string,
  googleEventId: string,
  eventEnd: Date,
  userId: string
): InputDocument<{ data: ShacalEventMap }> {
  return {
    table: EVENT_MAP_TABLE,
    key: googleEventId,
    ttl: getTTL(eventEnd),
    data: {
      publicId,
      googleEventId,
      userId,
    },
  };
}

async function createEventMapsBatch(
  mapData: Array<{ publicId: string; googleEventId: string; eventEnd: Date }>,
  userId: string
): Promise<ShacalEventMap[]> {
  if (mapData.length === 0) {
    return [];
  }

  const docs = mapData.map(({ publicId, googleEventId, eventEnd }) =>
    buildEventMapDocument(publicId, googleEventId, eventEnd, userId)
  );
  const savedDocs = await D.set<{ data: ShacalEventMap }>(docs);
  return savedDocs.map(({ data }) => data);
}

function buildShacalEventDocument(
  googleEventId: string,
  eventEnd: Date,
  userId: string,
  shacal: Shacal
): InputDocument<{ data: ShacalEvent }> {
  const publicId = getId();
  return {
    table: EVENT_TABLE,
    key: publicId,
    ttl: getTTL(eventEnd),
    data: {
      publicId,
      userId,
      googleEventId,
      shacalUserId: shacal.userId,
      googleAccountId: shacal.googleAccountId,
      googleCalendarId: shacal.googleCalendarId,
    },
  };
}

export async function createShacalEvent(
  googleEventId: string,
  eventEndTime: Date,
  userId: string,
  shacal: Shacal
): Promise<ShacalEvent> {
  const event = await D.set<{ data: ShacalEvent }>(
    buildShacalEventDocument(googleEventId, eventEndTime, userId, shacal)
  );
  return event.data;
}

async function createShacalEventBatch(
  eventsData: Array<{ googleEventId: string; eventEnd: Date }>,
  userId: string,
  shacal: Shacal
): Promise<ShacalEvent[]> {
  if (eventsData.length === 0) {
    return [];
  }

  const docs = eventsData.map(({ googleEventId, eventEnd: eventEnd }) =>
    buildShacalEventDocument(googleEventId, eventEnd, userId, shacal)
  );
  const savedDocs = await D.set<{ data: ShacalEvent }>(docs);
  return savedDocs.map(({ data }) => data);
}

export type PublicEvent = AssignFields<
  Omit<CalendarEvent, "id">,
  {
    publicId: string;
    owned: boolean;
    attendees?: CalendarEvent["attendees"];
  }
>;

async function addMissingEvents(
  googleEvents: CalendarEvent[],
  eventMaps: Map<string, ShacalEventMap>,
  shacal: Shacal
): Promise<ShacalEvent[]> {
  const missingEventsData = googleEvents
    .filter(({ id }) => !eventMaps.has(id))
    .map(({ id, end }) => ({ googleEventId: id, eventEnd: new Date(end) }));

  const savedEvents = await createShacalEventBatch(
    missingEventsData,
    shacal.userId,
    shacal
  );

  const missingEventsEndMap = new Map(
    missingEventsData.map(({ googleEventId, eventEnd }) => [
      googleEventId,
      eventEnd,
    ])
  );

  const mapsData = savedEvents.map(({ publicId, googleEventId }) => ({
    publicId,
    googleEventId,
    eventEnd: missingEventsEndMap.get(googleEventId)!,
  }));
  await createEventMapsBatch(mapsData, shacal.userId);
  return savedEvents;
}

export async function ensureEvents(
  googleEvents: CalendarEvent[],
  shacal: Shacal,
  currentUserId: string | null
): Promise<PublicEvent[]> {
  if (googleEvents.length === 0) {
    return [];
  }

  const eventMaps = await getEventMaps(googleEvents.map(({ id }) => id));
  const savedEvents = await addMissingEvents(googleEvents, eventMaps, shacal);
  savedEvents.forEach(({ googleEventId, publicId }) =>
    eventMaps.set(googleEventId, {
      publicId,
      googleEventId,
      userId: shacal.userId,
    })
  );

  const events = googleEvents.map((event) => {
    const owned =
      shacal.userId === currentUserId ||
      eventMaps.get(event.id)?.userId === currentUserId;
    return {
      publicId: eventMaps.get(event.id)?.publicId!,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
      owned: owned,
      attendees: owned ? event.attendees : undefined,
    };
  });
  return events;
}

export async function getShacalEvent(
  publicId: string
): Promise<ShacalEvent | null> {
  const r = await D.get({
    table: EVENT_TABLE,
    key: publicId,
  });
  const result = ShacalEvent.validate(r?.data);
  return result.success ? result.value : null;
}
