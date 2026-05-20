import type {
  CreatePaymentPackFilterPayload,
  PaymentPackFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type { DirtyPatchPayload, PassesFilterFormValue } from "../types";
import type { PassSubFilterId } from "./pass-sub-filter-id";
import type { PassSubFilterSectionProps } from "./pass-sub-filter-section-props";

/**
 * Contract every pass sub-filter module must implement so the card, schema,
 * and mappers stay generic while each sub-filter stays isolated.
 */
export type PassSubFilterModule = SubFilterModule<
  PassSubFilterId,
  PassesFilterFormValue,
  PaymentPackFilter,
  CreatePaymentPackFilterPayload,
  DirtyPatchPayload,
  PassSubFilterSectionProps
>;
