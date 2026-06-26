import type { SmartlistFilterPayload } from "../../shared/types";
import type { CustomFormCompletionCondition } from "./constants";

/**
 * Deprecated sub-filter fields returned by fetch.
 * Not exposed in studio UI; may be patched to deactivate legacy configuration.
 *
 * @deprecated Backend-only legacy fields — not editable in studio UI.
 */
export type CustomFormFilterDeprecatedSubFilters = {
  has_filled: boolean;
  all_selected_must_fulfill_condition: boolean;
  date_filter_active: boolean;
  date_filter_type: number;
  date: string;
  date_second: string;
  duration: number;
  duration_second: number;
  completion_percentage_filter_active: boolean;
  completion_percentage_comparator: number;
  completion_percentage_value: number;
  completion_percentage_value_second: number;
};

/**
 * Primary smartlist custom form completion filter fields (studio UI scope).
 */
export type CustomFormFilterPrimaryFields = {
  is_v2: boolean;
  all_selected_must_fulfill_condition_v2: CustomFormCompletionCondition;
  custom_forms: number[];
};

/**
 * Smartlist custom form completion filter.
 * Endpoint family: `/customer-data-platform/v1/smartlist/custom_form/`.
 */
export type CustomFormFilter = {
  company: number;
} & SmartlistFilterPayload &
  CustomFormFilterPrimaryFields &
  CustomFormFilterDeprecatedSubFilters;

export type CreateCustomFormFilterPayload = {
  smartlist: number;
  is_v2: true;
  all_selected_must_fulfill_condition_v2: CustomFormCompletionCondition;
  custom_forms: number[];
};

export type UpdateCustomFormFilterPayload = Partial<
  Pick<
    CustomFormFilterPrimaryFields,
    "is_v2" | "all_selected_must_fulfill_condition_v2" | "custom_forms"
  > &
    Pick<
      CustomFormFilterDeprecatedSubFilters,
      "date_filter_active" | "completion_percentage_filter_active"
    >
>;

export type UpsertCustomFormFilterVariables = {
  filterId?: number;
  createPayload?: CreateCustomFormFilterPayload;
  updatePayload?: UpdateCustomFormFilterPayload;
};
