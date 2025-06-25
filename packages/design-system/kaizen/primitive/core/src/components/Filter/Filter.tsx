import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

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
  singleField?: boolean;
};

const FILTER_ELEMENTS_DEFAULT: FilterElementState[] = [
  { id: 0, field: null, filter: null, valueIds: [] },
];

const Filter = forwardRef<{ resetFilters: () => void }, FilterProps>(
  ({ onFilterChange, singleField, ...props }, ref) => {
    const [elementId, setElementId] = useState(1);
    const [filterElements, setFilterElements] = useState<FilterElementState[]>(
      FILTER_ELEMENTS_DEFAULT,
    );

    /**
     * The resetCounter is incremented each time resetFilters is called.
     * Including resetCounter in the FilterElement key forces React to re-mount each FilterElement,
     * ensuring all internal state in child components is fully reset when the parent resets filters.
     */
    const [resetCounter, setResetCounter] = useState(0);

    useImperativeHandle(
      ref,
      () => ({
        resetFilters: () => {
          setElementId(1);
          setFilterElements(FILTER_ELEMENTS_DEFAULT);
          setResetCounter((c) => c + 1);
          onFilterChange(FILTER_ELEMENTS_DEFAULT);
        },
      }),
      [onFilterChange],
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
        setFilterElements((prev) =>
          prev.map((element) =>
            element.id === id
              ? { ...element, field, filter, valueIds }
              : element,
          ),
        );
      },
      [],
    );

    const removeFilterElement = useCallback((id: number) => {
      setFilterElements((prev) => {
        const newFilterElements = prev.filter((element) => element.id !== id);
        return newFilterElements.length === 0
          ? FILTER_ELEMENTS_DEFAULT
          : newFilterElements;
      });
    }, []);

    useEffect(() => {
      if (filterElements.length === 0) {
        onFilterChange(FILTER_ELEMENTS_DEFAULT);
      } else {
        onFilterChange(filterElements);
      }
    }, [filterElements, onFilterChange]);

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
            key={`${element.id}-${resetCounter}`}
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
  },
);

Filter.displayName = "KaizenFilter";

export default Filter;
