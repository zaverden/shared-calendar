import styled from "@emotion/styled";
import React, { Fragment } from "react";

const Logo = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 60%;
  height: auto;
`;

const Slogan = styled.p`
  display: block;
  margin: 0 auto;
  width: fit-content;
  font-size: var(--fs-s);
  line-height: 2em;

  & > span {
    color: var(--fg-a);
    font-weight: var(--fw-b);
  }
`;

export function AppHeader() {
  return (
    <Fragment>
      <Logo src="/shacal_logo.svg" width="358" height="104" alt="Shacal logo" />
      <Slogan>
        Your <span>SHA</span>red <span>CAL</span>endar
      </Slogan>
    </Fragment>
  );
}
