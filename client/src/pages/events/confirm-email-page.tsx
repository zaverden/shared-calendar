import styled from "@emotion/styled";
import { Page } from "@shacal/ui/components";
import { useAuthorizeEmail, usePublicIdParam } from "@shacal/ui/hooks";
import { Button, H1, Input } from "@shacal/ui/kit";
import React, { FormEvent, useState } from "react";

const ConfirmForm = styled.form`
  & > * {
    margin-top: 1em;
  }
`;

const Accent = styled.span`
  color: var(--fg-a);
`;

const Success = styled.p`
  border: 1px solid var(--bg-p);
  border-radius: 4px;
  padding: 1em;
  box-shadow: inset 0px 0px 2em -1em var(--bg-p);
`;

export function ConfirmEmailPage() {
  const [email, setEmail] = useState(
    localStorage.getItem("lastConfirmedEmail") ?? ""
  );
  const publicId = usePublicIdParam();
  const auth = useAuthorizeEmail();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("lastConfirmedEmail", email);
    auth.mutate({
      email,
      returnUrl: `/event/${publicId}`,
    });
  };
  return (
    <Page title="Confirm email" loading={false}>
      {() => (
        <main>
          <H1>Confirm your email</H1>
          <p>
            In order to join an event with an email you have to confirm you own
            the email address first.
          </p>
          <p>
            Shacal does not store your confirmed email address in any database.
            The confirmed emails are stored in your browser's cookies.
          </p>
          {auth.error != null ? <p>{auth.error.message}</p> : null}
          {auth.isSuccess ? (
            <Success>
              Email has been sent to <Accent>{email}</Accent>.<br />
              It may appear in the <Accent>SPAM</Accent> folder.
            </Success>
          ) : (
            <ConfirmForm onSubmit={onSubmit}>
              <Input
                type="email"
                disabled={auth.isLoading}
                required
                name="email"
                onChange={(e) => setEmail(e.currentTarget.value)}
                value={email}
                placeholder="Enter your email"
              />
              <Button disabled={auth.isLoading} type="submit">
                Send confirmation link
              </Button>
            </ConfirmForm>
          )}
        </main>
      )}
    </Page>
  );
}
