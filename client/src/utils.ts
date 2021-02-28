/** Represents key-value map with string keys */
export type Dictionary<T = unknown> = Record<string, T>;

export type FailureReason = "unknown" | "401";

export type Success<T> = {
  success: true;
  value: T;
};
export type Failure = {
  success: false;
  reason: FailureReason;
};
export type Result<T> = Success<T> | Failure;
export type AsyncResult<T> = Promise<Result<T>>;

export function tryGetJsonMessage(s: string) {
  try {
    const json = JSON.parse(s);
    return json.message;
  } catch (_) {
    return s;
  }
}

export function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const dateFormatter = new Intl.DateTimeFormat(["ru"], {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export const MS_IN_MINUTE = 60 * 1000;
export function getDuration({ start, end }: { start: string; end: string }) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return diff / MS_IN_MINUTE;
}

export function getCookieValue(
  cookies: string[],
  cookieName: string
): string | null {
  const prefix = `${cookieName}=`;
  const cookie = cookies.find((c) => c.startsWith(prefix));
  return cookie?.replace(prefix, "") ?? null;
}

export function getEmails(): string[] {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const emailsToken = getCookieValue(cookies, "emails") ?? "";
  const [_, payloadBase64, __] = emailsToken.split(".");
  try {
    const payload = JSON.parse(atob(payloadBase64 ?? ""));
    return payload.emails;
  } catch (_) {
    return [];
  }
}
