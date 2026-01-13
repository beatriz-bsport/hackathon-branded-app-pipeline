import classNames from "classnames";
import React, { useMemo, useState } from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import type { FilterField } from "#src/components/Filter/types";

import {
  FILTER_MENU_MAX_HEIGHT,
  filterElementBtnClasses,
  filterElementClasses,
} from "./constants";

type FilterElementSelectFieldProps = {
  fields: {
    [key: string]: FilterField;
  };
  label: string;
  openedByDefault: boolean;
  selectedField: string | null;
  selectedValues: string[] | null;
  hasTrailingSegment?: boolean;
  onSelectOption: (fieldId: string, shouldDisplayEntireFilter: boolean) => void;
};

type FilterType = "filter" | "values";

type FilterElementFieldState = {
  type: FilterType;
};

type OptionItem = {
  id: string;
  label: string;
};

const FilterElementSelectField: React.FC<FilterElementSelectFieldProps> = ({
  fields,
  label,
  openedByDefault,
  selectedField,
  selectedValues,
  hasTrailingSegment = false,
  onSelectOption,
}) => {
  const [menu, setMenu] = useState<FilterElementFieldState>({
    type: "filter",
  });

  const { filters, values } = useMemo(() => {
    const filters: Array<OptionItem> = [];
    const values: Record<string, Array<OptionItem>> = {};

    for (const [key, value] of Object.entries(fields)) {
      filters.push({ id: key, label: value.label });

      values[key] ||= [];

      values[key].push(
        ...value.values.map((val) => ({
          id: val.id,
          label: val.label,
        })),
      );
    }

    return { filters, values };
  }, [fields]);

  const items = menu.type === "filter" ? filters : values[selectedField!] || [];

  const isMultiSelect =
    menu.type === "values" && selectedField
      ? fields[selectedField].multiSelect
      : false;

  const currentSelectedValues =
    menu.type === "values" ? selectedValues || [] : [];

  return (
    <li
      data-component="Kaizen-Filter-Element-SelectField"
      className={filterElementClasses()}
    >
      <DropdownMenu
        defaultOpened={openedByDefault}
        target={({ setIsPopoverOpened, isPopoverOpened }) => {
          const handleButtonClick = () => {
            setIsPopoverOpened(!isPopoverOpened);

            const hasSelectedValues =
              selectedValues && selectedValues.length > 0;

            if (selectedField && !hasSelectedValues) {
              setMenu({ type: "values" });
              return;
            }

            if (Object.keys(fields).length === 1) {
              setMenu({ type: "values" });
            } else {
              setMenu({ type: "filter" });
            }
          };

          return (
            <Button
              className={classNames(filterElementBtnClasses, {
                "!rounded-r-[0]": hasTrailingSegment,
              })}
              label={selectedField ? fields[selectedField].label : label}
              color="default"
              intent="flat"
              size="md"
              iconLeft="filter-lines"
              onClick={handleButtonClick}
            />
          );
        }}
        items={items}
        multiSelect={isMultiSelect}
        selectedValues={currentSelectedValues}
        onSelectOption={({ id, setIsPopoverOpened }) => {
          if (menu.type === "filter") {
            onSelectOption(id, false);
            setMenu({ type: "values" });
          } else {
            onSelectOption(id, true);

            if (selectedField && !fields[selectedField].multiSelect) {
              setIsPopoverOpened(false);
            }
          }
        }}
        placement="bottom-left"
        maxHeightPx={FILTER_MENU_MAX_HEIGHT}
        searchConfig={
          menu.type === "values" && selectedField
            ? fields[selectedField].searchConfig
            : undefined
        }
      />
    </li>
  );
};
FilterElementSelectField.displayName = "KaizenFilterElementSelectField";
export default FilterElementSelectField;
