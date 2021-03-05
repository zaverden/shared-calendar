export const COLOR_VARS = `
  --fg-p: #202020;
  --fg-a: #72B3AC;
  --fg-m: #8D8D8D;
  --bg-p: #00AA98;
  --bg-s: #515151;
`;

export function bg(secondary: boolean | undefined): string {
  return secondary ? "var(--bg-s)" : "var(--bg-p)";
}
