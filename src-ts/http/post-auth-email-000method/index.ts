import * as R from "runtypes";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "@architect/shared/begin";
import {
  buildConfirmedEmailsToken,
  withConfirmedEmails,
} from "@architect/shared/confirmed-emails";
import { authorizeGoogleApi } from "@architect/shared/google/auth";
import { getAuthClient } from "@architect/shared/google/auth-client";
import { addAttendee, getEvent } from "@architect/shared/google/calendar";
import { getShacalEvent } from "@architect/shared/shacal-events";
import {
  getConfirmedEmailsCookieName,
  getJWTSecret,
  sanitizeReturnUrl,
} from "@architect/shared/utils";
import { parseJsonBody } from "@architect/shared/body-parser";
import { URL } from "url";

const AuthEmailPayload = R.Record({
  email: R.String,
  returnUrl: R.String,
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
      const jsonResult = parseJsonBody(req);
      if (!jsonResult.success) {
        return { statusCode: 400, body: JSON.stringify(jsonResult) };
      }

      const payloadResult = AuthEmailPayload.validate(jsonResult.value);
      if (!payloadResult.success) {
        return { statusCode: 400, body: JSON.stringify(payloadResult) };
      }

      const email = payloadResult.value.email.toLocaleLowerCase();
      if (confirmedEmails.includes(email)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: `Email ${email} is already in the confirmed emails list`,
          }),
        };
      }

      const returnUrl = payloadResult.value.returnUrl;
      if (returnUrl !== sanitizeReturnUrl(returnUrl)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: `returnUrl allows only relative paths`,
          }),
        };
      }

      const emailToken = buildConfirmedEmailsToken([email], getJWTSecret());

      const url = new URL("/auth/email/callback", baseUrl);
      url.searchParams.append("t", emailToken);
      url.searchParams.append("r", sanitizeReturnUrl(returnUrl));

      console.log({ url: url.toString() });

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }
  )
);
