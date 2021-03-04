import styled from "@emotion/styled";
import { Page } from "@shacal/ui/components";
import { useCalendarsList } from "@shacal/ui/hooks";
import { Button, H1, LinkButton } from "@shacal/ui/kit";
import { useShareCalendar } from "hooks/useShareCalendar";
import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";

function Dot({ color }: { color: string }) {
  return (
    <span aria-label="" style={{ color }}>
      &#11044;
    </span>
  );
}

type CalendarStatusProps = {
  id: string;
  publicId: string | undefined | null;
  onShare: (id: string) => void;
  isSharing: boolean;
  sharingId: string | undefined;
};
function CalendarStatus({
  id,
  publicId,
  sharingId,
  isSharing,
  onShare,
}: CalendarStatusProps) {
  if (publicId != null) {
    return (
      <LinkButton medium to={`/calendar/${publicId}`}>
        Go
      </LinkButton>
    );
  }
  if (isSharing && id === sharingId) {
    return <span>SHARING...</span>;
  }
  return (
    <Button medium secondary onClick={() => onShare(id)} disabled={isSharing}>
      Share
    </Button>
  );
}

const List = styled.ul`
  list-style-type: none;
  padding-inline: 0;
`;

const Line = styled.li`
  display: flex;
  align-items: baseline;
  padding: 1em 0;
  gap: 1em;

  & > :nth-child(1) {
    flex-grow: 0;
  }
  & > :nth-child(2) {
    flex-grow: 1;
  }
  & > :nth-child(3) {
    flex-grow: 0;
    min-width: 67px;
  }
`;

const calendars = [
  {
    id: "family02577700305349388287@group.calendar.google.com",
    summary: "Family",
    description: "",
    color: "#a47ae2",
  },
  {
    id: "eo63akj6c37vlcjaiqqihv68bk@group.calendar.google.com",
    summary: "shacal",
    description: "shacal",
    color: "#f83a22",
    publicId: "177fe5c303c13038c02",
  },
  {
    id: "zaverden@gmail.com",
    summary: "zaverden@gmail.com",
    description: "Это мое",
    color: "#d06b64",
  },
  {
    id: "m52biqsvu6t29r4hd7nrn0gmac@group.calendar.google.com",
    summary: "Some long name for my google calendar to text how it is shown",
    description: "",
    color: "#f691b2",
    publicId: "177fe64eff23fb29aab",
  },
];

export function CalendarsListPageFake() {
  return (
    <Page title="Google Calendars" loading={false}>
      {() => (
        <Fragment>
          <H1>Available calendars</H1>
          <List>
            {calendars?.map(({ id, summary, color, publicId }) => (
              <Line key={id}>
                <Dot color={color} />
                <span>{summary}</span>
                <CalendarStatus
                  id={id}
                  publicId={publicId}
                  isSharing={false}
                  sharingId={""}
                  onShare={() => {}}
                />
              </Line>
            ))}
          </List>
        </Fragment>
      )}
    </Page>
  );
}
