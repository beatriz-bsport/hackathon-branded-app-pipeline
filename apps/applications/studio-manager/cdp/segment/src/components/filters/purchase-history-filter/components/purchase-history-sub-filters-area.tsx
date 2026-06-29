import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  type PurchaseHistorySubFilterField,
  type PurchaseHistorySubFilterId,
  purchaseHistorySubFilterFieldMap,
} from "../sub-filters/purchase-history-sub-filter-id";
import {
  REGISTERED_PURCHASE_HISTORY_SUB_FILTERS,
  REGISTERED_PURCHASE_HISTORY_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { PurchaseHistoryFilterFormValue } from "../types";

type PurchaseHistorySubFiltersAreaProps = {
  fieldIds: Record<PurchaseHistorySubFilterField, string>;
  watchedFilterValue: PurchaseHistoryFilterFormValue;
  errors: FieldErrors<PurchaseHistoryFilterFormValue>;
  setValue: UseFormSetValue<PurchaseHistoryFilterFormValue>;
};

/**
 * Renders the filter specifications region for the purchase history filter.
 */
export const PurchaseHistorySubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: PurchaseHistorySubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_PURCHASE_HISTORY_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: PurchaseHistorySubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: PurchaseHistorySubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = purchaseHistorySubFilterFieldMap[subFilterId];
    setValue(fieldToReset, createDefaultDateFilterValue(), {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule =
        REGISTERED_PURCHASE_HISTORY_SUB_FILTERS_BY_ID[subFilterId];
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[purchaseHistorySubFilterFieldMap[subFilterId]] ??
        `${subFilterId}-section`;

      return [
        {
          key: sectionId,
          content: (
            <Section
              id={sectionId}
              value={watchedFilterValue}
              errors={errors}
              setValue={setValue}
              onRemove={() => removeSubFilter(subFilterId)}
            />
          ),
        },
      ];
    },
  );

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.24.fields.filterSpecifications")}
      </Body>

      <SubFiltersCardSections sections={subFilterSections} />

      {availableSubFilters.length > 0 ? (
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                iconLeft="plus"
                size="sm"
                intent="flat"
                color="default"
                label={t("filters.24.actions.addSubFilter")}
                onClick={() => setIsPopoverOpened(true)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content placement="bottom-left">
            {({ setIsPopoverOpened }) => (
              <Menu
                items={availableSubFilters.map((subFilterModule) => ({
                  id: subFilterModule.id,
                  label: t(
                    subFilterModule.labelKey as "filters.24.subFilters.purchaseDate",
                  ),
                }))}
                onSelectOption={(selectedId) => {
                  const matchedModule = availableSubFilters.find(
                    (subFilterModule) => subFilterModule.id === selectedId,
                  );
                  if (!matchedModule) {
                    return;
                  }
                  addSubFilter(matchedModule.id);
                  setIsPopoverOpened(false);
                }}
              />
            )}
          </Popover.Content>
        </Popover>
      ) : null}
    </>
  );
};
