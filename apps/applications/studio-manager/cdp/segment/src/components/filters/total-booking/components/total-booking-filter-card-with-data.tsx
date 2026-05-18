import { useGroupActivitiesQuery } from "#src/api/use-group-activities-query";

import type { TotalBookingNumberFilterCardProps } from "../types";
import { TotalBookingNumberFilterCard } from "./total-booking-number-filter-card";

type TotalBookingFilterCardWithDataProps = Omit<
  TotalBookingNumberFilterCardProps,
  "activityOptions"
>;

/**
 * Data wrapper for total booking filter card.
 * Fetches activity options and delegates rendering to `TotalBookingNumberFilterCard`.
 */
export const TotalBookingFilterCardWithData = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: TotalBookingFilterCardWithDataProps) => {
  const { data } = useGroupActivitiesQuery();
  const activityOptions = data ?? [];

  return (
    <TotalBookingNumberFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      activityOptions={activityOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};
