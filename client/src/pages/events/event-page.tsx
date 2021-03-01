import { Page } from "@shacal/ui/components";
import { EventPayload } from "@shacal/ui/data-access";
import { useEvent, useUpdateEvent } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import { formatDate, getDuration } from "utils";
import { Attendees } from "./attendees";
import { EventForm } from "./event-form";
import { JoinEvent } from "./join-event";
import { DescriptionView } from "./description-view";

type EventViewProps = { event: EventPayload };
function EventView({ event }: EventViewProps) {
  return (
    <Fragment>
      <label style={{ display: "block" }}>
        Summary
        <span>{event.summary}</span>
      </label>
      <label style={{ display: "block" }}>
        Start
        <span>{formatDate(new Date(event.start))}</span>
      </label>
      <label style={{ display: "block" }}>
        Duration (minutes)
        <span>{getDuration(event)}</span>
      </label>
      <label style={{ display: "block" }}>
        Location
        <a href={event.location}>{event.location}</a>
      </label>
      <label style={{ display: "block" }}>
        Description
        <DescriptionView description={event.description} />
      </label>
    </Fragment>
  );
}

export function EventPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const event = useEvent(publicId);
  const update = useUpdateEvent();
  return (
    <Page loading={event.isLoading} title={event.data?.summary ?? "Event"}>
      {() => (
        <Fragment>
          {event.data?.owned ? (
            <EventForm
              event={event.data}
              isSaving={update.isLoading}
              onSave={(e) => update.mutate({ publicId, event: e })}
            />
          ) : (
            <EventView event={event.data!} />
          )}
          <JoinEvent publicId={publicId} />
          <Attendees attendees={event.data?.attendees} />
        </Fragment>
      )}
    </Page>
  );
}
