import { HttpFunctionResponse } from "@architect/shared/begin";
import { withOptionalUser } from "../auth";
import { getJWTCookieName, getJWTSecret } from "../utils";

export const handler = withOptionalUser(
  getJWTCookieName(),
  getJWTSecret(),
  async (_, user): Promise<HttpFunctionResponse> => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: user != null,
        userEmail: user?.email,
      }),
    };
  }
);
