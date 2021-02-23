import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
} from "@architect/shared/begin";
import { deleteShacal } from "@architect/shared/shacal";
import { updateUser, User } from "@architect/shared/user/storage";
import { getJWTCookieName, getJWTSecret } from "@architect/shared/utils";

export const handler = withUser(
  getJWTCookieName(),
  getJWTSecret(),
  async (
    req: HttpFunctionRequest,
    user: User
  ): Promise<HttpFunctionResponse> => {
    const googleCalendarId = req.pathParameters?.gid ?? "-";
    if (!(googleCalendarId in user.sharedCalendars)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    await deleteShacal(user.sharedCalendars[googleCalendarId]!);

    delete user.sharedCalendars[googleCalendarId];
    await updateUser(user);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  }
);
