import styled from "@emotion/styled";
import { EventPayload } from "@shacal/ui/data-access";
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

const LocationAnchor = styled.a`
  font-size: var(--fs-xl);
  color: var(--fg-a);

  & > svg {
    height: 1.2em;
    vertical-align: bottom;
  }
`;

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <g
        stroke="#72B3AC"
        strokeWidth="1.5"
        fill="none"
      >
        <polyline points="17 13.5 17 19.5 5 19.5 5 7.5 11 7.5"></polyline>
        <path d="M14,4.5 L20,4.5 L20,10.5 M20,4.5 L11,13.5"></path>
      </g>
    </svg>
  );
}

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
      <LocationAnchor href={location} target="_blank" rel="noreferrer">
        <ExternalLinkIcon />
        Go to online call
      </LocationAnchor>
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
