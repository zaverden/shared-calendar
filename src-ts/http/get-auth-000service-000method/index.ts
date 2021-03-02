import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  WrappedHandler,
} from "@architect/shared/begin";
import { handler as googleHandler } from "@architect/shared/handlers/auth-google";
import { handler as googleCallbackHandler } from "@architect/shared/handlers/auth-google-callback";
import { handler as emailCallbackHandler } from "@architect/shared/handlers/auth-email-callback";
import { Dictionary } from "@architect/shared/ts-utils";

const mapAuth = {
  google: googleHandler,
} as Dictionary<WrappedHandler<[]>>;

const mapCallback = {
  google: googleCallbackHandler,
  email: emailCallbackHandler,
} as Dictionary<WrappedHandler<[]>>;

const mapMethod = {
  _: mapAuth,
  callback: mapCallback,
} as Dictionary<Dictionary<WrappedHandler<[]>>>;

export const handler = async (
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> => {
  const service = req.pathParameters?.service ?? "-";
  const method = req.pathParameters?.method ?? "-";
  const h = mapMethod[method]?.[service];
  if (h == null) {
    return { statusCode: 404 };
  }
  return h(req);
};