export const COLOR_VARS = `
  --fg-p: #202020;
  --fg-a: #72B3AC;
  --fg-m: #8D8D8D;
  --fg-b: #2E7CF6;
  --fg-placeholder: #BABABA;
  --bg-p: #00AA98;
  --bg-s: #515151;
  --bg-m: #FFFFFF;
  --br-p: #C4C4C4;
`;

export function bg(secondary: boolean | undefined): string {
  return secondary ? "var(--bg-s)" : "var(--bg-p)";
}
