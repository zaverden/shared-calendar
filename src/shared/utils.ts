export function getJWTSecret(): Promise<string> {
  if (process.env.JWT_SECRET === undefined) {
    return Promise.reject(new Error("JWT_SECRET is not provided"));
  }
  return Promise.resolve(process.env.JWT_SECRET);
}

export function getJWTCookieName(): string {
  return process.env.JWT_COOKIE ?? "auth";
}
