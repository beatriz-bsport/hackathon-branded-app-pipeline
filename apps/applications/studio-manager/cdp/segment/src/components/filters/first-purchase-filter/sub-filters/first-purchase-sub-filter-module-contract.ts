import type {
  CreateFirstPurchaseFilterPayload,
  FirstPurchaseFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type { DirtyPatchPayload, FirstPurchaseFilterFormValue } from "../types";
import type { FirstPurchaseSubFilterId } from "./first-purchase-sub-filter-id";
import type { FirstPurchaseSubFilterSectionProps } from "./first-purchase-sub-filter-section-props";

/**
 * Contract every first-purchase sub-filter module must implement.
 */
export type FirstPurchaseSubFilterModule = SubFilterModule<
  FirstPurchaseSubFilterId,
  FirstPurchaseFilterFormValue,
  FirstPurchaseFilter,
  CreateFirstPurchaseFilterPayload,
  DirtyPatchPayload,
  FirstPurchaseSubFilterSectionProps
>;
