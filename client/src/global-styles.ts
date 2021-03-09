import { css } from "@emotion/react";
import { COLOR_VARS, FONT_SIZE_VARS, FONT_WEIGHT_VARS } from "@shacal/ui/kit";

export function getGlobalStyles() {
  return css`
    :root {
      ${COLOR_VARS}
      ${FONT_SIZE_VARS}
      ${FONT_WEIGHT_VARS}
      font-family: "Inter", sans-serif;
      font-size: 10px;
    }
    body {
      font-size: var(--fs-m);
      font-weight: var(--fw-default);
      color: var(--fg-p);
      margin: 0;
    }
    button {
      font-size: inherit;
    }
    a[disabled] {
      pointer-events: none;
    }
  `;
}
