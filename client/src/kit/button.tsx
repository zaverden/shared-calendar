import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { bg } from "./colors";

const filteredProps: Set<string> = new Set<keyof ButtonProps>([
  "medium",
  "secondary",
]);

export type ButtonProps = {
  secondary?: boolean;
  medium?: boolean;
  disabled?: boolean;
};

export const Button = styled("button", {
  shouldForwardProp: (propName) =>
    typeof propName !== "string" || !filteredProps.has(propName),
})<ButtonProps>`
  display: inline-block;
  box-sizing: border-box;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-weight: var(--fw-b);
  background-color: ${({ secondary }) => bg(secondary)};
  padding: ${({ medium: medium }) => (medium ? "8px" : "10px")};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.5)};
`;

export const LinkButton = Button.withComponent(Link);
export const AnchorButton = Button.withComponent("a");
