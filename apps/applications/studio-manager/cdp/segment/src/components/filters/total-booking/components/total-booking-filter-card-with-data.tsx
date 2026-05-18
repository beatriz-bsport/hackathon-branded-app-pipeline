import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCoachOptionsForTotalBookingQuery } from "#src/api/use-coach-options-for-total-booking-query";
import { useEstablishmentsQuery } from "#src/api/use-establishments-query";
import { useGroupActivitiesQuery } from "#src/api/use-group-activities-query";

import type { TotalBookingNumberFilterCardProps } from "../types";
import { TotalBookingNumberFilterCard } from "./total-booking-number-filter-card";

type TotalBookingFilterCardWithDataProps = Omit<
  TotalBookingNumberFilterCardProps,
  "activityOptions" | "establishmentOptions" | "coachOptions"
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
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { data } = useGroupActivitiesQuery();
  const { data: establishmentsData } = useEstablishmentsQuery();
  const { data: coachOptionsData } =
    useCoachOptionsForTotalBookingQuery(companyId);
  const activityOptions = data ?? [];
  const establishmentOptions = establishmentsData ?? [];
  const coachOptions = coachOptionsData ?? [];

  return (
    <TotalBookingNumberFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      activityOptions={activityOptions}
      establishmentOptions={establishmentOptions}
      coachOptions={coachOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};
