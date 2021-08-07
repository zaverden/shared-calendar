import { Page } from "@shacal/ui/components";
import { ShacalEvent } from "@shacal/ui/data-access";
import { usePublicIdParam, useShacal } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { Link, LinkButton } from "@shacal/ui/kit";
import { formatDate } from "utils";
import { Permissions } from "./permissions";

function AddEventLink({ publicId }: { publicId: string }) {
  return <LinkButton to={`/calendar/${publicId}/new-event`}>Create New Event</LinkButton>;
}

type EventCardProps = {
  event: ShacalEvent;
};
function EventCard({ event }: EventCardProps) {
  const d = new Date(event.start);
  return (
    <div style={{ marginTop: "17px" }}>
      <Link to={`/event/${event.publicId}`}>{event.summary}</Link>
      <div>{formatDate(d)}</div>
    </div>
  );
}

export function CalendarPage() {
  const publicId = usePublicIdParam();
  const shacal = useShacal(publicId);
  return (
    <Page
      loading={shacal.isLoading}
      title="Calendar"
      showAuth={shacal.error?.message === "401"}
      show404={shacal.error?.message === "404"}
    >
      {() => (
        <Fragment>
          {shacal.data?.canAdd ? <AddEventLink publicId={publicId} /> : null}
          {shacal.data?.owned ? (
            <Permissions
              publicId={publicId}
              isFetching={shacal.isFetching}
              addPermissionGrantedTo={shacal.data.addPermissionGrantedTo ?? []}
            />
          ) : null}
          <ul style={{ padding: "0", marginTop: "0" }}>
            {shacal.data?.events.map((event) => (
              <EventCard key={event.publicId} event={event} />
            ))}
          </ul>
          {shacal.data?.events.length === 20 ? (
            <p>
              You can see only 20 nearest events. You'll see future events
              later.
            </p>
          ) : null}
        </Fragment>
      )}
    </Page>
  );
}
