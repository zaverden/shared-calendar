import { Result } from "./result";

export function parseJsonBody(body: string | undefined): Result<unknown> {
  if (body === undefined) {
    return {
      success: false,
      message: "Request body is not defined",
    };
  }
  try {
    const json = JSON.parse(body);
    return { success: true, value: json };
  } catch (err) {
    return {
      success: false,
      message: `Body contains invalid JSON: ${err.message}`,
    };
  }
}
