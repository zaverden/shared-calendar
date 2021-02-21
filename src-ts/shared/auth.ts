import { sign, verify } from "jsonwebtoken";
import { HttpFunctionRequest, unauthorized, WrappedHandler } from "./begin";
import { Result } from "./result";
import { Dictionary } from "./ts-utils";
import { getUser, User } from "./user/storage";
import { getCookieValue } from "./utils";

export function buildAuthToken(userId: string, secret: string): string {
  const jwt = sign({ userId }, secret, {
    expiresIn: "1d",
  });
  if (jwt == null) {
    throw new Error("Empty JWT is generated");
  }
  return jwt;
}

function resolveJWT(jwt: string, secret: string): Result<string> {
  try {
    const payload = verify(jwt, secret);
    if (typeof payload !== "object") {
      return {
        success: false,
        message: "Invalid JWT payload",
      };
    }
    const { userId } = payload as Dictionary;
    if (typeof userId !== "string") {
      return {
        success: false,
        message: "JWT does not include userId",
      };
    }
    return {
      success: true,
      value: userId,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

const authCookieAge = `Max-Age=${24 * 60 * 60}`;
export function buildAuthCookie(jwt: string, cookieName: string): string {
  const secure = process.env.NODE_ENV === "testing" ? "" : "Secure;";
  return `${cookieName}=${jwt};${authCookieAge};${secure}HttpOnly;Path=/`;
}

function getJWTFromHeader(headers: Dictionary<string>): string | null {
  return headers.authorization ?? headers.Authorization ?? null;
}

async function extractUser(
  jwtCookieName: string,
  jwtSecret: string,
  req: HttpFunctionRequest
): Promise<User | null> {
  const jwt =
    getCookieValue(req.cookies ?? [], jwtCookieName) ??
    getJWTFromHeader(req.headers ?? {});
  if (jwt == null) {
    return null;
  }
  const userIdResult = resolveJWT(jwt, jwtSecret);
  if (userIdResult.success === false) {
    return null;
  }
  return getUser(userIdResult.value);
}

export function withUser<T extends unknown[]>(
  jwtCookieName: string,
  jwtSecret: string,
  handler: WrappedHandler<[User, ...T]>
): WrappedHandler<T> {
  return async (req, ...rest) => {
    const user = await extractUser(jwtCookieName, jwtSecret, req);
    if (user == null) {
      return unauthorized();
    }
    return handler(req, user, ...rest);
  };
}

export function withOptionalUser<T extends unknown[]>(
  jwtCookieName: string,
  jwtSecret: string,
  handler: WrappedHandler<[User | null, ...T]>
): WrappedHandler<T> {
  return async (req, ...rest) => {
    const user = await extractUser(jwtCookieName, jwtSecret, req);
    return handler(req, user, ...rest);
  };
}
