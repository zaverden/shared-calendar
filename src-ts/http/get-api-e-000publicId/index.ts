import { withOptionalUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { getEvent } from "@architect/shared/google/calendar";
import { getShacalEvent } from "@architect/shared/shacal-events";
import { User } from "@architect/shared/user/storage";
import { getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

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
      const shacalEvent = await getShacalEvent(publicId);

      if (shacalEvent == null) {
        return { statusCode: 404 };
      }

      const authResult = await authorizeGoogleApi(
        getAuthClient(baseUrl),
        shacalEvent.googleAccountId
      );
      if (authResult.success === false) {
        console.log(500, authResult);
        return {
          statusCode: 500,
          body: JSON.stringify({
            authResult,
          }),
        };
      }
      const rawEvent = await getEvent(
        shacalEvent.googleCalendarId,
        shacalEvent.googleEventId
      );

      if (rawEvent == null) {
        return { statusCode: 404 };
      }

      const owned =
        shacalEvent.shacalUserId === user?.userId ||
        shacalEvent.userId === user?.userId;

      const event = {
        publicId,
        owned,
        summary: rawEvent.summary,
        description: rawEvent.description,
        start: rawEvent.start,
        end: rawEvent.end,
        location: rawEvent.location,
        attendees: owned ? rawEvent.attendees : undefined,
      };

      return {
        statusCode: 200,
        body: JSON.stringify(event),
      };
    }
  )
);
