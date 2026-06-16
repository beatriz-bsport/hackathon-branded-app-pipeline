import type {
  CreatePaymentMethodFilterPayload,
  PaymentMethodFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type { DirtyPatchPayload, PaymentMethodFilterFormValue } from "../types";
import type { PaymentMethodSubFilterId } from "./payment-method-sub-filter-id";
import type { PaymentMethodSubFilterSectionProps } from "./payment-method-sub-filter-section-props";

/**
 * Contract every payment-method sub-filter module must implement.
 */
export type PaymentMethodSubFilterModule = SubFilterModule<
  PaymentMethodSubFilterId,
  PaymentMethodFilterFormValue,
  PaymentMethodFilter,
  CreatePaymentMethodFilterPayload,
  DirtyPatchPayload,
  PaymentMethodSubFilterSectionProps
>;
