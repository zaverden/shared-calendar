import React from "react";
import { useEncodedReturnUrl } from "@shacal/ui/hooks";
import { AnchorButton, H1 } from "@shacal/ui/kit";
import styled from "@emotion/styled";

const GoogleIcon = styled.img`
  height: 1em;
  width: 1em;
  background: var(--bg-m);
  padding: 2px;
  border-radius: 100%;
`;

const AuthPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export function AuthPage() {
  const returnUrl = useEncodedReturnUrl();
  const authUrl = `/auth/google/_?r=${returnUrl}`;
  return (
    <AuthPanel>
      <H1>Welcome!</H1>
      <AnchorButton href={authUrl}>
        <GoogleIcon src="/google-icon.svg" alt="" />
        Start with google
      </AnchorButton>

      <p>Shacal uses cookies for authorization.</p>
    </AuthPanel>
  );
}
