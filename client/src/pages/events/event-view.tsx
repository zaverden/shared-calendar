import styled from "@emotion/styled";
import { EventPayload } from "@shacal/ui/data-access";
import { AnchorButton } from "@shacal/ui/kit";
import React, { Fragment } from "react";
import { formatDate, formatMinutes, getDuration } from "utils";
import { DescriptionView } from "./description-view";

const Summary = styled.h1`
  font-size: var(--fs-xxl);
`;

const MutedLabel = styled.label`
  font-size: var(--fs-s);
  color: var(--fg-m);
`;

const Field = styled.p`
  font-size: var(--fs-xl);
  color: var(--fg-p);
  margin-top: 0;
`;

const urlRegex = /^https?:\/\//i;
type LocationFieldProps = {
  location: string;
};
function LocationField({ location }: LocationFieldProps) {
  if (location == null || location === "") {
    return null;
  }
  if (urlRegex.test(location)) {
    return (
      <AnchorButton
        medium
        secondary
        href={location}
        target="_blank"
        rel="noreferrer"
      >
        Online call link
      </AnchorButton>
    );
  }
  return (
    <MutedLabel>
      Location
      <Field>{location}</Field>
    </MutedLabel>
  );
}

export type EventViewProps = { event: EventPayload };
export function EventView({ event }: EventViewProps) {
  return (
    <Fragment>
      <Summary>{event.summary}</Summary>
      <MutedLabel>
        Start
        <Field>{formatDate(new Date(event.start))}</Field>
      </MutedLabel>
      <MutedLabel>
        Duration
        <Field>{formatMinutes(getDuration(event))}</Field>
      </MutedLabel>
      <LocationField location={event.location} />
      <DescriptionView description={event.description} />
    </Fragment>
  );
}
