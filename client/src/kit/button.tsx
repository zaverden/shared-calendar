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
  display: flex;
  justify-content: center;
  gap: 5px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: var(--fw-th);
  background-color: ${({ secondary }) => bg(secondary)};
  padding: ${({ medium: medium }) => (medium ? "8px" : "10px")};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.5)};
  transition: 0.3s;

  &:hover {
    box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
  }
`;

export const LinkButton = Button.withComponent(Link);
export const AnchorButton = Button.withComponent("a");
