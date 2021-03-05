import styled from "@emotion/styled";
import { useJoinEvent } from "@shacal/ui/hooks";
import { Button } from "@shacal/ui/kit";
import React, { Fragment } from "react";
import { getEmails } from "utils";

const emails = getEmails();

const JoinButton = styled(Button)`
  margin: 8px;

  & > span {
    font-weight: var(--fw-th);
  }
`;

export function JoinEvent({ publicId }: { publicId: string }) {
  const join = useJoinEvent();
  return (
    <Fragment>
      {join.isError ? <p>{join.error?.message}</p> : null}
      {join.isSuccess ? (
        <p>You have successfully joined</p>
      ) : (
        emails.map((email, i) => (
          <JoinButton
            key={i}
            type="button"
            onClick={() => join.mutate({ publicId, email })}
            disabled={join.isLoading}
          >
            <span>Join as</span> {email}
          </JoinButton>
        ))
      )}
    </Fragment>
  );
}
