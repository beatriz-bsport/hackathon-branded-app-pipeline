export const PENALTY_KINDS = {
  BLOCK_PASS: 0,
  CHARGE_ACCOUNT: 1,
} as const;

/**
 * When a pass starts being usable.
 * Mirrors the backend master-data: 0 = on first booking, 1 = on first
 * attendance, 2 = on purchase.
 */
export const START_DATE_METHOD = {
  ON_FIRST_BOOKING: 0,
  ON_FIRST_ATTENDANCE: 1,
  ON_PURCHASE: 2,
} as const;
