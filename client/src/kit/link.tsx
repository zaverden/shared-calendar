import styled from "@emotion/styled";
import { Link as RouterLink } from "react-router-dom";

export const Anchor = styled("a")`
  color: var(--fg-a);
  font-weight: var(--fw-b);
  font-size: var(--fs-m);
  text-decoration: none;
  display: inline-block;
  padding: 0 0 11px;
  transition: 0.3s;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const Link = Anchor.withComponent(RouterLink);