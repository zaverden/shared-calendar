import {
  getBaseUrl,
  HttpFunctionRequest,
  HttpFunctionResponse,
} from "@architect/shared/begin";
import { getOAuth2Client } from "@architect/shared/oAuth2Client";

export async function handler(
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> {
  const { code } = req.queryStringParameters ?? {};

  if (code === undefined) {
    return {
      statusCode: 302,
      headers: {
        Location: "/auth/error",
      },
    };
  }

  const oAuth2Client = getOAuth2Client(getBaseUrl(req));
  const { tokens } = await oAuth2Client.getToken(code);

  return {
    statusCode: 200,
    body: JSON.stringify(tokens),
  };
}
