import { Page } from "@shacal/ui/components";
import { ShacalEvent } from "@shacal/ui/data-access";
import { useShacal } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { Permissions } from "./permissions";

function AddEventLink({ publicId }: { publicId: string }) {
  return <Link to={`/calendar/${publicId}/new-event`}>+ Add event</Link>;
}

type EventCardProps = {
  event: ShacalEvent;
};
function EventCard({ event }: EventCardProps) {
  return <div>{event.summary}</div>;
}

export function CalendarPage() {
  const { publicId } = useParams<{ publicId: string }>();
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
          {shacal.data?.owned ? (
            <Permissions
              publicId={publicId}
              isFetching={shacal.isFetching}
              addPermissionGrantedTo={shacal.data.addPermissionGrantedTo ?? []}
            />
          ) : null}
          {shacal.data?.canAdd ? <AddEventLink publicId={publicId} /> : null}
          <ul>
            {shacal.data?.events.map((event) => (
              <EventCard key={event.publicId} event={event} />
            ))}
          </ul>
        </Fragment>
      )}
    </Page>
  );
}
