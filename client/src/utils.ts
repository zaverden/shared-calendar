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