import { Page } from "@shacal/ui/components";
import { useEvent, useUpdateEvent } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import { Attendees } from "./attendees";
import { EventForm } from "./event-form";
import { JoinEvent } from "./join-event";
import { EventView } from "./event-view";

export function EventPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const event = useEvent(publicId);
  const update = useUpdateEvent();
  return (
    <Page
      loading={event.isLoading}
      show404={event.error?.message === "404"}
      title={event.data?.summary ?? "Event"}
    >
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
