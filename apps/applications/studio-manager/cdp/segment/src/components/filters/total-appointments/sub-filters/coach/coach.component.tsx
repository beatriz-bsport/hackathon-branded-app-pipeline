import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useCoachOptionsForTotalAppointmentsQuery } from "#src/api/use-coach-options-for-total-appointments-query";
import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalAppointmentsSubFilterSectionProps } from "../total-appointments-sub-filter-section-props";

export const CoachSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
  companyId,
}: TotalAppointmentsSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const { data: coachOptions } =
    useCoachOptionsForTotalAppointmentsQuery(companyId);
  const coachLabel = t("filters.26.subFilters.coach");

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {coachLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.26.actions.removeSubFilter", {
            subFilterLabel: coachLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        label={coachLabel}
        options={coachOptions}
        value={value.coach.selectedCoachIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "coach",
            {
              selectAllCoaches: false,
              selectedCoachIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t("filters.26.fields.coach.searchPlaceholder")}
        emptySelectionLabel={t("filters.26.fields.coach.emptySelection")}
        errorText={
          errors.coach?.selectedCoachIds?.message
            ? String(errors.coach.selectedCoachIds.message)
            : undefined
        }
      />
    </Card>
  );
};
