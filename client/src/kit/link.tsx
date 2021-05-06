import styled from "@emotion/styled";
import { Link as RouterLink } from "react-router-dom";

export const Anchor = styled("a")`
  color: var(--fg-a);
`;

export const Link = Anchor.withComponent(RouterLink);
