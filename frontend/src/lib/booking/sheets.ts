import { google, type sheets_v4 } from "googleapis";

// Google Sheets booking ledger. One row per booking, keyed by Booking ID, updated
// in place when Cal.com reports a cancel or reschedule.
//
// Values are written RAW (never USER_ENTERED) so visitor text such as "=IMPORTXML(...)"
// lands as plain text instead of executing as a formula.

export const SHEET_HEADERS = [
  "Booking ID",
  "Submitted (IST)",
  "Status",
  "Slot (IST)",
  "Slot start (UTC)",
  "Name",
  "Email",
  "Company",
  "Role",
  "Goal",
  "Meeting link",
  "Cal.com UID",
  "Source",
  "Last updated (IST)",
] as const;

type Header = (typeof SHEET_HEADERS)[number];

const COL = Object.fromEntries(SHEET_HEADERS.map((h, i) => [h, i])) as Record<Header, number>;
const colLetter = (h: Header) => String.fromCharCode(65 + COL[h]);
const LAST_COL = String.fromCharCode(64 + SHEET_HEADERS.length);

export type BookingStatus = "Confirmed" | "Requested" | "Cancelled" | "Rescheduled";

export interface SheetBooking {
  bookingId: string;
  status: BookingStatus;
  slotLabel: string;
  slotIso: string;
  name: string;
  email: string;
  company: string;
  role: string;
  goal: string;
  meetingLink: string;
  calUid: string;
  source: "Website" | "Cal.com";
}

function nowIST(): string {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export function sheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEETS_ID);
}

function client(): { api: sheets_v4.Sheets; spreadsheetId: string; tab: string } | null {
  if (!sheetsConfigured()) return null;
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return {
    api: google.sheets({ version: "v4", auth }),
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    tab: process.env.GOOGLE_SHEETS_BOOKINGS_TAB || "Bookings",
  };
}

let tabReady = false;

// Creates the bookings tab and its header row on first use.
async function ensureTab(api: sheets_v4.Sheets, spreadsheetId: string, tab: string): Promise<void> {
  if (tabReady) return;
  const meta = await api.spreadsheets.get({ spreadsheetId, fields: "sheets.properties.title" });
  if (!meta.data.sheets?.some((s) => s.properties?.title === tab)) {
    await api.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tab, gridProperties: { frozenRowCount: 1 } } } }] },
    });
  }
  const head = await api.spreadsheets.values.get({ spreadsheetId, range: `'${tab}'!A1:${LAST_COL}1` });
  if (!head.data.values?.[0]?.length) {
    await api.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tab}'!A1:${LAST_COL}1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...SHEET_HEADERS]] },
    });
  }
  tabReady = true;
}

function toRow(b: SheetBooking, at: string): string[] {
  const values: Record<Header, string> = {
    "Booking ID": b.bookingId,
    "Submitted (IST)": at,
    Status: b.status,
    "Slot (IST)": b.slotLabel,
    "Slot start (UTC)": b.slotIso,
    Name: b.name,
    Email: b.email,
    Company: b.company,
    Role: b.role,
    Goal: b.goal,
    "Meeting link": b.meetingLink,
    "Cal.com UID": b.calUid,
    Source: b.source,
    "Last updated (IST)": at,
  };
  return SHEET_HEADERS.map((h) => values[h]);
}

export async function appendBooking(b: SheetBooking): Promise<void> {
  const c = client();
  if (!c) return;
  await ensureTab(c.api, c.spreadsheetId, c.tab);
  await c.api.spreadsheets.values.append({
    spreadsheetId: c.spreadsheetId,
    range: `'${c.tab}'!A:${LAST_COL}`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [toRow(b, nowIST())] },
  });
}

// 1-based sheet row holding this Cal.com UID, or null
async function findRowByCalUid(api: sheets_v4.Sheets, spreadsheetId: string, tab: string, calUid: string): Promise<number | null> {
  const col = colLetter("Cal.com UID");
  const res = await api.spreadsheets.values.get({ spreadsheetId, range: `'${tab}'!${col}:${col}` });
  const idx = (res.data.values ?? []).findIndex((r) => r[0] === calUid);
  return idx > 0 ? idx + 1 : null;
}

export async function hasCalUid(calUid: string): Promise<boolean> {
  const c = client();
  if (!c) return false;
  await ensureTab(c.api, c.spreadsheetId, c.tab);
  return (await findRowByCalUid(c.api, c.spreadsheetId, c.tab, calUid)) !== null;
}

// Patches status (and slot, when rescheduled) on the row for a Cal.com booking.
// Returns false when no row matches.
export async function updateByCalUid(
  calUid: string,
  patch: { status: BookingStatus; slotLabel?: string; slotIso?: string; newCalUid?: string; meetingLink?: string }
): Promise<boolean> {
  const c = client();
  if (!c) return false;
  await ensureTab(c.api, c.spreadsheetId, c.tab);
  const rowNum = await findRowByCalUid(c.api, c.spreadsheetId, c.tab, calUid);
  if (!rowNum) return false;

  const cell = (h: Header, value: string): sheets_v4.Schema$ValueRange => ({
    range: `'${c.tab}'!${colLetter(h)}${rowNum}`,
    values: [[value]],
  });

  const data = [cell("Status", patch.status), cell("Last updated (IST)", nowIST())];
  if (patch.slotLabel) data.push(cell("Slot (IST)", patch.slotLabel));
  if (patch.slotIso) data.push(cell("Slot start (UTC)", patch.slotIso));
  if (patch.newCalUid) data.push(cell("Cal.com UID", patch.newCalUid));
  if (patch.meetingLink) data.push(cell("Meeting link", patch.meetingLink));

  await c.api.spreadsheets.values.batchUpdate({
    spreadsheetId: c.spreadsheetId,
    requestBody: { valueInputOption: "RAW", data },
  });
  return true;
}
