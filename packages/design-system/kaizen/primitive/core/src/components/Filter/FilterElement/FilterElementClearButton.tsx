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
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return (
    <li className={filterElementClasses()}>
      <Button
        className={classNames(filterElementBtnClasses, "!rounded-l-[0]")}
        color="default"
        intent="flat"
        size="md"
        iconLeft="x-close"
        aria-label={t("filter.clearAriaLabel")}
        onClick={onClear}
      />
    </li>
  );
};

export default FilterElementClearButton;
