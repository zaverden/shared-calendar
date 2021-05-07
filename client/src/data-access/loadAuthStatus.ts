import { tryGetJsonMessage } from "utils";

export type AuthStatus = {
  authenticated: boolean;
  userEmail: string;
};
export async function loadAuthStatus(): Promise<AuthStatus> {
  const res = await fetch("/auth/status/_");
  if (res.status === 200) {
    const json = await res.json();
    return json;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
