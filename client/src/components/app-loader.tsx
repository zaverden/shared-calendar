import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const RippleAnimation = keyframes`
  0% {
    width: 0;
    height: 0;
    margin-top: 50%;
    margin-left: 50%;
    opacity: 1;
  }
  100% {
    width: 100%;
    height: 100%;
    margin-top: 0;
    margin-left: 0;
    opacity: 0;
  }
`;

const Loader = styled.div`
  width: 100%;
  padding-bottom: 100%;
  position: relative;

  & div {
    position: absolute;
    top: 0;
    bottom: 0;
    border: 4px solid var(--bg-p);
    opacity: 1;
    border-radius: 50%;
    animation: ${RippleAnimation} 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  & div:nth-child(2) {
    animation-delay: -0.8s;
  }

  & div:nth-child(3) {
    animation-delay: -1.6s;
  }
`;

export function AppLoader() {
  return (
    <Loader>
      <div />
      <div />
      <div />
    </Loader>
  );
}
