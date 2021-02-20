export function getJWTSecret(): string {
  if (process.env.JWT_SECRET === undefined) {
    throw new Error("JWT_SECRET is not provided");
  }
  return process.env.JWT_SECRET;
}

export function getJWTCookieName(): string {
  return process.env.JWT_COOKIE ?? "auth";
}

const RND_LIMIT = 2 ** 32;
export function getId(): string {
  const datePart = Date.now().toString(16);
  const rnd = Math.floor(Math.random() * RND_LIMIT);
  const rndPart = rnd.toString(16).padStart(8, "0");
  return datePart + rndPart;
}

export function emailMatch(email: string, list: string[]): boolean {
  const lastAt = email.lastIndexOf("@");
  const domainName = email.substring(lastAt);
  return list.includes(email) || list.includes(domainName);
}

export function getTTL(date: Date): number {
  return Math.trunc(date.getTime() / 1000);
}

export function sanitizeReturnUrl(url: string | undefined | null): string {
  if (url == null) {
    return "/";
  }
  if (!url.startsWith("/")) {
    return "/";
  }
  return url;
}
