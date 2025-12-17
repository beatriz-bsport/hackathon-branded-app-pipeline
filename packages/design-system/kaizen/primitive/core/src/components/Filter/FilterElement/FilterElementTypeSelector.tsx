import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";

import {
  FILTER_MENU_MAX_HEIGHT,
  filterElementBtnClasses,
  filterElementClasses,
} from "./constants";

type FilterElementTypeSelectorProps = {
  filters: {
    id: string;
    label: string;
  }[];
  selectedFilter: string;
  availableFilters: string[];
  onSelectFilter: (filterId: string) => void;
};

const FilterElementTypeSelector: React.FC<FilterElementTypeSelectorProps> = ({
  filters,
  selectedFilter,
  availableFilters,
  onSelectFilter,
}) => (
  <li className={filterElementClasses()}>
    <DropdownMenu
      target={({ setIsPopoverOpened }) => (
        <Button
          className={classNames(filterElementBtnClasses, "!rounded-[0]")}
          label={
            filters.find((f) => f.id === selectedFilter)?.label ||
            availableFilters[0]
          }
          color="default"
          intent="flat"
          size="md"
          onClick={() => setIsPopoverOpened((prev) => !prev)}
        />
      )}
      placement="bottom-left"
      maxHeightPx={FILTER_MENU_MAX_HEIGHT}
      items={availableFilters.map((filterId) => {
        const filter = filters.find((f) => f.id === filterId);
        return {
          id: filterId,
          label: filter?.label || "",
        };
      })}
      onSelectOption={({ id, setIsPopoverOpened }) => {
        onSelectFilter(id);
        setIsPopoverOpened(false);
      }}
    />
  </li>
);

FilterElementTypeSelector.displayName = "KaizenFilterElementTypeSelector";

export default FilterElementTypeSelector;
