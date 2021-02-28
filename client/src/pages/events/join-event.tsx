import { useJoinEvent } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { getEmails } from "utils";

const emails = getEmails();

export function JoinEvent({ publicId }: { publicId: string }) {
  const join = useJoinEvent();
  return (
    <Fragment>
      {join.isError ? <p>{join.error?.message}</p> : null}
      {join.isSuccess ? (
        <p>You have successfully joined</p>
      ) : (
        emails.map((email, i) => (
          <button
            key={i}
            type="button"
            onClick={() => join.mutate({ publicId, email })}
            disabled={join.isLoading}
          >
            Join as {email}
          </button>
        ))
      )}
    </Fragment>
  );
}
