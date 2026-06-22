import type { Contract } from "./types/models";

export const BILLING_INTERVALS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const satisfies Record<string, Contract["interval"]>;
