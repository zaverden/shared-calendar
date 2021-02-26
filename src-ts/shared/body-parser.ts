import { Result } from "./result";

function atob(str: string) {
  return Buffer.from(str, "base64").toString("binary");
}

type ParseJsonBodyParams = {
  body?: string;
  isBase64Encoded?: boolean;
};
export function parseJsonBody({
  body,
  isBase64Encoded = false,
}: ParseJsonBodyParams): Result<unknown> {
  if (body === undefined) {
    return {
      success: false,
      message: "Request body is not defined",
    };
  }
  try {
    const json = JSON.parse(isBase64Encoded ? atob(body) : body);
    return { success: true, value: json };
  } catch (err) {
    return {
      success: false,
      message: `Body contains invalid JSON: ${err.message}`,
    };
  }
}
