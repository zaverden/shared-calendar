import styled from "@emotion/styled";
import React, { Fragment } from "react";

const Footer = styled.footer`
  display: flex;
  justify-content: space-evenly;
  width: 310px;
  position: fixed;
  bottom: 0;
  padding: 10px 0;
  background: var(--bg-m);
`;

const FooterPlaceholder = styled(Footer)`
  position: relative;
  opacity: 0;
  margin-top: 10px;
`;

const Anchor = styled.a`
  color: var(--fg-a);
  margin: 0 0.5em;
`;

export function AppFooter() {
  return (
    <Fragment>
      <FooterPlaceholder>
        <Anchor href="/privacy-policy.html">Policy</Anchor>
        <Anchor href="/about-project.html">About</Anchor>
        <Anchor href="/credits.html">Credits</Anchor>
      </FooterPlaceholder>
      <Footer>
        <Anchor href="/privacy-policy.html">Policy</Anchor>
        <Anchor href="/about-project.html">About</Anchor>
        <Anchor href="/credits.html">Credits</Anchor>
      </Footer>
    </Fragment>
  );
}
