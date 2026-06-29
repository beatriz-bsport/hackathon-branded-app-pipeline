import type {
  CreateCustomFormFilterPayload,
  CustomFormCompletionCondition,
  CustomFormFilter,
  UpdateCustomFormFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type FormCompletionFilterFormValue = {
  id?: number;
  smartlist: number;
  all_selected_must_fulfill_condition_v2: CustomFormCompletionCondition;
  custom_forms: number[];
  hadLegacyConfigurationAtFetch?: boolean;
  hadDeprecatedSubFiltersAtFetch?: boolean;
};

export type FormCompletionFilterDirtyPatchPayload =
  UpdateCustomFormFilterPayload;

export type FormCompletionFilterCreatePayload = CreateCustomFormFilterPayload;

export type FormCompletionFilterCardProps =
  SegmentFilterCardProps<FormCompletionFilterFormValue> & {
    customFormOptions: Array<{ id: number; name: string }>;
  };

export type { CustomFormFilter };
