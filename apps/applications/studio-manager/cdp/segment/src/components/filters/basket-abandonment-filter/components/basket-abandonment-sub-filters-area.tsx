import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import {
  type BasketAbandonmentSubFilterField,
  type BasketAbandonmentSubFilterId,
  basketAbandonmentSubFilterFieldMap,
} from "../sub-filters/basket-abandonment-sub-filter-id";
import {
  REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS,
  REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { BasketAbandonmentFilterFormValue } from "../types";

type BasketAbandonmentSubFiltersAreaProps = {
  fieldIds: Record<BasketAbandonmentSubFilterField, string>;
  watchedFilterValue: BasketAbandonmentFilterFormValue;
  errors: FieldErrors<BasketAbandonmentFilterFormValue>;
  setValue: UseFormSetValue<BasketAbandonmentFilterFormValue>;
};

/**
 * Renders the "filter specifications" region for the abandoned basket filter.
 */
export const BasketAbandonmentSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: BasketAbandonmentSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: BasketAbandonmentSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }

    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: BasketAbandonmentSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = basketAbandonmentSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, createDefaultDateFilterValue(), {
      shouldDirty: true,
    });
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.20.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const subFilterModule =
          REGISTERED_BASKET_ABANDONMENT_SUB_FILTERS_BY_ID[subFilterId];
        if (!subFilterModule) {
          return null;
        }
        const Section = subFilterModule.Section;
        const sectionId =
          fieldIds[basketAbandonmentSubFilterFieldMap[subFilterId]] ??
          `${subFilterId}-section`;

        return (
          <Section
            key={sectionId}
            id={sectionId}
            value={watchedFilterValue}
            errors={errors}
            setValue={setValue}
            onRemove={() => removeSubFilter(subFilterId)}
          />
        );
      })}

      {availableSubFilters.length > 0 ? (
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                iconLeft="plus"
                size="sm"
                intent="flat"
                color="default"
                label={t("filters.20.actions.addSubFilters")}
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
                    subFilterModule.labelKey as "filters.20.subFilters.abandonmentDate",
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
