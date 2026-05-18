import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

export const LevelSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  levelOptions,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const levelLabel = t("filters.22.subFilters.level");

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {levelLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.22.actions.removeSubFilter", {
            subFilterLabel: levelLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        options={levelOptions}
        value={value.level.selectedLevelIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "level",
            {
              selectedLevelIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t("filters.22.fields.level.searchPlaceholder")}
        emptySelectionLabel={t("filters.22.fields.level.emptySelection")}
        errorText={
          errors.level?.selectedLevelIds?.message
            ? String(errors.level.selectedLevelIds.message)
            : undefined
        }
      />
    </Card>
  );
};
