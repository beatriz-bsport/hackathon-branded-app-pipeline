import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import {
  type PassSubFilterField,
  type PassSubFilterId,
  passSubFilterFielMap,
} from "../sub-filters/pass-sub-filter-id";
import {
  REGISTERED_PASS_SUB_FILTERS,
  REGISTERED_PASS_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

type PassesFilterSubFiltersAreaProps = {
  fieldIds: Record<PassSubFilterField, string>;
  watchedFilterValue: PassesFilterFormValue;
  errors: FieldErrors<PassesFilterFormValue>;
  setValue: UseFormSetValue<PassesFilterFormValue>;
  selectedPassesInvalid: boolean;
};

/**
 * Renders the "filter specifications" region: active sub-filter cards, add
 * control, and wiring to reset slots when a sub-filter is removed.
 */
export const PassesFilterSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
  selectedPassesInvalid,
}: PassesFilterSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_PASS_SUB_FILTERS.filter(
    (passSubFilterModule) =>
      !watchedFilterValue.subFilters.includes(passSubFilterModule.id),
  );

  const addSubFilter = (subFilterId: PassSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: PassSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = passSubFilterFielMap[subFilterId];
    const resetValue =
      fieldToReset === "creditLeft"
        ? defaultNumericComparatorFilterValue
        : createDefaultDateFilterValue();
    setValue(fieldToReset, resetValue, {
      shouldDirty: true,
    });
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.19.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const passSubFilterModule =
          REGISTERED_PASS_SUB_FILTERS_BY_ID[subFilterId];
        if (!passSubFilterModule) {
          return null;
        }
        const Section = passSubFilterModule.Section;
        const sectionId =
          fieldIds[passSubFilterFielMap[subFilterId]] ??
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
                label={t("filters.19.actions.addSubFilter")}
                onClick={() => setIsPopoverOpened(true)}
                disabled={selectedPassesInvalid}
              />
            )}
          </Popover.Anchor>
          <Popover.Content placement="bottom-left">
            {({ setIsPopoverOpened }) => (
              <Menu
                items={availableSubFilters.map((passSubFilterModule) => ({
                  id: passSubFilterModule.id,
                  label: t(
                    passSubFilterModule.labelKey as
                      | "filters.19.subFilters.purchaseDate"
                      | "filters.19.subFilters.expirationDate"
                      | "filters.19.subFilters.creditLeft",
                  ),
                }))}
                onSelectOption={(selectedId) => {
                  const matchedModule = availableSubFilters.find(
                    (passSubFilterModule) =>
                      passSubFilterModule.id === selectedId,
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
