import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";

import {
  FILTER_MENU_MAX_HEIGHT,
  filterElementBtnClasses,
  filterElementClasses,
} from "./constants";

type FilterElementSelectFieldProps = {
  displayEntireFilter: boolean;
  fields: {
    [key: string]: {
      id: string;
      label: string;
      availableFilters: string[];
      values: { id: string; label: string }[];
      multiSelect: boolean;
    };
  };
  label: string;
  openedByDefault: boolean;
  selectedField: string | null;
  selectedValues: string[] | null;
  onSelectOption: (fieldId: string) => void;
};

const FilterElementSelectField: React.FC<FilterElementSelectFieldProps> = ({
  displayEntireFilter,
  fields,
  label,
  openedByDefault,
  selectedField,
  selectedValues,
  onSelectOption,
}) => (
  <li className={filterElementClasses()}>
    <Popover opened={openedByDefault}>
      <Popover.Anchor>
        {({ isPopoverOpened, setIsPopoverOpened }) => (
          <Button
            className={classNames(filterElementBtnClasses, {
              "!rounded-r-[0]": selectedField,
            })}
            label={selectedField ? fields[selectedField].label : label}
            color="default"
            intent="flat"
            size="md"
            iconLeft="filter-lines"
            onClick={() =>
              (!displayEntireFilter || isPopoverOpened) &&
              setIsPopoverOpened((prev) => !prev)
            }
          />
        )}
      </Popover.Anchor>
      <Popover.Content
        placement="bottom-left"
        maxHeightPx={FILTER_MENU_MAX_HEIGHT}
      >
        {({ setIsPopoverOpened }) => {
          const items = !selectedField
            ? Object.keys(fields).map((fieldId) => ({
                id: fieldId,
                label: fields[fieldId].label,
              }))
            : fields[selectedField].values.map((value) => ({
                id: value.id,
                label: value.label,
              }));

          const handleSelectOption = (fieldId: string) => {
            onSelectOption(fieldId);
            if (selectedField && !fields[selectedField].multiSelect) {
              setIsPopoverOpened(false);
            }
          };

          return (
            <Menu
              items={items}
              multiSelect={
                selectedField ? fields[selectedField].multiSelect : false
              }
              onSelectOption={handleSelectOption}
              selectedValues={selectedValues || []}
            />
          );
        }}
      </Popover.Content>
    </Popover>
  </li>
);

export default FilterElementSelectField;
