import type { ActivePassesFilter } from "@bsport/api-cdp/smartlist";

import type { ActivePassesComparatorTypeValue } from "./constants";

/**
 * Frontend form value for a single active passes filter card.
 */
export type ActivePassesFilterFormValue = {
  /** Server-side id, undefined when the filter is a new draft. */
  id?: number;
  smartlist: number;
  /** Numeric comparator operator (frontend string representation). */
  comparatorType: ActivePassesComparatorTypeValue;
  /** First / lower-bound count value. */
  comparatorValue: number;
  /** Upper-bound value — only meaningful when comparatorType is "between". */
  comparatorValueSecond: number | null;
  /** Controls the "Specify Passes" (group passes) section. */
  paymentPacksSelector: {
    enabled: boolean;
    /** When true, all company group passes are in scope (`select_all_payment_packs = true`). */
    selectAll: boolean;
    selectedIds: number[];
  };
  /** Controls the "Specify Appointment Passes" section. */
  appointmentPassesSelector: {
    enabled: boolean;
    /** When true, all company appointment passes are in scope (`select_all_private_passes = true`). */
    selectAll: boolean;
    selectedIds: number[];
  };
};

/**
 * Card component props for the active passes filter.
 */
export type ActivePassesFilterCardProps = {
  smartlistId: string;
  filterValue: ActivePassesFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

/**
 * Lightweight pass option for the filter pickers.
 */
export type ActivePassesPassOption = {
  id: number;
  name: string;
  credits: number | null;
  price?: number | string | { source: string; parsedValue: number };
};

export { ActivePassesFilter };
