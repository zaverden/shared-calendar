import * as R from "runtypes";
import { withUser } from "@architect/shared/auth";
import {
  HttpFunctionRequest,
  HttpFunctionResponse,
} from "@architect/shared/begin";
import { getShacal, replaceShacal } from "@architect/shared/shacal";
import { User } from "@architect/shared/user/storage";
import {
  getJWTCookieName,
  getJWTSecret,
} from "@architect/shared/utils";
import { parseJsonBody } from "@architect/shared/body-parser";

const ChangePermissionsListPayload = R.Record({
  addPermissionGrantedTo: R.Array(R.String),
});

export const handler = withUser(
  getJWTCookieName(),
  getJWTSecret(),
  async (
    req: HttpFunctionRequest,
    user: User
  ): Promise<HttpFunctionResponse> => {
    const jsonResult = parseJsonBody(req.body);
    if (!jsonResult.success) {
      return { statusCode: 400, body: JSON.stringify(jsonResult) };
    }

    const payloadResult = ChangePermissionsListPayload.validate(
      jsonResult.value
    );
    if (!payloadResult.success) {
      return { statusCode: 400, body: JSON.stringify(payloadResult) };
    }

    const publicId = req.pathParameters?.publicId ?? "-";
    const shacal = await getShacal(publicId);
    if (shacal == null) {
      return { statusCode: 404 };
    }

    if (shacal.userId !== user.userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          message: "Only the calendar owner can change the permissions list",
        }),
      };
    }

    shacal.addPermissionGrantedTo = payloadResult.value.addPermissionGrantedTo.map(
      (line) => line.toLowerCase()
    );
    await replaceShacal(shacal);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }
);
