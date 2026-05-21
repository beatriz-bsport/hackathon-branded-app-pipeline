import { usePassesQuery } from "#src/api/use-passes-query";

import type { PassesFilterCardProps } from "../types";
import { PassesFilterCard } from "./passes-filter-card";

type PassesFilterCardWithDataProps = Omit<PassesFilterCardProps, "passOptions">;

/**
 * Data wrapper for pass filter card.
 * Fetches pass options and delegates rendering to `PassesFilterCard`.
 */
export const PassesFilterCardWithData = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: PassesFilterCardWithDataProps) => {
  const { data } = usePassesQuery("");
  const passOptions = data?.results ?? [];

  return (
    <PassesFilterCard
      smartlistId={smartlistId}
      filterValue={filterValue}
      passOptions={passOptions}
      onDeleteUnsavedFilter={onDeleteUnsavedFilter}
      onSaveSuccess={onSaveSuccess}
    />
  );
};
