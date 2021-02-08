import { sign, verify } from "jsonwebtoken";
import { Result } from "./result";
import { Dictionary } from "./ts-utils";

export function getJWT(userId: string, secret: string): string {
  const jwt = sign({ userId }, secret, {
    expiresIn: "1d",
  });
  if (jwt == null) {
    throw new Error("Empty JWT is generated");
  }
  return jwt;
}

export function resolveJWT(jwt: string, secret: string): Result<string> {
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

export function buildJWTCookie(jwt: string, cookie: string): string {
  const secure = process.env.NODE_ENV === "testing" ? "" : "Secure;";
  return `${cookie}=${jwt};${secure}HttpOnly;`;
}
