import {
  forwardRef,
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import Button from "#src/components/Button";
import FilterElement from "#src/components/Filter/FilterElement";
import { useMatchMedia } from "#src/hooks/use-match-media";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { ResponsiveFilter } from "./ResponsiveFilter";
import type { FilterElementState, FilterField, FilterProps } from "./types";

export type { FilterElementState, FilterField, FilterProps };

const FILTER_ELEMENTS_DEFAULT: FilterElementState[] = [
  { id: 0, field: null, filter: null, valueIds: [] },
];

const Filter = forwardRef<{ resetFilters: () => void }, FilterProps>(
  ({ onFilterChange, singleField, defaultFilters, ...props }, ref) => {
    const isMobile = !useMatchMedia("sm");
    const i18nInstance = useKaizenI18nInstance();
    const { t } = useTranslation("default", { i18n: i18nInstance });

    const [filterElements, setFilterElements] = useState<FilterElementState[]>(
      defaultFilters && defaultFilters.length > 0
        ? defaultFilters
        : FILTER_ELEMENTS_DEFAULT,
    );
    const nextIdRef = useRef(
      Math.max(...(defaultFilters?.map((f) => f.id) || [0])) + 1,
    );

    /**
     * The version is incremented each time resetFilters is called.
     * Including version in the FilterElement key forces React to re-mount each FilterElement,
     * ensuring all internal state in child components is fully reset when the parent resets filters.
     */
    const [version, setVersion] = useState(0);

    const onFilterElementChange = useEffectEvent(
      (filters: FilterElementState[]) => {
        const ensured =
          filters.length === 0 ? FILTER_ELEMENTS_DEFAULT : filters;
        onFilterChange(ensured);
      },
    );

    // Notify parent when filterElements changes (moved to effect to avoid infinite loop)
    useEffect(() => {
      onFilterElementChange(filterElements);
    }, [filterElements]);

    const addFilter = useCallback(() => {
      setFilterElements((prev) => [
        ...prev,
        { id: nextIdRef.current++, field: null, filter: null, valueIds: [] },
      ]);
    }, []);

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

    const resetFilters = () => {
      nextIdRef.current = 1;
      setVersion((v) => v + 1);
      setFilterElements(FILTER_ELEMENTS_DEFAULT);
    };

    useImperativeHandle(
      ref,
      () => ({
        resetFilters: () => {
          resetFilters();
        },
      }),
      [],
    );

    const isEveryFilterComplete = filterElements.every(
      (element) =>
        element.field !== null &&
        element.filter !== null &&
        element.valueIds.length > 0,
    );

    if (isMobile) {
      return (
        <ResponsiveFilter
          {...props}
          filterElements={filterElements}
          setFilterElements={setFilterElements}
          resetFilters={resetFilters}
          singleField={singleField}
        />
      );
    }

    return (
      <div data-component="Kaizen-Filter" className="flex flex-wrap gap-2xs">
        {filterElements.map((element) => {
          const isEmpty =
            element.field === null &&
            element.filter === null &&
            element.valueIds.length === 0;

          // Only open if it's a newly added empty filter (not the initial one)
          const shouldOpen = isEmpty && filterElements.length > 1;

          return (
            <FilterElement
              key={`${element.id}-${version}`}
              elementId={element.id}
              field={element.field}
              filter={element.filter}
              valueIds={element.valueIds}
              openedByDefault={shouldOpen}
              onFilterElementChange={updateFilterElement}
              onClear={() => removeFilterElement(element.id)}
              {...props}
            />
          );
        })}
        {isEveryFilterComplete && !singleField && (
          <Button
            kind="icon-button"
            color="default"
            intent="flat"
            size="md"
            icon="filter-lines"
            label={t("filter.addAriaLabel")}
            onClick={addFilter}
          />
        )}
      </div>
    );
  },
);

Filter.displayName = "KaizenFilter";

export default Filter;
