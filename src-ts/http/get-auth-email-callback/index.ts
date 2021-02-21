import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
} from "@architect/shared/begin";
import {
  buildConfirmedEmailsCookie,
  extractConfirmedEmailsFromJWT,
  withConfirmedEmails,
} from "@architect/shared/confirmed-emails";
import {
  getConfirmedEmailsCookieName,
  getJWTSecret,
  sanitizeReturnUrl,
} from "@architect/shared/utils";

export const handler = withConfirmedEmails(
  getConfirmedEmailsCookieName(),
  getJWTSecret(),
  async (
    req: HttpFunctionRequest,
    confirmedEmails: string[]
  ): Promise<HttpFunctionResponse> => {
    const { t: token, r: returnUrl } = req.queryStringParameters ?? {};

    const updatedEmailsSet = new Set([
      ...extractConfirmedEmailsFromJWT(token ?? "", getJWTSecret()),
      ...confirmedEmails,
    ]);

    return redirect(sanitizeReturnUrl(returnUrl), {
      cookies: [
        buildConfirmedEmailsCookie(
          [...updatedEmailsSet],
          getConfirmedEmailsCookieName(),
          getJWTSecret()
        ),
      ],
    });
  }
);
