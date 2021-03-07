import styled from "@emotion/styled";
import { useJoinEvent } from "@shacal/ui/hooks";
import { Button, LinkButton } from "@shacal/ui/kit";
import React, { Fragment } from "react";
import { getEmails } from "utils";

const emails = getEmails();

const JoinButton = styled(Button)`
  margin: 8px 0;

  & > span {
    font-weight: var(--fw-th);
  }
`;

const ConfirmEmailLinkButton = styled(LinkButton)`
  margin: 8px 0;
`;

type Event = { publicId: string };

type ButtonsListProps = Event & {
  onJoin: (email: string) => void;
  isLoading: boolean;
};
function ButtonsList({ onJoin, isLoading, publicId }: ButtonsListProps) {
  return (
    <Fragment>
      {emails.map((email, i) => (
        <JoinButton
          key={i}
          type="button"
          onClick={() => onJoin(email)}
          disabled={isLoading}
        >
          <span>Join as</span> {email}
        </JoinButton>
      ))}
      <ConfirmEmailPanel publicId={publicId} />
    </Fragment>
  );
}

function ConfirmEmailPanel({ publicId }: Event) {
  const message =
    emails.length === 0
      ? "You have to confirm your email in order to join the event."
      : "You can confirm another email.";
  return (
    <Fragment>
      <p>{message}</p>
      <ConfirmEmailLinkButton
        secondary={emails.length > 0}
        to={`/event/${publicId}/confirm-email`}
      >
        Confirm email
      </ConfirmEmailLinkButton>
    </Fragment>
  );
}

export function JoinEvent({ publicId }: Event) {
  const join = useJoinEvent();
  return (
    <Fragment>
      {join.isError ? <p>{join.error?.message}</p> : null}
      {join.isSuccess ? (
        <p>You have successfully joined</p>
      ) : (
        <ButtonsList
          publicId={publicId}
          isLoading={join.isLoading}
          onJoin={(email) => join.mutate({ publicId, email })}
        />
      )}
    </Fragment>
  );
}
