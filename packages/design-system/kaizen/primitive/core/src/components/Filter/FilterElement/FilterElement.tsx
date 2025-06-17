import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import FilterElementClearButton from "./FilterElementClearButton";
import FilterElementSelectField from "./FilterElementSelectField";
import FilterElementTypeSelector from "./FilterElementTypeSelector";
import FilterElementValues from "./FilterElementValues";

export type FilterElementProps = {
  filters: {
    id: string;
    label: string;
  }[];
  fields: {
    [key: string]: {
      id: string;
      label: string;
      availableFilters: string[];
      values: { id: string; label: string }[];
      multiSelect: boolean;
    };
  };
  selectFieldLabel: string;
  openedByDefault: boolean;
  onFilterElementChange: (
    field: string,
    filter: string,
    valueIds: string[],
  ) => void;
  onClear: () => void;
  ref?: React.Ref<{ resetFilters: () => void }>;
};

/**
 * It's a component that renders a single filter element, which is a part of the filter component.
 * It consists of a button that displays the currently selected filter, a dropdown menu that allows
 * the user to select a filter type, and a list of values that can be selected for the chosen filter type.
 * The component also renders a button to clear the filter element.
 * @param filters An array of objects that represent the available filters.
 * @param fields An object that represents the available fields.
 * @param selectFieldLabel The label to display for the select field.
 * @param openedByDefault A boolean that indicates whether the filter element should be opened by default.
 * @param onFilterElementChange A function that is called when a filter element is changed.
 * @param onClear A function that is called when the clear button is clicked.
 * @param ref A ref object to access the resetFilters method.
 */
const FilterElement: React.FC<FilterElementProps> = ({
  filters,
  fields,
  selectFieldLabel,
  openedByDefault,
  onFilterElementChange,
  onClear,
  ref,
}) => {
  const [displayEntireFilter, setDisplayEntireFilter] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[] | null>(null);

  useEffect(() => {
    if (selectedField && selectedFilter && selectedValues) {
      onFilterElementChange?.(selectedField, selectedFilter, selectedValues);
    }
  }, [selectedField, selectedFilter, selectedValues]);

  const handleSelectFieldSelectOption = useCallback(
    (fieldId: string, shouldDisplayEntireFilter: boolean) => {
      if (!selectedField || !shouldDisplayEntireFilter) {
        setSelectedField(fieldId);
        setSelectedValues(null);
        setSelectedFilter(fields[fieldId].availableFilters[0]);
        setDisplayEntireFilter(false);
        return;
      }

      setDisplayEntireFilter(true);

      if (!fields[selectedField].multiSelect) {
        setSelectedValues([fieldId]);
        return;
      }

      setSelectedValues((prevState) =>
        prevState && prevState.includes(fieldId)
          ? prevState!.filter((selected) => selected !== fieldId)
          : [...(prevState ?? []), fieldId],
      );
    },
    [fields, selectedField],
  );

  const handleClear = useCallback(() => {
    setSelectedField(null);
    setDisplayEntireFilter(false);
    onClear?.();
  }, [onClear]);

  // Expose resetFilters method through ref
  useImperativeHandle(ref, () => ({ resetFilters: handleClear }), [
    handleClear,
  ]);

  return (
    <ol className="inline-flex">
      <FilterElementSelectField
        fields={fields}
        label={selectFieldLabel}
        openedByDefault={openedByDefault}
        selectedField={selectedField}
        selectedValues={selectedValues}
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
        onSelectOption={setSelectedValues}
      />
      {selectedField && <FilterElementClearButton onClear={handleClear} />}
    </ol>
  );
};

export default FilterElement;
