import { HttpFunctionResponse } from "@architect/shared/begin";
import { withOptionalUser } from "../auth";
import { updateUser, User } from "../user/storage";
import { getJWTCookieName, getJWTSecret } from "../utils";

async function invalidateMyEvents(user: User): Promise<void> {
  let hasExpired = false;
  const myEvents = user.myEvents ?? {};
  const now = new Date();
  for (const event of Object.values(myEvents)) {
    const end = new Date(event.end);
    if (end < now) {
      delete myEvents[event.publicId];
      hasExpired = true;
    }
  }

  if (hasExpired) {
    await updateUser(user);
  }
}

export const handler = withOptionalUser(
  getJWTCookieName(),
  getJWTSecret(),
  async (_, user): Promise<HttpFunctionResponse> => {
    if (user) {
      await invalidateMyEvents(user);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        authenticated: user != null,
        userEmail: user?.email,
        myEvents: user == null ? undefined : Object.values(user.myEvents ?? {}),
      }),
    };
  }
);
