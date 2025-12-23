import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { filterElementBtnClasses, filterElementClasses } from "./constants";

type FilterElementClearButtonProps = {
  onClear: () => void;
};

const FilterElementClearButton: React.FC<FilterElementClearButtonProps> = ({
  onClear,
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  return (
    <li
      data-component="Kaizen-Filter-Element-ClearButton"
      className={filterElementClasses()}
    >
      <Button
        kind="icon-button"
        className={classNames(filterElementBtnClasses, "!rounded-l-[0]")}
        color="default"
        intent="flat"
        size="md"
        icon="x-close"
        label={t("filter.clearAriaLabel")}
        onClick={onClear}
      />
    </li>
  );
};

export default FilterElementClearButton;
