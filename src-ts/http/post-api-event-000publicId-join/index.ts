import * as R from "runtypes";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import { withConfirmedEmails } from "@architect/shared/confirmed-emails";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { addAttendee, getEvent } from "@architect/shared/google/calendar";
import { getShacalEvent } from "@architect/shared/shacal-events";
import {
  getConfirmedEmailsCookieName,
  getJWTSecret,
} from "@architect/shared/utils";
import { parseJsonBody } from "@architect/shared/body-parser";

const JoinEventPayload = R.Record({
  email: R.String,
});

export const handler = withBaseUrl(
  withConfirmedEmails(
    getConfirmedEmailsCookieName(),
    getJWTSecret(),
    async (
      req: HttpFunctionRequest,
      confirmedEmails: string[],
      baseUrl: string
    ): Promise<HttpFunctionResponse> => {
      const jsonResult = parseJsonBody(req.body);
      if (!jsonResult.success) {
        return { statusCode: 400, body: JSON.stringify(jsonResult) };
      }

      const payloadResult = JoinEventPayload.validate(jsonResult.value);
      if (!payloadResult.success) {
        return { statusCode: 400, body: JSON.stringify(payloadResult) };
      }

      const email = payloadResult.value.email.toLocaleLowerCase();
      if (!confirmedEmails.includes(email)) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            success: false,
            message: `Email ${email} is not in the confirmed emails list`,
          }),
        };
      }

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
        return { statusCode: 500, body: JSON.stringify({ authResult }) };
      }

      const result = await addAttendee(
        shacalEvent.googleCalendarId,
        shacalEvent.googleEventId,
        email
      );

      return {
        statusCode: result.success ? 200 : 400,
        body: JSON.stringify(result),
      };
    }
  )
);
