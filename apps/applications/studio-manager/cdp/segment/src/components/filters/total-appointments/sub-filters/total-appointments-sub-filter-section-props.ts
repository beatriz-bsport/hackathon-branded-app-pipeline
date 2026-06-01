import type { SubFilterSectionProps } from "#src/components/filters/shared/sub-filter-contract";

import type { TotalAppointmentsNumberFilterFormValue } from "../types";

/**
 * `companyId` is owned by the filter card / smartlist manager so option queries
 * stay scoped to one stable studio id instead of re-reading theme per section.
 */
export type TotalAppointmentsSubFilterSectionProps = SubFilterSectionProps<
  TotalAppointmentsNumberFilterFormValue,
  { companyId: number }
>;
