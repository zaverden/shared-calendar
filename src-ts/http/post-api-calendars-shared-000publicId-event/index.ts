import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { EventPayload, insertEvent } from "@architect/shared/google/calendar";
import { ensureEvents } from "@architect/shared/shacal-events";
import { User } from "@architect/shared/user/storage";
import {
  emailMatch,
  getJWTCookieName,
  getJWTSecret,
} from "@architect/shared/utils";
import { parseJsonBody } from "@architect/shared/body-parser";
import { getShacal } from "@architect/shared/shacal";

export const handler = withBaseUrl(
  withUser(
    getJWTCookieName(),
    getJWTSecret(),
    async (
      req: HttpFunctionRequest,
      user: User,
      baseUrl: string
    ): Promise<HttpFunctionResponse> => {
      const jsonResult = parseJsonBody(req.body);
      if (!jsonResult.success) {
        return { statusCode: 400, body: JSON.stringify(jsonResult) };
      }

      const payloadResult = EventPayload.validate(jsonResult.value);
      if (!payloadResult.success) {
        return { statusCode: 400, body: JSON.stringify(payloadResult) };
      }

      const shacalPublicId = req.pathParameters?.publicId ?? "-";
      const shacal = await getShacal(shacalPublicId);
      if (shacal == null) {
        return { statusCode: 404 };
      }

      if (
        user.userId !== shacal.userId &&
        !emailMatch(user.email, shacal.addPermissionGrantedTo)
      ) {
        return { statusCode: 403 };
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

      const insertResult = await insertEvent(
        shacal.googleCalendarId,
        payloadResult.value
      );

      if (!insertResult.success) {
        return { statusCode: 400, body: JSON.stringify(insertResult) };
      }

      const ensuredEvents = await ensureEvents(
        [insertResult.value],
        shacal,
        user.userId,
        user.userId
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          value: ensuredEvents[0],
        }),
      };
    }
  )
);
