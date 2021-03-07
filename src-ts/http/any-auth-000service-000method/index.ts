import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  WrappedHandler,
} from "@architect/shared/begin";
import { handler as googleHandler } from "@architect/shared/handlers/auth-google";
import { handler as emailHandler } from "@architect/shared/handlers/auth-email";
import { handler as googleCallbackHandler } from "@architect/shared/handlers/auth-google-callback";
import { handler as emailCallbackHandler } from "@architect/shared/handlers/auth-email-callback";
import { handler as logoutHandler } from "@architect/shared/handlers/auth-logout";
import { handler as removeAllHandler } from "@architect/shared/handlers/remove-all-data";
import { Dictionary } from "@architect/shared/ts-utils";
import { getRemoveAllToken } from "@architect/shared/utils";

const mapAuth = {
  google: googleHandler,
  email: emailHandler,
  logout: logoutHandler,
} as Dictionary<WrappedHandler<[]>>;

const mapCallback = {
  google: googleCallbackHandler,
  email: emailCallbackHandler,
} as Dictionary<WrappedHandler<[]>>;

const mapMethod = {
  _: mapAuth,
  callback: mapCallback,
} as Dictionary<Dictionary<WrappedHandler<[]>>>;

if (getRemoveAllToken() !== "") {
  mapMethod.remove = {
    [getRemoveAllToken()]: removeAllHandler,
  };
}

export const handler = async (
  req: HttpFunctionRequest
): Promise<HttpFunctionResponse> => {
  const service = req.pathParameters?.service ?? "-";
  const method = req.pathParameters?.method ?? "-";
  const h = mapMethod[method]?.[service];
  if (h == null) {
    console.log(404, req);
    return { statusCode: 404 };
  }
  return h(req);
};
