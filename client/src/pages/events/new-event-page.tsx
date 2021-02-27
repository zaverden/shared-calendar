import { Page } from "@shacal/ui/components";
import React from "react";
import { EventForm } from "./event-form";

const event = {
  summary: "",
  description: "",
  start: "",
  end: "",
  location: "",
};

export function NewEventPage() {
  return (
    <Page loading={false} title="New Event">
      {() => (
        <EventForm event={event} onSave={(e) => console.log(e)}></EventForm>
      )}
    </Page>
  );
}
