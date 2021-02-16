import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { getCalendarsList } from "@architect/shared/google/calendar";
import { User } from "@architect/shared/user/storage";
import { getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

export const handler = withBaseUrl(
  withUser(
    getJWTCookieName(),
    getJWTSecret(),
    async (
      req: HttpFunctionRequest,
      user: User,
      baseUrl: string
    ): Promise<HttpFunctionResponse> => {
      const authResult = await authorizeGoogleApi(
        getAuthClient(baseUrl),
        user.googleAccountId
      );
      if (authResult.success === false) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            authResult,
          }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          user,
          list: await getCalendarsList(),
        }),
      };
    }
  )
);
