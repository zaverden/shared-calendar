import sendgrid from "@sendgrid/mail";
import { Result } from "./result";
import {
  getSendgridApiKey,
  getSendgridAuthEmailTemplate,
  getSendgridFromAddress,
} from "./utils";

sendgrid.setApiKey(getSendgridApiKey());

export async function sentAuthEmail(
  email: string,
  url: string
): Promise<Result<null>> {
  try {
    await sendgrid.send({
      from: { email: getSendgridFromAddress(), name: "ShaCal no-reply" },
      to: email,
      templateId: getSendgridAuthEmailTemplate(),
      dynamicTemplateData: { email, url },
      trackingSettings: {
        clickTracking: { enable: false },
      },
      hideWarnings: true,
    });

    return {
      success: true,
      value: null,
    };
  } catch (err) {
    const responseErrors = err.response?.body?.errors;
    if (Array.isArray(responseErrors)) {
      return {
        success: false,
        message: responseErrors.map((e) => e.message).join(" "),
      };
    }
    return {
      success: false,
      message: err.message,
    };
  }
}
