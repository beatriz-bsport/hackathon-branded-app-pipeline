import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

export const CoachSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  coachOptions,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const coachLabel = t("filters.22.subFilters.coach");

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
          label={t("filters.22.actions.deleteFilter", {
            filterLabel: coachLabel,
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
        searchPlaceholder={t("filters.22.fields.coach.searchPlaceholder")}
        emptySelectionLabel={t("filters.22.fields.coach.emptySelection")}
        errorText={
          errors.coach?.selectedCoachIds?.message
            ? String(errors.coach.selectedCoachIds.message)
            : undefined
        }
      />
    </Card>
  );
};
