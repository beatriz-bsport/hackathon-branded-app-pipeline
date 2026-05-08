import type { FieldErrors, UseFormSetValue } from "react-hook-form";

import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { defaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import {
  PASS_SUB_FILTER_IDS,
  type PassSubFilterId,
} from "../sub-filters/pass-sub-filter-id";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { PassesFilterFormValue } from "../types";

type PassesFilterSubFiltersAreaProps = {
  fieldIds: { purchaseDate: string };
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
  const { t } = useTranslation("campaign-filters");

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
    if (subFilterId === PASS_SUB_FILTER_IDS.purchaseDate) {
      setValue("purchaseDate", defaultDateFilterValue, {
        shouldDirty: true,
      });
    }
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.19.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const passSubFilterModule = REGISTERED_PASS_SUB_FILTERS.find(
          (registeredModule) => registeredModule.id === subFilterId,
        );
        if (!passSubFilterModule) {
          return null;
        }
        const Section = passSubFilterModule.Section;
        const sectionId =
          subFilterId === PASS_SUB_FILTER_IDS.purchaseDate
            ? fieldIds.purchaseDate
            : `${subFilterId}-section`;

        return (
          <Section
            key={subFilterId}
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
                    passSubFilterModule.labelKey as "filters.19.subFilters.purchaseDate",
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
