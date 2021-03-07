import { sign, verify } from "jsonwebtoken";
import * as R from "runtypes";
import { HttpFunctionRequest, WrappedHandler } from "./begin";
import { Dictionary } from "./ts-utils";
import { formatCookie, getCookieValue } from "./utils";

const EmailsTokenPayload = R.Record({
  emails: R.Array(R.String),
});

function getJWTFromHeader(headers: Dictionary<string>): string | null {
  return headers["x-email"] ?? headers["X-Email"] ?? headers["X-email"] ?? null;
}

export function extractConfirmedEmailsFromJWT(
  jwt: string,
  secret: string
): string[] {
  try {
    const payload = verify(jwt, secret);
    const result = EmailsTokenPayload.validate(payload);
    return result.success ? result.value.emails : [];
  } catch (_) {
    return [];
  }
}

function extractConfirmedEmails(
  confirmedEmailsCookieName: string,
  confirmedEmailsSecret: string,
  req: HttpFunctionRequest
): string[] {
  const jwt =
    getCookieValue(req.cookies ?? [], confirmedEmailsCookieName) ??
    getJWTFromHeader(req.headers ?? {});
  if (jwt == null) {
    return [];
  }
  const emails = extractConfirmedEmailsFromJWT(jwt, confirmedEmailsSecret);
  return emails;
}

export function withConfirmedEmails<T extends unknown[]>(
  jwtCookieName: string,
  jwtSecret: string,
  handler: WrappedHandler<[string[], ...T]>
): WrappedHandler<T> {
  return async (req, ...rest) => {
    const emails = await extractConfirmedEmails(jwtCookieName, jwtSecret, req);
    return handler(req, emails, ...rest);
  };
}

export function buildConfirmedEmailsToken(
  emails: string[],
  secret: string
): string {
  const emailsSet = new Set(emails.map((email) => email.toLowerCase()));
  const jwt = sign({ emails: [...emailsSet] }, secret, { expiresIn: "1y" });
  if (jwt == null) {
    throw new Error("Empty JWT is generated");
  }
  return jwt;
}

const cookieAge = 365 * 24 * 60 * 60;
export function buildConfirmedEmailsCookie(
  emails: string[],
  cookieName: string,
  secret: string
): string {
  const token = buildConfirmedEmailsToken(emails, secret);
  return formatCookie({
    name: cookieName,
    value: token,
    maxAgeSeconds: cookieAge,
    secure: process.env.NODE_ENV !== "testing",
    httpOnly: false,
  });
}
