import styled from "@emotion/styled";

export const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid var(--br-p);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 1em;
  font-size: var(--fs-m);
  background: transparent;

  &::placeholder {
    color: var(--fg-placeholder);
  }

  &[disabled] {
    color: var(--fg-m);
  }
`;

