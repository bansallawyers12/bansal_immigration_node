import { availableSlots } from "@/lib/slots";

export async function checkBlockedDates(input: {
  startDate: string;
  endDate: string;
  location: string;
  enquiryType: string;
}): Promise<string[]> {
  const blocked: string[] = [];
  const start = new Date(`${input.startDate}T00:00:00`);
  const end = new Date(`${input.endDate}T00:00:00`);
  for (let cursor = start; cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10);
    const slots = await availableSlots({
      location: input.location,
      enquiryType: input.enquiryType,
      date,
    });
    if (!slots.length) blocked.push(date);
  }
  return blocked;
}
