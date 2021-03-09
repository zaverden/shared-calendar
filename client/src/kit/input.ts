import styled from "@emotion/styled";

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--br-p);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 1em;

  &::placeholder {
    color: var(--fg-placeholder);
  }

  &[disabled] {
    color: var(--fg-m);
  }
`;

