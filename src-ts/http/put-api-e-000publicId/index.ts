import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { parseJsonBody } from "@architect/shared/body-parser";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { EventPayload, updateEvent } from "@architect/shared/google/calendar";
import { getShacalEvent } from "@architect/shared/shacal-events";
import { updateMyEvent, User } from "@architect/shared/user/storage";
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
      const jsonResult = parseJsonBody(req);
      if (!jsonResult.success) {
        return { statusCode: 400, body: JSON.stringify(jsonResult) };
      }

      const payloadResult = EventPayload.validate(jsonResult.value);
      if (!payloadResult.success) {
        return { statusCode: 400, body: JSON.stringify(payloadResult) };
      }

      const publicId = req.pathParameters?.publicId ?? "-";
      const shacalEvent = await getShacalEvent(publicId);
      if (shacalEvent == null) {
        return { statusCode: 404 };
      }

      if (
        user.userId !== shacalEvent.userId &&
        user.userId !== shacalEvent.shacalUserId
      ) {
        return { statusCode: 403 };
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
      const insertResult = await updateEvent(
        shacalEvent.googleCalendarId,
        shacalEvent.googleEventId,
        payloadResult.value
      );

      if (!insertResult.success) {
        return { statusCode: 400, body: JSON.stringify(insertResult) };
      }
      const rawEvent = insertResult.value;
      const event = {
        publicId,
        owned: true,
        summary: rawEvent.summary,
        description: rawEvent.description,
        start: rawEvent.start,
        end: rawEvent.end,
        location: rawEvent.location,
        attendees: rawEvent.attendees,
      };

      await updateMyEvent(user, event);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          value: event,
        }),
      };
    }
  )
);
