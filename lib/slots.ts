import { query } from "@/lib/db";
import { asArray, flag, text } from "@/lib/parse";

const ADELAIDE_LANE = new Set(["education", "tourist"]);

export function lanesMatch(location: string, a: string, b: string): boolean {
  if (location !== "adelaide") return a === b;
  return ADELAIDE_LANE.has(a) === ADELAIDE_LANE.has(b);
}

export async function availableSlots(input: {
  location: string;
  enquiryType: string;
  date: string;
}): Promise<string[]> {
  const settings = await query<Record<string, unknown>>(
    `SELECT start_time, end_time, slot_duration_minutes, days_of_week, lunch_break_start, lunch_break_end, enquiry_type
     FROM calendar_settings WHERE location = ? AND is_active = 1`,
    [input.location],
  );
  const setting = settings.find((row) => lanesMatch(input.location, text(row.enquiry_type), input.enquiryType));
  if (!setting) return [];

  const weekday = new Date(`${input.date}T00:00:00`).getDay();
  const days = asArray<number | string>(setting.days_of_week).map((day) => Number(day));
  if (days.length && !days.includes(weekday)) return [];

  const duration = Number(setting.slot_duration_minutes) || 30;
  const slots = buildSlots(
    clock(setting.start_time),
    clock(setting.end_time),
    duration,
    clock(setting.lunch_break_start),
    clock(setting.lunch_break_end),
  );

  const booked = await query<Record<string, unknown>>(
    `SELECT appointment_time, enquiry_type, location FROM enhanced_appointments
     WHERE appointment_date = ? AND location = ? AND status NOT IN ('cancelled', 'canceled')`,
    [input.date, input.location],
  );
  const taken = new Set(
    booked
      .filter((row) => lanesMatch(input.location, text(row.enquiry_type), input.enquiryType))
      .map((row) => clock(row.appointment_time)),
  );

  const blocked = await query<Record<string, unknown>>(
    `SELECT start_time, end_time, is_all_day, blocked_locations FROM blocked_times
     WHERE blocked_date = ? AND is_active = 1`,
    [input.date],
  );

  return slots.filter((slot) => {
    if (taken.has(slot)) return false;
    return !blocked.some((row) => {
      const locations = asArray<string>(row.blocked_locations);
      if (locations.length && !locations.includes(input.location)) return false;
      if (flag(row.is_all_day)) return true;
      const start = clock(row.start_time);
      const end = clock(row.end_time);
      return slot >= start && slot < end;
    });
  });
}

function buildSlots(start: string, end: string, minutes: number, lunchStart: string, lunchEnd: string): string[] {
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
