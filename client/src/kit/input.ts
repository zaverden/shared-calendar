import styled from "@emotion/styled";

export const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid var(--br-p);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;
  margin-top: 5px;
  font-size: 14px;
  background: transparent;

  &::placeholder {
    color: var(--fg-placeholder);
  }

  &[disabled] {
    color: var(--fg-m);
  }
`;

