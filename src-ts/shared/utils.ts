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