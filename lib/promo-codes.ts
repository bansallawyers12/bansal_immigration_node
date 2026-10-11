import { query } from "@/lib/db";

export async function validatePromoCode(code: string): Promise<
  | { valid: true; discount_percent: number; discount_amount: number | null }
  | { valid: false; message: string }
> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, message: "Enter a promo code." };
  const rows = await query<Record<string, unknown>>(
    `SELECT code, discount_percent, discount_amount, is_active, expires_at, is_one_time, used_at
     FROM promo_codes WHERE code = ? LIMIT 1`,
    [normalized],
  );
  const row = rows[0];
  if (!row || !row.is_active) return { valid: false, message: "This promo code is not valid." };
  if (row.expires_at && new Date(String(row.expires_at)) < new Date()) {
    return { valid: false, message: "This promo code has expired." };
  }
  if (row.is_one_time && row.used_at) {
    return { valid: false, message: "This promo code has already been used." };
  }
  return {
    valid: true,
    discount_percent: Number(row.discount_percent) || 0,
    discount_amount: row.discount_amount == null ? null : Number(row.discount_amount),
  };
}

export async function markPromoUsed(code: string): Promise<void> {
  await query(`UPDATE promo_codes SET used_at = NOW() WHERE code = ? AND is_one_time = 1`, [
    code.trim().toUpperCase(),
  ]);
}

export function applyPromo(baseAmount: number, promo: { discount_percent: number; discount_amount: number | null }) {
  let discount = promo.discount_amount ?? 0;
  if (promo.discount_percent > 0) {
    discount = Math.max(discount, (baseAmount * promo.discount_percent) / 100);
  }
  return { discount: Math.round(discount * 100) / 100, final: Math.max(0, baseAmount - discount) };
}
