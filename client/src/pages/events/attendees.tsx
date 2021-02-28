import { ShacalEventAttendee } from "@shacal/ui/data-access";
import React from "react";

const statusMap = {
  declined: "❌",
  tentative: "❔",
  accepted: "✔️",
};
type AttendeesProps = { attendees: ShacalEventAttendee[] | undefined };
export function Attendees({ attendees }: AttendeesProps) {
  if (attendees === undefined) {
    return null;
  }
  return (
    <details>
      <summary>Attendees</summary>
      {attendees.map(({ email, status }, i) => (
        <p key={i}>
          {statusMap[status]}&nbsp;{email}
        </p>
      ))}
      {attendees.length === 0 ? <p>No Attendees</p> : null}
    </details>
  );
}
