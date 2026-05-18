import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

export const ActivitySubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  activityOptions,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const activityLabel = t("filters.22.subFilters.activity");

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {activityLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.22.actions.removeSubFilter", {
            subFilterLabel: activityLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        options={activityOptions}
        value={value.activity.selectedMetaActivityIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "activity",
            {
              selectAllActivities: false,
              selectedMetaActivityIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t("filters.22.fields.activity.searchPlaceholder")}
        emptySelectionLabel={t("filters.22.fields.activity.emptySelection")}
        errorText={
          errors.activity?.selectedMetaActivityIds?.message
            ? String(errors.activity.selectedMetaActivityIds.message)
            : undefined
        }
      />
    </Card>
  );
};
