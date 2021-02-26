import { Page } from "@shacal/ui/components";
import { useCalendarsList } from "@shacal/ui/hooks";
import { useShareCalendar } from "hooks/useShareCalendar";
import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";

function Dot({ color }: { color: string }) {
  return <span style={{ color }}>&#11044;</span>;
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
    return <Link to={`/calendar/${publicId}`}>Go</Link>;
  }
  if (isSharing && id === sharingId) {
    return <span>SHARING...</span>;
  }
  return (
    <button onClick={() => onShare(id)} disabled={isSharing}>
      Share
    </button>
  );
}

export function CalendarsListPage() {
  const { isLoading, error, data: calendars } = useCalendarsList();
  const share = useShareCalendar();
  return (
    <Page title="Google Calendars" loading={isLoading} showAuth={error?.message === "401"}>
      {() => (
        <Fragment>
          {share.isSuccess ? <Redirect to={`/calendar/${share.data}`} /> : null}
          <ul>
            {calendars?.map(({ id, summary, color, publicId }) => (
              <li key={id}>
                <Dot color={color} />
                {summary}
                <CalendarStatus
                  id={id}
                  publicId={publicId}
                  isSharing={share.isLoading}
                  sharingId={share.context}
                  onShare={share.mutate}
                />
              </li>
            ))}
          </ul>
        </Fragment>
      )}
    </Page>
  );
}