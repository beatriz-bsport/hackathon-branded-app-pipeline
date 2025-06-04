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

type FilterElementValuesProps = {
  displayEntireFilter: boolean;
  selectedField: string | null;
  selectedValues: string[] | null;
  fields: {
    [key: string]: {
      id: string;
      label: string;
      availableFilters: string[];
      values: { id: string; label: string }[];
      multiSelect: boolean;
    };
  };
  onSelectOption: (itemIds: string[]) => void;
};

const FilterElementValues: React.FC<FilterElementValuesProps> = ({
  displayEntireFilter,
  selectedField,
  selectedValues,
  fields,
  onSelectOption,
}) => {
  if (!displayEntireFilter) return null;

  const handleSelectOption = (
    itemId: string,
    setIsPopoverOpened: (prev: boolean) => void,
  ) => {
    if (selectedField && !fields[selectedField].multiSelect) {
      onSelectOption([itemId]);
      setIsPopoverOpened(false);
    } else {
      const newValues = selectedValues ? [...selectedValues] : [];
      if (newValues.includes(itemId)) {
        newValues.splice(newValues.indexOf(itemId), 1);
      } else {
        newValues.push(itemId);
      }
      onSelectOption(newValues);
    }
  };

  return (
    <li className={filterElementClasses()}>
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              className={classNames(
                filterElementBtnClasses,
                "!rounded-[0] max-w-[160px] overflow-ellipsis overflow-hidden text-nowrap !inline",
              )}
              color="default"
              intent="flat"
              size="md"
              iconLeft={!selectedValues?.length ? "dots-horizontal" : undefined}
              label={selectedValues
                ?.map(
                  (valueId) =>
                    selectedField &&
                    fields[selectedField].values.find(
                      (value) => value.id === valueId,
                    )?.label,
                )
                .join(", ")}
              onClick={() => setIsPopoverOpened((prev) => !prev)}
            />
          )}
        </Popover.Anchor>
        <Popover.Content
          placement="bottom-left"
          maxHeightPx={FILTER_MENU_MAX_HEIGHT}
        >
          {({ setIsPopoverOpened }) => (
            <Menu
              items={
                selectedField
                  ? fields[selectedField].values.map((value) => ({
                      id: value.id,
                      label: value.label,
                    }))
                  : []
              }
              multiSelect={
                selectedField ? fields[selectedField].multiSelect : false
              }
              onSelectOption={(itemId: string) =>
                handleSelectOption(itemId, setIsPopoverOpened)
              }
              selectedValues={selectedValues || []}
            />
          )}
        </Popover.Content>
      </Popover>
    </li>
  );
};

export default FilterElementValues;
