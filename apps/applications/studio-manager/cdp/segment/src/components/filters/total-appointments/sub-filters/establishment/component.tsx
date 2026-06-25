import { Body, Button, Checkbox } from "@bsport/kaizen-primitive-core";

import { useEstablishmentsQuery } from "#src/api/use-establishments-query";
import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalAppointmentsSubFilterSectionProps } from "../total-appointments-sub-filter-section-props";

export const EstablishmentSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalAppointmentsSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const establishmentLabel = t("filters.26.subFilters.establishment");
  const { data: establishmentOptions } = useEstablishmentsQuery();
  const atHomeCheckboxId = `${id}-at-home`;

  return (
    <div className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {establishmentLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.26.actions.removeSubFilter", {
            subFilterLabel: establishmentLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        label={establishmentLabel}
        options={establishmentOptions}
        value={value.establishment.selectedEstablishmentIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "establishment",
            {
              ...value.establishment,
              selectAllEstablishments: false,
              selectedEstablishmentIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t(
          "filters.26.fields.establishment.searchPlaceholder",
        )}
        emptySelectionLabel={t(
          "filters.26.fields.establishment.emptySelection",
        )}
        errorText={
          !value.establishment.atHome &&
          errors.establishment?.selectedEstablishmentIds?.message
            ? String(errors.establishment.selectedEstablishmentIds.message)
            : undefined
        }
      />

      <div className="flex items-center gap-xs">
        <Body htmlVariant="span" size="md" color="default">
          {t("filters.26.fields.establishment.atHomePrefix")}
        </Body>
        <Checkbox
          id={atHomeCheckboxId}
          value={value.establishment.atHome ? "checked" : "unchecked"}
          label={t("filters.26.fields.establishment.atHomeLabel")}
          onChange={(nextAtHome) => {
            setValue(
              "establishment",
              {
                ...value.establishment,
                atHome: nextAtHome,
              },
              { shouldDirty: true, shouldValidate: true },
            );
          }}
        />
      </div>
    </div>
  );
};
