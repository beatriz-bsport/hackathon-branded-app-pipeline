import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  type InternalNotesSubFilterField,
  type InternalNotesSubFilterId,
  internalNotesSubFilterFieldMap,
} from "../sub-filters/internal-notes-sub-filter-id";
import {
  REGISTERED_INTERNAL_NOTES_SUB_FILTERS,
  REGISTERED_INTERNAL_NOTES_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import type { InternalNotesFilterFormValue } from "../types";

type InternalNotesSubFiltersAreaProps = {
  fieldIds: Record<InternalNotesSubFilterField, string>;
  watchedFilterValue: InternalNotesFilterFormValue;
  errors: FieldErrors<InternalNotesFilterFormValue>;
  setValue: UseFormSetValue<InternalNotesFilterFormValue>;
};

/**
 * Renders the "filter specifications" region for the internal notes filter.
 */
export const InternalNotesSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: InternalNotesSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_INTERNAL_NOTES_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: InternalNotesSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: InternalNotesSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = internalNotesSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, createDefaultDateFilterValue(), {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule =
        REGISTERED_INTERNAL_NOTES_SUB_FILTERS_BY_ID[subFilterId];
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[internalNotesSubFilterFieldMap[subFilterId]] ??
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
        {t("filters.104.fields.filterSpecifications")}
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
                label={t("filters.104.actions.addSubFilter")}
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
                    subFilterModule.labelKey as "filters.104.subFilters.noteCreationDate",
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
