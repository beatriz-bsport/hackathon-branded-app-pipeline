import React, { useCallback, useEffect, useState } from "react";

import { FilterField } from "#src/components/Filter/types";

import FilterElementClearButton from "./FilterElementClearButton";
import FilterElementSelectField from "./FilterElementSelectField";
import FilterElementTypeSelector from "./FilterElementTypeSelector";
import FilterElementValues from "./FilterElementValues";

export type FilterElementProps = {
  elementId: number;
  filters: {
    id: string;
    label: string;
  }[];
  fields: {
    [key: string]: FilterField;
  };
  selectFieldLabel: string;
  openedByDefault: boolean;
  field?: string | null;
  filter?: string | null;
  valueIds?: string[];
  onFilterElementChange: (
    id: number,
    field: string,
    filter: string,
    valueIds: string[],
  ) => void;
  onClear: () => void;
};

/**
 * It's a component that renders a single filter element, which is a part of the filter component.
 * It consists of a button that displays the currently selected filter, a dropdown menu that allows
 * the user to select a filter type, and a list of values that can be selected for the chosen filter type.
 * The component also renders a button to clear the filter element.
 * @param elementId The unique identifier for the filter element.
 * @param filters An array of objects that represent the available filters.
 * @param fields An object that represents the available fields.
 * @param selectFieldLabel The label to display for the select field.
 * @param openedByDefault A boolean that indicates whether the filter element should be opened by default.
 * @param onFilterElementChange A function that is called when a filter element is changed.
 * @param onClear A function that is called when the clear button is clicked.
 * @param ref A ref object to access the resetFilters method.
 */
const FilterElement: React.FC<FilterElementProps> = ({
  elementId,
  filters,
  fields,
  selectFieldLabel,
  openedByDefault,
  field: propField,
  filter: propFilter,
  valueIds: propValueIds,
  onFilterElementChange,
  onClear,
}) => {
  const [displayEntireFilter, setDisplayEntireFilter] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(
    propField ?? null,
  );
  const [selectedFilter, setSelectedFilter] = useState(propFilter ?? "");
  const [selectedValues, setSelectedValues] = useState<string[] | null>(
    propValueIds ?? null,
  );
  const [cachedValues, setCachedValues] = useState<Record<string, string>>({});

  const addNewCachedValueFromId = useCallback(
    (valueId: string) => {
      if (!selectedField) return;
      const field = fields[selectedField];
      if (!field) return;

      const value = field.values.find((v) => v.id === valueId);
      if (value) {
        setCachedValues((prev) => ({
          ...prev,
          [valueId]: value.label,
        }));
      }
    },
    [fields, selectedField],
  );

  const addNewCachedValuesFromIdsAndField = useCallback(
    (valueIds: string[], affectedField: string) => {
      if (!fields[affectedField]) return;
      const field = fields[affectedField];
      const newCachedValues = Object.fromEntries(
        field.values
          .filter((val) => valueIds.includes(val.id))
          .map((val) => [val.id, val.label]),
      );

      setCachedValues((prev) => ({
        ...prev,
        ...newCachedValues,
      }));
    },
    [fields],
  );

  // Sync internal state when props change (for responsive layout switches)
  useEffect(() => {
    if (propField !== undefined) {
      setSelectedField(propField);
    }
    if (propFilter !== undefined) {
      setSelectedFilter(propFilter ?? "");
    }
    if (propValueIds !== undefined) {
      setSelectedValues(propValueIds);
      if (propField) {
        addNewCachedValuesFromIdsAndField(propValueIds, propField);
      }
    }
    // Set displayEntireFilter based on whether we have values
    if (propField && propValueIds && propValueIds.length > 0) {
      setDisplayEntireFilter(true);
    }
  }, [addNewCachedValuesFromIdsAndField, propField, propFilter, propValueIds]);

  useEffect(() => {
    const hasUniqueCategory = Object.keys(fields).length === 1;

    if (hasUniqueCategory && selectedField === null) {
      const onlyKey = Object.keys(fields)[0];

      setSelectedField(onlyKey);
      setSelectedFilter(fields[onlyKey].availableFilters[0]);
    }
  }, [fields, selectedField]);

  useEffect(() => {
    if (selectedField && selectedFilter) {
      onFilterElementChange(
        elementId,
        selectedField,
        selectedFilter,
        selectedValues ?? [],
      );
    }
  }, [
    elementId,
    onFilterElementChange,
    selectedField,
    selectedFilter,
    selectedValues,
  ]);

  const handleSelectFieldSelectOption = useCallback(
    (fieldId: string, shouldDisplayEntireFilter: boolean) => {
      if (!selectedField || !shouldDisplayEntireFilter) {
        setSelectedField(fieldId);
        setSelectedValues(
          selectedValues && selectedValues.length > 0 ? [] : null,
        );
        setSelectedFilter(fields[fieldId].availableFilters[0]);
        setDisplayEntireFilter(false);
        setCachedValues({});
        return;
      }

      setDisplayEntireFilter(true);

      if (!fields[selectedField].multiSelect) {
        setSelectedValues([fieldId]);
        addNewCachedValueFromId(fieldId);
        return;
      }

      setSelectedValues((prevState) =>
        prevState && prevState.includes(fieldId)
          ? prevState!.filter((selected) => selected !== fieldId)
          : [...(prevState ?? []), fieldId],
      );
      addNewCachedValueFromId(fieldId);
    },
    [addNewCachedValueFromId, fields, selectedField, selectedValues],
  );

  const handleSelectValue = useCallback(
    (itemId: string) => {
      if (!selectedField) return;
      const field = fields[selectedField];
      if (!field) return;

      if (!field.multiSelect) {
        setSelectedValues([itemId]);
        addNewCachedValueFromId(itemId);
      } else {
        setSelectedValues((prev) => {
          const prevArr = prev ?? [];
          return prevArr.includes(itemId)
            ? prevArr.filter((id) => id !== itemId)
            : [...prevArr, itemId];
        });
        addNewCachedValueFromId(itemId);
      }
    },
    [addNewCachedValueFromId, fields, selectedField],
  );

  const handleClear = useCallback(() => {
    const hasUniqueCategory = Object.keys(fields).length === 1;
    setSelectedField(hasUniqueCategory ? Object.keys(fields)[0] : null);
    setDisplayEntireFilter(false);
    setSelectedValues(null);
    setCachedValues({});
    onClear?.();
  }, [fields, onClear]);

  // Compute whether there are trailing segments after the field selector
  const hasTrailingSegmentComputed =
    (displayEntireFilter && !!selectedField) ||
    (!!selectedField && Object.keys(fields).length > 1) ||
    !!selectedValues?.length;

  // Show clear button when:
  // - Multiple values are selected, OR
  // - A field is selected in multi-category mode (even without values)
  const shouldShowClearButton =
    (selectedValues && selectedValues.length > 0) ||
    (!!selectedField && Object.keys(fields).length > 1);

  return (
    <ol className="inline-flex">
      <FilterElementSelectField
        fields={fields}
        label={selectFieldLabel}
        openedByDefault={openedByDefault}
        selectedField={selectedField}
        selectedValues={selectedValues}
        hasTrailingSegment={hasTrailingSegmentComputed}
        onSelectOption={handleSelectFieldSelectOption}
      />
      {displayEntireFilter && selectedField && (
        <FilterElementTypeSelector
          filters={filters}
          selectedFilter={selectedFilter}
          availableFilters={
            fields[selectedField as keyof typeof fields].availableFilters
          }
          onSelectFilter={setSelectedFilter}
        />
      )}
      <FilterElementValues
        displayEntireFilter={displayEntireFilter}
        selectedField={selectedField}
        selectedValues={selectedValues}
        fields={fields}
        onSelectOption={handleSelectValue}
        cachedValues={cachedValues}
      />
      {shouldShowClearButton && (
        <FilterElementClearButton onClear={handleClear} />
      )}
    </ol>
  );
};
FilterElement.displayName = "KaizenFilterElement";
export default FilterElement;
