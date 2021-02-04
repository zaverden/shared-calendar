import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getOAuth2Client } from "@architect/shared/oAuth2Client";

export const handler = withBaseUrl(
  async (
    req: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const { code } = req.queryStringParameters ?? {};

    if (code === undefined) {
      return redirect("/auth/error");
    }

    const oAuth2Client = getOAuth2Client(baseUrl);
    const { tokens } = await oAuth2Client.getToken(code);

    return {
      statusCode: 200,
      body: JSON.stringify(tokens),
    };
  }
);
