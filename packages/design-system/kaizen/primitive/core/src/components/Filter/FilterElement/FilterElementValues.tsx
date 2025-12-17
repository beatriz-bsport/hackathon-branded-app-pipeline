import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

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
  onSelectOption: (itemId: string) => void;
};

const FilterElementValues: React.FC<FilterElementValuesProps> = ({
  displayEntireFilter,
  selectedField,
  selectedValues,
  fields,
  onSelectOption,
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  if (!displayEntireFilter) {
    return null;
  }

  return (
    <li className={filterElementClasses()}>
      <DropdownMenu
        target={({ setIsPopoverOpened }) => (
          <Button
            className={classNames(
              filterElementBtnClasses,
              "!rounded-[0] max-w-[160px] overflow-ellipsis overflow-hidden text-nowrap !inline",
            )}
            color="default"
            intent="flat"
            size="md"
            label={
              selectedValues
                ?.map(
                  (valueId) =>
                    selectedField &&
                    fields[selectedField].values.find(
                      (value) => value.id === valueId,
                    )?.label,
                )
                .join(", ") || t("filter.selectFieldPlaceholder")
            }
            onClick={() => setIsPopoverOpened((prev) => !prev)}
          />
        )}
        placement="bottom-left"
        maxHeightPx={FILTER_MENU_MAX_HEIGHT}
        items={
          selectedField
            ? fields[selectedField].values.map((value) => ({
                id: value.id,
                label: value.label,
              }))
            : []
        }
        multiSelect={selectedField ? fields[selectedField].multiSelect : false}
        selectedValues={selectedValues || []}
        onSelectOption={({ id, setIsPopoverOpened }) => {
          onSelectOption(id);

          if (selectedField && !fields[selectedField].multiSelect) {
            setIsPopoverOpened(false);
          }
        }}
      />
    </li>
  );
};

FilterElementValues.displayName = "KaizenFilterElementValues";
export default FilterElementValues;
