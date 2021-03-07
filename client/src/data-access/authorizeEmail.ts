import { tryGetJsonMessage } from "utils";

export type AuthorizeEmailParams = {
  email: string;
  returnUrl: string;
};
export async function authorizeEmail(
  params: AuthorizeEmailParams
): Promise<void> {
  const res = await fetch(`/auth/email/_`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  if (res.status === 200) {
    return;
  }
  throw new Error(
    res.status === 400
      ? tryGetJsonMessage(await res.text())
      : res.status.toString()
  );
}
