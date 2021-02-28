import { tryGetJsonMessage } from "utils";

export type ShacalEventAttendee = {
  email: string;
  status: "declined" | "tentative" | "accepted";
};

export type ShacalEvent = {
  publicId: string;
  owned: boolean;
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  attendees?: ShacalEventAttendee[];
};

export type EventPayload = {
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
};

export type CreateEventParams = {
  shacalPublicId: string;
  event: EventPayload;
};
export async function createEvent({
  shacalPublicId,
  event,
}: CreateEventParams): Promise<ShacalEvent> {
  const res = await fetch(`/api/c/s/${shacalPublicId}/e`, {
    method: "POST",
    body: JSON.stringify(event),
  });
  if (res.status === 200) {
    const json = await res.json();
    return json.value;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}

export async function loadEvent(publicId: string): Promise<ShacalEvent> {
  const res = await fetch(`/api/e/${publicId}`);
  if (res.status === 200) {
    return await res.json();
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}

export type UpdateEventParams = {
  publicId: string;
  event: EventPayload;
};
export async function updateEvent({
  publicId,
  event,
}: UpdateEventParams): Promise<ShacalEvent> {
  const res = await fetch(`/api/e/${publicId}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
  if (res.status === 200) {
    const json = await res.json();
    return json.value;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}

export type JoinEventParams = {
  publicId: string;
  email: EventPayload;
};
export async function joinEvent({
  publicId,
  email,
}: JoinEventParams): Promise<void> {
  const res = await fetch(`/api/e/${publicId}/join`, {
    method: "POST",
    body: JSON.stringify({ email }),
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
