import type { SubFilterSectionProps } from "#src/components/filters/shared/sub-filter-contract";

import type { TotalBookingNumberFilterFormValue } from "../types";

type TotalBookingSubFilterExtraProps = {
  activityOptions: {
    id: number;
    name: string;
  }[];
};

export type TotalBookingSubFilterSectionProps = SubFilterSectionProps<
  TotalBookingNumberFilterFormValue,
  TotalBookingSubFilterExtraProps
>;
