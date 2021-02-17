import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import {
  getCalendarsList,
  hasWritePermissionToCalendar,
} from "@architect/shared/google/calendar";
import { createShacal } from "@architect/shared/shacal";
import { updateUser, User } from "@architect/shared/user/storage";
import { getId, getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

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

      const googleCalendarId = req.pathParameters?.gid ?? "-";
      if (googleCalendarId in user.sharedCalendars) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            publicId: user.sharedCalendars[googleCalendarId],
          }),
        };
      }

      const hasWritePermission = await hasWritePermissionToCalendar(
        googleCalendarId
      );
      if (!hasWritePermission) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: "Account does not have write permissions for calendar",
          }),
        };
      }
      const { publicId } = await createShacal(user.userId, googleCalendarId);
      user.sharedCalendars[googleCalendarId] = publicId;
      await updateUser(user);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          publicId,
        }),
      };
    }
  )
);
