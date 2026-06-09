import type {
  BasketAbandonmentFilter,
  CreateBasketAbandonmentFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type {
  BasketAbandonmentDirtyPatchPayload,
  BasketAbandonmentFilterFormValue,
} from "../types";
import type { BasketAbandonmentSubFilterId } from "./basket-abandonment-sub-filter-id";
import type { BasketAbandonmentSubFilterSectionProps } from "./basket-abandonment-sub-filter-section-props";

/**
 * Contract every abandoned-basket sub-filter module must implement.
 */
export type BasketAbandonmentSubFilterModule = SubFilterModule<
  BasketAbandonmentSubFilterId,
  BasketAbandonmentFilterFormValue,
  BasketAbandonmentFilter,
  CreateBasketAbandonmentFilterPayload,
  BasketAbandonmentDirtyPatchPayload,
  BasketAbandonmentSubFilterSectionProps
>;
