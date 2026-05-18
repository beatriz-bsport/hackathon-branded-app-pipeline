import type { PassOption } from "#src/components/filters/passes-filter/types";
import type { SubFilterSectionProps } from "#src/components/filters/shared/sub-filter-contract";

import type { TotalBookingNumberFilterFormValue } from "../types";

type TotalBookingSubFilterExtraProps = {
  activityOptions: {
    id: number;
    name: string;
  }[];
  establishmentOptions: {
    id: number;
    name: string;
  }[];
  coachOptions: {
    id: number;
    name: string;
  }[];
  passOptions: PassOption[];
};

export type TotalBookingSubFilterSectionProps = SubFilterSectionProps<
  TotalBookingNumberFilterFormValue,
  TotalBookingSubFilterExtraProps
>;
