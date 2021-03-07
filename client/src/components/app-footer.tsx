import styled from "@emotion/styled";
import React from "react";

const Footer = styled.footer`
  display: flex;
  justify-content: space-evenly;
  width: 310px;
  position: fixed;
  bottom: 0;
  padding: 10px 0;
`;

const Anchor = styled.a`
  color: var(--fg-a);
  margin: 0 0.5em;
`;

export function AppFooter() {
  return (
    <Footer>
      <Anchor href="/privacy-policy.html">Policy</Anchor>
      <Anchor href="/about-project.html">About</Anchor>
    </Footer>
  );
}
