import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import {
  type ReferredMembersSubFilterField,
  type ReferredMembersSubFilterId,
  referredMembersSubFilterFieldMap,
} from "../sub-filters/referred-members-sub-filter-id";
import {
  REGISTERED_REFERRED_MEMBERS_SUB_FILTERS,
  REGISTERED_REFERRED_MEMBERS_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { ReferredMembersFilterFormValue } from "../types";

type ReferredMembersSubFiltersAreaProps = {
  fieldIds: Record<ReferredMembersSubFilterField, string>;
  watchedFilterValue: ReferredMembersFilterFormValue;
  errors: FieldErrors<ReferredMembersFilterFormValue>;
  setValue: UseFormSetValue<ReferredMembersFilterFormValue>;
};

/**
 * Renders the "filter specifications" region for the referred members filter.
 */
export const ReferredMembersSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: ReferredMembersSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_REFERRED_MEMBERS_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: ReferredMembersSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: ReferredMembersSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = referredMembersSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, defaultNumericComparatorFilterValue, {
      shouldDirty: true,
    });
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.30.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const subFilterModule =
          REGISTERED_REFERRED_MEMBERS_SUB_FILTERS_BY_ID[subFilterId];
        if (!subFilterModule) {
          return null;
        }
        const Section = subFilterModule.Section;
        const sectionId =
          fieldIds[referredMembersSubFilterFieldMap[subFilterId]] ??
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
                label={t("filters.30.actions.addSubFilter")}
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
                    subFilterModule.labelKey as "filters.30.subFilters.moneyObtained",
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
