import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import { FilterField } from "#src/components/Filter/types";
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
    [key: string]: FilterField;
  };
  onSelectOption: (itemId: string) => void;
  cachedValues?: Record<string, string>;
};

const FilterElementValues: React.FC<FilterElementValuesProps> = ({
  displayEntireFilter,
  selectedField,
  selectedValues,
  fields,
  onSelectOption,
  cachedValues = {},
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  const getFieldByValueId = (valueId: string) => {
    if (!selectedField) {
      return null;
    }
    const currentValue = fields[selectedField].values.find(
      (value) => value.id === valueId,
    );

    if (currentValue) {
      return { id: currentValue.id, label: currentValue.label };
    }
    if (cachedValues[valueId]) {
      return { id: valueId, label: cachedValues[valueId] };
    }
    return null;
  };

  const getItems = () => {
    if (!selectedField) {
      return [];
    }

    if (
      !fields[selectedField].multiSelect ||
      !fields[selectedField].searchConfig
    ) {
      return fields[selectedField].values.map((value) => ({
        id: value.id,
        label: value.label,
      }));
    }

    // For multi-select with search, show selected items at the top
    const items = [];
    if (!!selectedValues && selectedValues.length > 0) {
      items.push(
        ...selectedValues
          .map((valueId) => getFieldByValueId(valueId))
          .filter((value) => value !== null),
      );
      items.push({ type: "divider" as const });
    }
    items.push(
      ...fields[selectedField].values
        .filter((value) => !selectedValues?.includes(value.id))
        .map((value) => ({
          id: value.id,
          label: value.label,
        })),
    );

    return items.filter(Boolean);
  };

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
                ?.map((valueId) => getFieldByValueId(valueId)?.label)
                .filter(Boolean)
                .join(", ") || t("filter.selectFieldPlaceholder")
            }
            onClick={() => setIsPopoverOpened((prev) => !prev)}
          />
        )}
        placement="bottom-left"
        maxHeightPx={FILTER_MENU_MAX_HEIGHT}
        items={getItems()}
        multiSelect={selectedField ? fields[selectedField].multiSelect : false}
        selectedValues={selectedValues || []}
        onSelectOption={({ id, setIsPopoverOpened }) => {
          onSelectOption(id);

          if (selectedField && !fields[selectedField].multiSelect) {
            setIsPopoverOpened(false);
          }
        }}
        searchConfig={
          selectedField ? fields[selectedField].searchConfig : undefined
        }
      />
    </li>
  );
};

FilterElementValues.displayName = "KaizenFilterElementValues";
export default FilterElementValues;
