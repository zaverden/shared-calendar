import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  redirect,
  withBaseUrl,
} from "@architect/shared/begin";
import { getAuthClient } from "@architect/shared/google/auth-client";

export const handler = withBaseUrl(
  async (
    req: HttpFunctionRequest,
    baseUrl: string
  ): Promise<HttpFunctionResponse> => {
    const { code } = req.queryStringParameters ?? {};

    if (code === undefined) {
      return redirect("/auth/error");
    }

    const oAuth2Client = getAuthClient(baseUrl);
    const { tokens } = await oAuth2Client.getToken(code);
    const tokenInfo = await oAuth2Client.getTokenInfo(
      tokens.access_token ?? ""
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ tokenInfo, tokens }),
    };
  }
);
