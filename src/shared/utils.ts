export function getJWTSecret(): string {
  if (process.env.JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET is not provided");
  }
  return process.env.JWT_SECRET;
}

export function getJWTCookieName(): string {
  return process.env.JWT_COOKIE ?? "auth";
}
