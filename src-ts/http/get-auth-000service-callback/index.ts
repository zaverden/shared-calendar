import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  WrappedHandler,
} from "@architect/shared/begin";
import { handler as googleHandler } from "@architect/shared/handlers/auth-google-callback";
import { handler as emailHandler } from "@architect/shared/handlers/auth-email-callback";
import { Dictionary } from "@architect/shared/ts-utils";

const map = {
  google: googleHandler,
  email: emailHandler,
} as Dictionary<WrappedHandler<[]>>;

export const handler = async (
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> => {
  const h = map[req.pathParameters?.service ?? "_"];
  if (h == null) {
    return { statusCode: 404 };
  }
  return h(req);
};
