import classNames from "classnames";
import React, { useEffect, useState } from "react";

import Button from "#src/components/Button";
import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";

import {
  FILTER_MENU_MAX_HEIGHT,
  filterElementBtnClasses,
  filterElementClasses,
} from "./constants";

type FilterElementSelectFieldProps = {
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
  onSelectOption: (fieldId: string, shouldDisplayEntireFilter: boolean) => void;
};

const FilterElementSelectField: React.FC<FilterElementSelectFieldProps> = ({
  fields,
  label,
  openedByDefault,
  selectedField,
  selectedValues,
  onSelectOption,
}) => {
  const [menu, setMenu] = useState({
    type: "filter",
    items: Object.keys(fields).map((fieldId) => ({
      id: fieldId,
      label: fields[fieldId].label,
    })),
  });

  useEffect(() => {
    if (selectedField) {
      setMenu({
        type: "values",
        items: fields[selectedField].values.map((value) => ({
          id: value.id,
          label: value.label,
        })),
      });
    }
  }, [fields, selectedField, selectedValues]);

  return (
    <li className={filterElementClasses()}>
      <Popover opened={openedByDefault}>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              className={classNames(filterElementBtnClasses, {
                "!rounded-r-[0]": selectedField,
              })}
              label={selectedField ? fields[selectedField].label : label}
              color="default"
              intent="flat"
              size="md"
              iconLeft="filter-lines"
              onClick={() => {
                setIsPopoverOpened((prev) => !prev);
                setMenu({
                  type: "filter",
                  items: Object.keys(fields).map((fieldId) => ({
                    id: fieldId,
                    label: fields[fieldId].label,
                  })),
                });
              }}
            />
          )}
        </Popover.Anchor>
        <Popover.Content
          placement="bottom-left"
          maxHeightPx={FILTER_MENU_MAX_HEIGHT}
        >
          {({ setIsPopoverOpened }) => {
            const handleSelectOption = (fieldId: string) => {
              onSelectOption(fieldId, menu.type === "values");
              if (
                menu.type === "values" &&
                selectedField &&
                !fields[selectedField].multiSelect
              ) {
                setIsPopoverOpened(false);
              }
            };

            return (
              <Menu
                items={menu.items}
                multiSelect={
                  selectedField && menu.type === "values"
                    ? fields[selectedField].multiSelect
                    : false
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
};
export default FilterElementSelectField;
