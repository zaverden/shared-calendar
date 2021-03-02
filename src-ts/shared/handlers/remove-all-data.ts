import {
  HttpFunctionRequest,
  HttpFunctionResponse,
  withBaseUrl,
} from "../begin";
import * as D from "@begin/data";

const tables = [
  "GOOGLE_ACCOUNT",
  "USERS",
  "LAST_SEND",
  "EVENT_MAPS",
  "EVENTS",
  "SHACAL",
];

export const handler = withBaseUrl(
  async (): Promise<HttpFunctionResponse> => {
    let total = 0;
    for (const table of tables) {
      total += await destroyAllData(table);
    }
    return { statusCode: 200, body: JSON.stringify({ total }) };
  }
);

async function destroyAllData(table: string) {
  let page = await D.get({ table });
  let total = 0;
  while (page.length > 0) {
    total += page.length;
    await D.destroy(page);
    page = await D.get({ table });
  }
  return total;
}
