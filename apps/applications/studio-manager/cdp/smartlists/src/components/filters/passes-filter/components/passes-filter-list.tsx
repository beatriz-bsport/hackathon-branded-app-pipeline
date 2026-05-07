import { useState } from "react";

import { usePassesQuery } from "#src/api/use-passes-query";
import { useSmartlistFilterQuery } from "#src/api/use-smartlist-filter-query";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { FilterManager } from "#src/components/filters/filter-manager";
import { useTranslation } from "#src/utils/i18n";

import { createDefaultPassesFilter } from "../default-value";
import { mapApiFilterToFormValue } from "../mappers/api-to-form-value";
import type { PassesFilterFormValue } from "../types";
import { PassesFilterCard } from "./passes-filter-card";
import { PassesFilterCardSkeleton } from "./passes-filter-card-skeleton";

type PassesFilterListProps = {
  smartlistId: string;
};

type PassesFilterCardWithDataProps = {
  smartlistId: string;
  filterValue: PassesFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

type DraftFilter = {
  clientId: string;
  value: PassesFilterFormValue;
};

/**
 * Wraps a card with a suspense-backed pass options fetch.
 * Each card owns its own pass options query so the list does not need to
 * pass them down through props.
 */
const PassesFilterCardWithData = ({
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

/**
 * Generates a unique draft client id without depending on `crypto.randomUUID`,
 * which keeps tests and older browsers happy.
 */
let draftCounter = 0;
const createDraftClientId = (): string => {
  draftCounter += 1;
  return `passes-filter-draft-${draftCounter}-${Date.now()}`;
};

/**
 * Lists all pass filters attached to a smartlist and lets the user create new
 * ones via local drafts.
 *
 * Server-side filters are rendered directly from the hydration query so the
 * server is the source of truth for them. Drafts only live in local state and
 * are removed once their backing mutation succeeds.
 */
export const PassesFilterList = ({ smartlistId }: PassesFilterListProps) => {
  const { t } = useTranslation("campaign-filters");
  const smartlistNumericId = Number(smartlistId);
  const [drafts, setDrafts] = useState<DraftFilter[]>([]);

  const {
    data: paymentPackFilters = [],
    isLoading,
    isError,
  } = useSmartlistFilterQuery(smartlistId);

  const addDraft = () => {
    setDrafts((previousDrafts) => [
      ...previousDrafts,
      {
        clientId: createDraftClientId(),
        value: createDefaultPassesFilter(smartlistNumericId),
      },
    ]);
  };

  const removeDraft = (clientId: string) => {
    setDrafts((previousDrafts) =>
      previousDrafts.filter((draft) => draft.clientId !== clientId),
    );
  };

  return (
    <FilterManager
      isLoading={isLoading}
      isError={isError}
      addFilterLabel={t("filters.19.actions.addFilter")}
      onAddFilter={addDraft}
    >
      {paymentPackFilters.map((paymentPackFilter) => (
        <QueryBoundary
          key={`saved-${paymentPackFilter.id}`}
          loadingFallback={<PassesFilterCardSkeleton />}
        >
          <PassesFilterCardWithData
            smartlistId={smartlistId}
            filterValue={mapApiFilterToFormValue(paymentPackFilter)}
          />
        </QueryBoundary>
      ))}

      {drafts.map((draft) => (
        <QueryBoundary
          key={draft.clientId}
          loadingFallback={<PassesFilterCardSkeleton />}
        >
          <PassesFilterCardWithData
            smartlistId={smartlistId}
            filterValue={draft.value}
            onDeleteUnsavedFilter={() => removeDraft(draft.clientId)}
            onSaveSuccess={() => removeDraft(draft.clientId)}
          />
        </QueryBoundary>
      ))}
    </FilterManager>
  );
};
