import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useEstablishmentsQuery } from "#src/api/use-establishments-query";
import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

export const EstablishmentSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const establishmentLabel = t("filters.22.subFilters.establishment");
  const { data: establishmentOptions } = useEstablishmentsQuery();

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {establishmentLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.22.actions.removeSubFilter", {
            subFilterLabel: establishmentLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        options={establishmentOptions}
        value={value.establishment.selectedEstablishmentIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "establishment",
            {
              selectAllEstablishments: false,
              selectedEstablishmentIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t(
          "filters.22.fields.establishment.searchPlaceholder",
        )}
        emptySelectionLabel={t(
          "filters.22.fields.establishment.emptySelection",
        )}
        errorText={
          errors.establishment?.selectedEstablishmentIds?.message
            ? String(errors.establishment.selectedEstablishmentIds.message)
            : undefined
        }
      />
    </Card>
  );
};
