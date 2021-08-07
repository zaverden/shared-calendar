import styled from "@emotion/styled";
import { Page } from "@shacal/ui/components";
import { useCalendarsList } from "@shacal/ui/hooks";
import { Button, H1, LinkButton } from "@shacal/ui/kit";
import { useShareCalendar } from "hooks/useShareCalendar";
import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";

const GoLinkButton = styled(LinkButton)`
  width: auto;
`;
const ShareButton = styled(Button)`
  width: auto;
`;

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
      <GoLinkButton medium to={`/calendar/${publicId}`}>
        Go
      </GoLinkButton>
    );
  }
  if (isSharing && id === sharingId) {
    return <span>SHARING...</span>;
  }
  return (
    <ShareButton
      medium
      secondary
      onClick={() => onShare(id)}
      disabled={isSharing}
    >
      Share
    </ShareButton>
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

export function CalendarsListPage() {
  const { isLoading, error, data: calendars } = useCalendarsList();
  const share = useShareCalendar();
  return (
    <Page
      title="Google Calendars"
      loading={isLoading}
      showAuth={error?.message === "401"}
    >
      {() => (
        <Fragment>
          {share.isSuccess ? (
            <Redirect to={`/calendar/${share.data}`} push />
          ) : null}
          <H1>Available calendars</H1>
          <List>
            {calendars?.map(({ id, summary, color, publicId }) => (
              <Line key={id}>
                <Dot color={color} />
                <span>{summary}</span>
                <CalendarStatus
                  id={id}
                  publicId={publicId}
                  isSharing={share.isLoading}
                  sharingId={share.context}
                  onShare={share.mutate}
                />
              </Line>
            ))}
          </List>
        </Fragment>
      )}
    </Page>
  );
}
