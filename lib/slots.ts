import { query } from "@/lib/db";
import { asArray, flag, text } from "@/lib/parse";

const ADELAIDE_LANE = new Set(["education", "tourist"]);
export const ENQUIRY_TYPES = ["tr", "tourist", "education", "pr_complex", "ajay", "kunal", "arun"] as const;
export const MEETING_TYPES = ["phone", "in-person", "video-call"] as const;

export function isEnquiryType(value: string): value is (typeof ENQUIRY_TYPES)[number] {
  return (ENQUIRY_TYPES as readonly string[]).includes(value);
}

/** calendar_settings.location. Appointment rows still store adelaide or melbourne. */
export function calendarSettingsLocation(location: string, enquiryType: string): string {
  if (location === "adelaide") {
    return ADELAIDE_LANE.has(enquiryType) ? "adelaide_education_tourist" : "adelaide";
  }
  return location;
}

export function lanesMatch(location: string, booked: string, requested: string): boolean {
  if (location !== "adelaide") return booked === requested;
  return ADELAIDE_LANE.has(booked) === ADELAIDE_LANE.has(requested);
}

/** Calendar rows store ISO weekdays: 1 = Monday … 7 = Sunday. */
export function isoWeekday(date: string): number {
  const jsDay = new Date(`${date}T00:00:00`).getDay();
  return jsDay === 0 ? 7 : jsDay;
}

export async function availableSlots(input: {
  location: string;
  enquiryType: string;
  date: string;
}): Promise<string[]> {
  if (input.location !== "melbourne" && input.location !== "adelaide") return [];
  if (!isEnquiryType(input.enquiryType)) return [];

  const settingsLocation = calendarSettingsLocation(input.location, input.enquiryType);
  const adelaideCalendar = settingsLocation === "adelaide" || settingsLocation === "adelaide_education_tourist";
  const settings = await query<Record<string, unknown>>(
    adelaideCalendar
      ? `SELECT start_time, end_time, slot_duration_minutes, days_of_week, lunch_break_start, lunch_break_end
         FROM calendar_settings
         WHERE location = ? AND appointment_type = 'free' AND is_active = 1 AND enquiry_type IS NULL
         LIMIT 1`
      : `SELECT start_time, end_time, slot_duration_minutes, days_of_week, lunch_break_start, lunch_break_end
         FROM calendar_settings
         WHERE location = ? AND appointment_type = 'free' AND is_active = 1 AND enquiry_type = ?
         LIMIT 1`,
    adelaideCalendar ? [settingsLocation] : [settingsLocation, input.enquiryType],
  );
  const setting = settings[0];
  if (!setting) return [];

  const days = asArray<number | string>(setting.days_of_week).map((day) => Number(day));
  if (days.length && !days.includes(isoWeekday(input.date))) return [];

  const duration = Number(setting.slot_duration_minutes) || 30;
  const slots = buildSlots(
    clock(setting.start_time),
    clock(setting.end_time),
    duration,
    clock(setting.lunch_break_start),
    clock(setting.lunch_break_end),
  );

  const booked = await query<Record<string, unknown>>(
    `SELECT appointment_time, duration_minutes, enquiry_type FROM enhanced_appointments
     WHERE appointment_date = ? AND location = ? AND status <> 'cancelled'`,
    [input.date, input.location],
  );
  const taken = booked
    .filter((row) => lanesMatch(input.location, text(row.enquiry_type), input.enquiryType))
    .map((row) => ({
      start: toMinutes(clock(row.appointment_time)),
      end: toMinutes(clock(row.appointment_time)) + (Number(row.duration_minutes) || duration),
    }));

  const blocked = await query<Record<string, unknown>>(
    `SELECT start_time, end_time, is_all_day, blocked_locations, blocked_enquiry_types
     FROM blocked_times WHERE blocked_date = ? AND is_active = 1`,
    [input.date],
  );

  return slots.filter((slot) => {
    if (isPast(input.date, slot)) return false;
    const start = toMinutes(slot);
    const end = start + duration;
    if (taken.some((row) => start < row.end && end > row.start)) return false;
    return !blocked.some((row) => blocksSlot(row, input.location, input.enquiryType, start, end));
  });
}

function blocksSlot(
  row: Record<string, unknown>,
  location: string,
  enquiryType: string,
  start: number,
  end: number,
): boolean {
  const locations = asArray<string>(row.blocked_locations).map((item) => text(item));
  if (locations.length && !locations.includes(location)) return false;
  const enquiries = asArray<string>(row.blocked_enquiry_types).map((item) => text(item));
  if (enquiries.length && !enquiries.includes(enquiryType)) return false;
  if (flag(row.is_all_day)) return true;
  const blockStart = toMinutes(clock(row.start_time));
  const blockEnd = toMinutes(clock(row.end_time));
  if (!blockStart && !blockEnd) return false;
  return start < blockEnd && end > blockStart;
}

function isPast(date: string, slot: string): boolean {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (date > today) return false;
  if (date < today) return true;
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return slot <= current;
}

function buildSlots(start: string, end: string, minutes: number, lunchStart: string, lunchEnd: string): string[] {
  if (!start || !end || minutes <= 0) return [];
  const slots: string[] = [];
  let cursor = toMinutes(start);
  const finish = toMinutes(end);
  while (cursor + minutes <= finish) {
    const label = fromMinutes(cursor);
    const inLunch = lunchStart && lunchEnd && label >= lunchStart && label < lunchEnd;
    if (!inLunch) slots.push(label);
    cursor += minutes;
  }
  return slots;
}

function clock(value: unknown): string {
  const raw = text(value);
  const match = raw.match(/(\d{2}:\d{2})/);
  return match?.[1] ?? "";
}

function toMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

function fromMinutes(value: number): string {
  const hour = Math.floor(value / 60).toString().padStart(2, "0");
  const minute = (value % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}
