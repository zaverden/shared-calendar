import { withOptionalUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { getFollowingEvents } from "@architect/shared/google/calendar";
import { getShacal } from "@architect/shared/shacal";
import { ensureEvents } from "@architect/shared/shacal-events";
import { User } from "@architect/shared/user/storage";
import {
  emailMatch,
  getJWTCookieName,
  getJWTSecret,
} from "@architect/shared/utils";

export const handler = withBaseUrl(
  withOptionalUser(
    getJWTCookieName(),
    getJWTSecret(),
    async (
      req: HttpFunctionRequest,
      user: User | null,
      baseUrl: string
    ): Promise<HttpFunctionResponse> => {
      const publicId = req.pathParameters?.publicId ?? "-";
      const shacal = await getShacal(publicId);

      if (shacal == null) {
        return { statusCode: 404 };
      }

      const authResult = await authorizeGoogleApi(
        getAuthClient(baseUrl),
        shacal.googleAccountId
      );
      if (authResult.success === false) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            authResult,
          }),
        };
      }
      const isShacalOwner = shacal.userId === user?.userId;
      const rawEvents = await getFollowingEvents(shacal.googleCalendarId);
      const ensuredEvents = await ensureEvents(
        rawEvents,
        shacal,
        user?.userId ?? null
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          events: ensuredEvents,
          owned: isShacalOwner,
          canAdd:
            isShacalOwner ||
            emailMatch(user?.email ?? "", shacal.addPermissionGrantedTo),
          addPermissionGrantedTo: isShacalOwner
            ? shacal.addPermissionGrantedTo
            : undefined,
        }),
      };
    }
  )
);
