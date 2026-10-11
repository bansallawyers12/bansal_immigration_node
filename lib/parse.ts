export function asRecord(value: unknown): Record<string, unknown> | null {
  const parsed = parseJson(value);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>;
  }
  return null;
}

export function asArray<T = unknown>(value: unknown): T[] {
  const parsed = parseJson(value);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

export function asStringList(value: unknown): string[] {
  return asArray(value)
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

export function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

export function flag(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}
