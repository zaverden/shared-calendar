import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const RippleAnimation = keyframes`
  0% {
    border-width: 1px;
    width: 0;
    height: 0;
    margin-top: 50%;
    margin-left: 50%;
    opacity: 1;
  }
  100% {
    border-width: 5px;
    width: 100%;
    height: 100%;
    margin-top: 0;
    margin-left: 0;
    opacity: 0;
  }
`;

const Loader = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding-bottom: 100%;
  position: relative;

  & div {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    border: 1px solid var(--bg-p);
    opacity: 1;
    border-radius: 50%;
    animation: ${RippleAnimation} 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  & div:nth-child(2) {
    animation-delay: -1.2s;
  }
`;

export function AppLoader({ className }: { className?: string }) {
  return (
    <Loader className={className}>
      <div />
      <div />
    </Loader>
  );
}
