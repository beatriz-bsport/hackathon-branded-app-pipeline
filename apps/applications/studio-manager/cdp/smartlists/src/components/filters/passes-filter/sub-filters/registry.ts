import type { PassSubFilterModule } from "./pass-sub-filter-module-contract";
import { purchaseDatePassSubFilterModule } from "./purchase-date/purchase-date.module";

/**
 * Ordered list of pass sub-filter modules wired into the pass filter card.
 *
 * To add a sub-filter: implement `PassSubFilterModule`, append it here, extend
 * `PASS_SUB_FILTER_IDS` / the zod `subFilters` array enum in `schema.ts`, and
 * add the new slot on `PassesFilterFormValue`.
 */
export const REGISTERED_PASS_SUB_FILTERS = [
  purchaseDatePassSubFilterModule,
] as const satisfies readonly PassSubFilterModule[];

export type RegisteredPassSubFilterModule =
  (typeof REGISTERED_PASS_SUB_FILTERS)[number];
