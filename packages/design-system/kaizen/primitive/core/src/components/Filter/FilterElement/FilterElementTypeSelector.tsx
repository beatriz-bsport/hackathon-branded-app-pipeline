import React from "react";
import classNames from "classnames";
import Button from "#src/components/Button";
import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";
import { filterElementBtnClasses, filterElementClasses } from "./constants";

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
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
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
      </Popover.Anchor>
      <Popover.Content placement="bottom-left">
        {({ setIsPopoverOpened }) => (
          <Menu
            items={availableFilters.map((filterId) => {
              const filter = filters.find((f) => f.id === filterId);
              return {
                id: filterId,
                label: filter?.label || "",
              };
            })}
            onSelectOption={(valueId: string) => {
              onSelectFilter(valueId);
              setIsPopoverOpened(false);
            }}
          />
        )}
      </Popover.Content>
    </Popover>
  </li>
);

export default FilterElementTypeSelector;
