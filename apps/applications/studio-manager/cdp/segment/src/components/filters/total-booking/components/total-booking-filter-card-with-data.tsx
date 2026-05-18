import { useEstablishmentsQuery } from "#src/api/use-establishments-query";
import { useGroupActivitiesQuery } from "#src/api/use-group-activities-query";

import type { TotalBookingNumberFilterCardProps } from "../types";
import { TotalBookingNumberFilterCard } from "./total-booking-number-filter-card";

type TotalBookingFilterCardWithDataProps = Omit<
  TotalBookingNumberFilterCardProps,
  "activityOptions" | "establishmentOptions"
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
  const { data: establishmentsData } = useEstablishmentsQuery();
  const activityOptions = data ?? [];
  const establishmentOptions = establishmentsData ?? [];

  return (
    <TotalBookingNumberFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      activityOptions={activityOptions}
      establishmentOptions={establishmentOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};
