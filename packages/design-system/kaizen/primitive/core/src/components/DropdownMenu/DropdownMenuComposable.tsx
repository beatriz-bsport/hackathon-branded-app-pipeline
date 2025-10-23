import { type JSX, useCallback, useRef, useState } from "react";

import Popover from "#src/components/Popover";

import type { DropdownMenuComposableProps } from "./DropdownMenu";
import { DropdownMenuContext } from "./DropdownMenuContext";

/**
 * DropdownMenuComposable - Internal component for composable API
 * This component handles the modern composable API with context
 */
export function DropdownMenuComposable(
  props: DropdownMenuComposableProps,
): JSX.Element {
  const {
    className,
    children,
    multiSelect = false,
    onSelectItem,
    defaultSelectedValues = [],
    selectedValues: controlledSelectedValues,
    onSelectedValuesChange,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedValues, setInternalSelectedValues] = useState<
    string[]
  >(defaultSelectedValues);
  const [searchValue, setSearchValue] = useState("");

  const closePopoverRef = useRef<(() => void) | null>(null);

  const isControlled = controlledSelectedValues !== undefined;

  const selectedValues = isControlled
    ? controlledSelectedValues
    : internalSelectedValues;

  const setSelectedValues = (values: string[]) => {
    if (!isControlled) {
      setInternalSelectedValues(values);
    }
    if (onSelectedValuesChange) {
      onSelectedValuesChange(values);
    }
  };

  const closePopover = useCallback(() => {
    if (closePopoverRef.current) {
      closePopoverRef.current();
    }
  }, []);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedValues,
        setSelectedValues,
        multiSelect,
        onSelectItem,
        searchValue,
        setSearchValue,
        closePopover,
        closePopoverRef,
      }}
    >
      <Popover className={className}>{children}</Popover>
    </DropdownMenuContext.Provider>
  );
}
