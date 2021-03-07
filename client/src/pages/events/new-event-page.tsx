import { Page } from "@shacal/ui/components";
import { useCreateEvent, usePublicIdParam } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { EventForm } from "./event-form";

const event = {
  summary: "",
  description: "",
  start: "",
  end: "",
  location: "",
};

export function NewEventPage() {
  const publicId = usePublicIdParam();
  const create = useCreateEvent();
  return (
    <Page loading={false} title="New Event">
      {() => (
        <Fragment>
          {create.isSuccess ? (
            <Redirect to={`/event/${create.data?.publicId}`} />
          ) : null}
          <EventForm
            event={event}
            isSaving={create.isLoading}
            onSave={(event) =>
              create.mutate({ shacalPublicId: publicId, event })
            }
          />
        </Fragment>
      )}
    </Page>
  );
}
