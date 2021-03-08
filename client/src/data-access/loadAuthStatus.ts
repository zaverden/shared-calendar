import { tryGetJsonMessage } from "utils";

export async function loadAuthStatus(): Promise<boolean> {
  const res = await fetch("/auth/status/_");
  if (res.status === 200) {
    const json = await res.json();
    return json.authenticated;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
