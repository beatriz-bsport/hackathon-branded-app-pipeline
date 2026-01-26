import { useMemo } from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { FilterElementState, ResponsiveFilterProps } from "../types";

interface FilterRowProps {
  element: FilterElementState;
  index: number;
  fields: ResponsiveFilterProps["fields"];
  filters: ResponsiveFilterProps["filters"];
  onFieldChange: (index: number, fieldId: string) => void;
  onOperatorChange: (index: number, operatorId: string) => void;
  onValuesChange: (index: number, valueIds: string[]) => void;
  onDelete: () => void;
}

const FilterRow = ({
  element,
  index,
  fields,
  filters,
  onFieldChange,
  onOperatorChange,
  onValuesChange,
  onDelete,
}: FilterRowProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const selectedField = element.field ? fields[element.field] : null;

  const filterOptions = useMemo(
    () =>
      Object.entries(fields).map(([id, field]) => ({
        id,
        label: field.label,
      })),
    [fields],
  );

  const operatorOptions = useMemo(() => {
    const result = [];

    if (selectedField) {
      for (const filterId of selectedField.availableFilters) {
        const filter = filters.find((f) => f.id === filterId);

        if (filter) {
          result.push({ id: filter.id, label: filter.label });
        }
      }
    }

    return result;
  }, [selectedField, filters]);

  const valueOptions = useMemo(
    () =>
      selectedField
        ? selectedField.values.map((val) => ({
            id: val.id,
            label: val.label,
          }))
        : [],
    [selectedField],
  );

  const formatValueDisplay = useMemo(() => {
    if (element.valueIds.length === 0) {
      return t("filter.selectValuePlaceholder");
    }

    const labels = element.valueIds
      .map((id) => selectedField?.values.find((v) => v.id === id)?.label)
      .filter(Boolean);

    return labels.join(", ");
  }, [element.valueIds, selectedField?.values, t]);

  const isMultiSelect = selectedField?.multiSelect ?? false;

  const handleDropdownClick = (
    setIsPopoverOpened: (open: boolean | ((prev: boolean) => boolean)) => void,
  ) => {
    setIsPopoverOpened(true);
  };

  return (
    <div className="flex flex-col gap-xs">
      <div className="grid grid-cols-[1fr_auto] gap-xs">
        <DropdownMenu
          target={({ setIsPopoverOpened }) => {
            return (
              <Button
                color="main"
                intent="default"
                size="md"
                fullWidth
                iconLeft="filter-lines"
                label={
                  element.field
                    ? (selectedField?.label ??
                      t("filter.selectFieldPlaceholder"))
                    : t("filter.selectFieldPlaceholder")
                }
                onClick={() => {
                  handleDropdownClick(setIsPopoverOpened);
                }}
                iconRight="chevron-down"
              />
            );
          }}
          items={filterOptions}
          placement="bottom-left"
          onSelectOption={({ id: fieldId, setIsPopoverOpened }) => {
            onFieldChange(index, fieldId);
            setIsPopoverOpened(false);
          }}
          fullWidth
        />
        {element.field && (
          <Button
            color="main"
            intent="default"
            size="md"
            icon="trash-01"
            kind="icon-button"
            label={t("filter.deleteAriaLabel")}
            onClick={onDelete}
          />
        )}
      </div>

      {element.field && (
        <>
          <DropdownMenu
            target={({ setIsPopoverOpened }) => {
              return (
                <Button
                  color="main"
                  intent="default"
                  size="md"
                  fullWidth
                  label={
                    filters.find((f) => f.id === element.filter)?.label ||
                    t("filter.selectOperatorPlaceholder")
                  }
                  onClick={() => {
                    handleDropdownClick(setIsPopoverOpened);
                  }}
                  iconRight="chevron-down"
                />
              );
            }}
            items={operatorOptions}
            placement="bottom-left"
            onSelectOption={({ id: operatorId, setIsPopoverOpened }) => {
              onOperatorChange(index, operatorId);
              setIsPopoverOpened(false);
            }}
          />
          <div>
            <DropdownMenu
              target={({ setIsPopoverOpened }) => {
                return (
                  <Button
                    color="main"
                    intent="default"
                    size="md"
                    fullWidth
                    label={formatValueDisplay}
                    onClick={() => {
                      handleDropdownClick(setIsPopoverOpened);
                    }}
                    iconRight="chevron-down"
                  />
                );
              }}
              items={valueOptions}
              placement="bottom-left"
              multiSelect={isMultiSelect}
              selectedValues={element.valueIds}
              onSelectOption={({ id: valueId, setIsPopoverOpened }) => {
                if (isMultiSelect) {
                  onValuesChange(
                    index,
                    element.valueIds.includes(valueId)
                      ? element.valueIds.filter((id) => id !== valueId)
                      : [...element.valueIds, valueId],
                  );
                } else {
                  onValuesChange(index, [valueId]);
                  setIsPopoverOpened(false);
                }
              }}
              fullWidth
              searchConfig={selectedField?.searchConfig}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FilterRow;
