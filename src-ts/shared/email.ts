import * as D from "@begin/data";
import * as R from "runtypes";
import sendgrid from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/client/src/response";
import { Result } from "./result";
import {
  getSendgridApiKey,
  getSendgridAuthEmailTemplate,
  getSendgridFromAddress,
  getTTL,
} from "./utils";

// NOTE: for local dev sendgrid is optional
const sendgridApiKey = getSendgridApiKey();
if (sendgridApiKey != null) {
  sendgrid.setApiKey(sendgridApiKey);
}

type SendFn = typeof sendgrid["send"];
const sendEmail: SendFn =
  sendgridApiKey != null
    ? sendgrid.send.bind(sendgrid)
    : (payload) => {
        console.log("email send", payload);
        return Promise.resolve([{} as ClientResponse, {}]);
      };

const EMAILS_MIN_INTERVAL = 2 * 60 * 1000;

export async function sentAuthEmail(
  email: string,
  url: string
): Promise<Result<null>> {
  try {
    const lastSend = await getLastSend(email);

    if (lastSend != null && getNextSend(lastSend) > new Date()) {
      const msLeft = getNextSend(lastSend).getTime() - Date.now();
      const secLeft = Math.trunc(msLeft / 1000);
      return {
        success: false,
        message: `Email has been sent. Next try in ${secLeft} seconds`,
      };
    }

    await sendEmail({
      from: { email: getSendgridFromAddress(), name: "ShaCal no-reply" },
      to: email,
      templateId: getSendgridAuthEmailTemplate(),
      dynamicTemplateData: { email, url },
      trackingSettings: {
        clickTracking: { enable: false },
      },
      hideWarnings: true,
    });
    await setLastSend(email);
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

const LAST_SEND_TABLE = "LAST_SEND";
const LastSend = R.Record({ data: R.Number });
type LastSend = R.Static<typeof LastSend>;

function getNextSend(d: Date): Date {
  return new Date(d.getTime() + EMAILS_MIN_INTERVAL);
}

async function getLastSend(email: string): Promise<Date | null> {
  const r = await D.get({
    table: LAST_SEND_TABLE,
    key: email,
  });
  const lastSendResult = LastSend.validate(r);
  return lastSendResult.success ? new Date(lastSendResult.value.data) : null;
}

async function setLastSend(email: string): Promise<void> {
  await D.set<LastSend>({
    table: LAST_SEND_TABLE,
    key: email,
    ttl: getTTL(getNextSend(new Date())),
    data: Date.now(),
  });
}
