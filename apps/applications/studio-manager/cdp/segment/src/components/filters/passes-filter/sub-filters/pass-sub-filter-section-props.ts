import type { SubFilterSectionProps } from "#src/components/filters/shared/sub-filter-contract";

import type { PassesFilterFormValue } from "../types";

/**
 * Props shared by every pass sub-filter section component.
 */
export type PassSubFilterSectionProps = SubFilterSectionProps<
  PassesFilterFormValue,
  object
>;
