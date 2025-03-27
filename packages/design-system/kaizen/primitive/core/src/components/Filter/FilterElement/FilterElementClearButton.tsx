import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";

import { filterElementBtnClasses, filterElementClasses } from "./constants";

type FilterElementClearButtonProps = {
  onClear: () => void;
};

const FilterElementClearButton: React.FC<FilterElementClearButtonProps> = ({
  onClear,
}) => (
  <li className={filterElementClasses()}>
    <Button
      className={classNames(filterElementBtnClasses, "!rounded-l-[0]")}
      color="default"
      intent="flat"
      size="md"
      iconLeft="x-close"
      aria-label="Clear filters"
      onClick={onClear}
    />
  </li>
);

export default FilterElementClearButton;
