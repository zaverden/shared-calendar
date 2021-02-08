import { withOptionalUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
} from "@architect/shared/begin";
import { User } from "@architect/shared/user/storage";
import { getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

export const handler = withOptionalUser(
  getJWTCookieName(),
  getJWTSecret(),
  async (
    req: HttpFunctionRequest,
    user: User | null
  ): Promise<HttpFunctionResponse> => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        req,
        user,
        env: {
          QQQ: process.env.QQQ,
        },
      }),
    };
  }
);
