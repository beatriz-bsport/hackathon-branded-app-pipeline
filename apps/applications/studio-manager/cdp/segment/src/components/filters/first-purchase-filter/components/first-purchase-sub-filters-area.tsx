import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  type FirstPurchaseSubFilterField,
  type FirstPurchaseSubFilterId,
  firstPurchaseSubFilterFieldMap,
} from "../sub-filters/first-purchase-sub-filter-id";
import {
  REGISTERED_FIRST_PURCHASE_SUB_FILTERS,
  REGISTERED_FIRST_PURCHASE_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { FirstPurchaseFilterFormValue } from "../types";

type FirstPurchaseSubFiltersAreaProps = {
  fieldIds: Record<FirstPurchaseSubFilterField, string>;
  watchedFilterValue: FirstPurchaseFilterFormValue;
  errors: FieldErrors<FirstPurchaseFilterFormValue>;
  setValue: UseFormSetValue<FirstPurchaseFilterFormValue>;
};

/**
 * Renders the "filter specifications" region for the first purchase filter.
 */
export const FirstPurchaseSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: FirstPurchaseSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_FIRST_PURCHASE_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: FirstPurchaseSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: FirstPurchaseSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = firstPurchaseSubFilterFieldMap[subFilterId];
    const resetValue =
      fieldToReset === "purchaseAmount"
        ? defaultNumericComparatorFilterValue
        : createDefaultDateFilterValue();
    setValue(fieldToReset, resetValue, {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule =
        REGISTERED_FIRST_PURCHASE_SUB_FILTERS_BY_ID[subFilterId];
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[firstPurchaseSubFilterFieldMap[subFilterId]] ??
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
        {t("filters.28.fields.filterSpecifications")}
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
                label={t("filters.28.actions.addSubFilter")}
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
                    subFilterModule.labelKey as
                      | "filters.28.subFilters.purchaseDate"
                      | "filters.28.subFilters.purchaseAmount",
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
