import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCoachOptionsForTotalBookingQuery } from "#src/api/use-coach-options-for-total-booking-query";
import { useEstablishmentsQuery } from "#src/api/use-establishments-query";
import { useGroupActivitiesQuery } from "#src/api/use-group-activities-query";
import { usePassesQuery } from "#src/api/use-passes-query";

import type { TotalBookingNumberFilterCardProps } from "../types";
import { TotalBookingNumberFilterCard } from "./total-booking-number-filter-card";

type TotalBookingFilterCardWithDataProps = Omit<
  TotalBookingNumberFilterCardProps,
  "activityOptions" | "establishmentOptions" | "coachOptions" | "passOptions"
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
  const { data: passesData } = usePassesQuery("");
  const activityOptions = data ?? [];
  const establishmentOptions = establishmentsData ?? [];
  const coachOptions = coachOptionsData ?? [];
  const passOptions = passesData?.results ?? [];

  return (
    <TotalBookingNumberFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      activityOptions={activityOptions}
      establishmentOptions={establishmentOptions}
      coachOptions={coachOptions}
      passOptions={passOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};
