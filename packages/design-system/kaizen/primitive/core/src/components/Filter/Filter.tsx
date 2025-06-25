import React, { useCallback, useMemo, useState } from "react";

import Button from "#src/components/Button";
import FilterElement from "#src/components/Filter/FilterElement";

export type FilterElementState = {
  id: number;
  field: string | null;
  filter: string | null;
  valueIds: string[];
};

export type FilterField = {
  id: string;
  label: string;
  availableFilters: string[];
  values: { id: string; label: string }[];
  multiSelect: boolean;
};

export type FilterProps = {
  filters: {
    id: string;
    label: string;
  }[];
  fields: {
    [key: string]: FilterField;
  };
  selectFieldLabel: string;
  onFilterChange: (filters: FilterElementState[]) => void;
  ref?: React.Ref<{ resetFilters: () => void }>;
  singleField?: boolean;
};

const FILTER_ELEMENTS_DEFAULT = [
  { id: 0, field: null, filter: null, valueIds: [] },
];

/**
 * Rendering a customizable list of filter items within an ordered list.
 * Provides a flexible way to display filters with optional left and right icons, labels,
 * and dropdown menus for further filtering options.
 * The component maintains its visual state internally, while external state control
 * is facilitated through props callbacks. The number of filter elements is infinite.
 * @param props.filters An array of filter objects, each containing an id and label.
 * @param props.fields An object of field objects, each containing an id, label, available filters,
 * @param props.selectFieldLabel The label to display for the select field.
 * @param props.onFilterChange A function that is called when the filter elements are changed.
 * @param props.ref A ref object to access the resetFilters method.
 * @param props.singleField Whether only one field can be filtered at the time
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-filter--docs
 */
const Filter: React.FC<FilterProps> = ({
  onFilterChange,
  singleField,
  ...props
}) => {
  const [elementId, setElementId] = useState(1);
  const [filterElements, setFilterElements] = useState<FilterElementState[]>(
    FILTER_ELEMENTS_DEFAULT,
  );

  const addFilter = useCallback(() => {
    setFilterElements((prev) => [
      ...prev,
      { id: elementId, field: null, filter: null, valueIds: [] },
    ]);
    setElementId((prev) => prev + 1);
  }, [elementId]);

  const updateFilterElement = useCallback(
    (id: number, field: string, filter: string, valueIds: string[]) => {
      setFilterElements((prev) => {
        const updatedFilters = prev.map((element) =>
          element.id === id ? { ...element, field, filter, valueIds } : element,
        );
        onFilterChange(updatedFilters);
        return updatedFilters;
      });
    },
    [onFilterChange],
  );

  const removeFilterElement = useCallback(
    (id: number) => {
      setFilterElements((prev) => {
        const newFilterElements = prev.filter((element) => element.id !== id);

        if (newFilterElements.length === 0) {
          onFilterChange(FILTER_ELEMENTS_DEFAULT);
          return FILTER_ELEMENTS_DEFAULT;
        }

        onFilterChange(newFilterElements);
        return newFilterElements;
      });
    },
    [onFilterChange],
  );

  const isEveryFilterComplete = useMemo(
    () =>
      filterElements.every(
        (element) =>
          element.field !== null &&
          element.filter !== null &&
          element.valueIds.length > 0,
      ),
    [filterElements],
  );

  return (
    <div className="flex flex-wrap gap-2xs">
      {filterElements.map((element) => (
        <FilterElement
          key={element.id}
          elementId={element.id}
          openedByDefault={filterElements.length > 1}
          onFilterElementChange={updateFilterElement}
          onClear={() => removeFilterElement(element.id)}
          {...props}
        />
      ))}
      {isEveryFilterComplete && !singleField && (
        <Button
          color="default"
          intent="flat"
          size="md"
          iconLeft="filter-lines"
          aria-label="Add filter"
          onClick={addFilter}
        />
      )}
    </div>
  );
};

Filter.displayName = "KaizenFilter";

export default Filter;
