import { readFile } from "node:fs/promises";
import { google } from "googleapis";

export async function appendLpEnquiry(data: Record<string, string | undefined>): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
  if (!spreadsheetId || !credentialsPath) return false;

  const raw = await readFile(credentialsPath, "utf8");
  const credentials = JSON.parse(raw) as { client_email?: string; private_key?: string };
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const now = new Date();
  const date = now.toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  const row = [
    date,
    data.name ?? "",
    data.email ?? "",
    data.phone ?? "",
    data.interest ?? "",
    "",
    "",
    "",
    data.utm_source ?? "",
    data.utm_medium ?? "",
    data.utm_campaign ?? "",
    data.utm_term ?? "",
    data.utm_content ?? "",
    data.message ?? "",
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:N",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
  return true;
}
