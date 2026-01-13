import { useCallback, useEffect, useRef, useState } from "react";

import type { MenuOption } from "#src/components/Menu";
import useDebounce from "#src/hooks/debounce";

type UseTextFieldStateProps = {
  debounceValue: number;
  defaultSelectedIds: string[];
  mapIdToOption: Map<string, MenuOption>;
  multiSelect: boolean;
  onValueChange?: (nextValue: string) => void;
  textFieldDefaultValue?: string;
};

export const useTextFieldState = ({
  debounceValue,
  defaultSelectedIds,
  mapIdToOption,
  multiSelect,
  onValueChange,
  textFieldDefaultValue,
}: UseTextFieldStateProps) => {
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  /**
   * Displayed text inside the TextField
   */
  const [textFieldValue, setTextFieldValue] = useState("");

  /**
   * Extract from default props the initial value for the TextField
   */
  const hasInitializedTextField = useRef(false);
  useEffect(() => {
    if (hasInitializedTextField.current) return;

    if (!multiSelect && defaultSelectedIds.length > 0) {
      const initialSelectedOption = mapIdToOption.get(defaultSelectedIds[0]);
      const initialLabel =
        initialSelectedOption?.label ?? textFieldDefaultValue;
      if (initialLabel) {
        setTextFieldValue(initialLabel);
        hasInitializedTextField.current = true;
        return;
      }
    }

    if (textFieldDefaultValue) {
      setTextFieldValue(textFieldDefaultValue);
      hasInitializedTextField.current = true;
      return;
    }
  }, [multiSelect, defaultSelectedIds, mapIdToOption, textFieldDefaultValue]);

  /**
   * Actual query string used in the search (local or remote)
   */
  const [searchedValue, setSearchedValue] = useState<string>("");

  /**
   * Track when the component is delaying the search, when
   * updating searchedValue with the current textfieldValue string
   */
  const [isDebouncing, setIsDebouncing] = useState(false);

  /**
   * Debounce the update of searchedValue of debounceValue in ms
   */
  const debouncedOnChange = useDebounce((value: string) => {
    // Propagate to the parent the new value
    onValueChange?.(value);

    // Update the search value
    setSearchedValue(value);

    // End debouncing state
    setIsDebouncing(false);
  }, debounceValue);

  /**
   * Handle the update of the value change in TextField input
   */
  const handleTextFieldChange = useCallback(
    (newValue: string) => {
      const inputValue = newValue || "";

      setIsDebouncing(true);
      setTextFieldValue(inputValue);
      debouncedOnChange(inputValue);
    },
    [debouncedOnChange],
  );

  /**
   * Clear both internal string state
   */
  const clearInput = () => {
    setTextFieldValue("");
    setSearchedValue("");
    onValueChange?.("");
  };

  return {
    textFieldValue,
    setTextFieldValue,
    searchedValue,
    setSearchedValue,
    isDebouncing,
    setIsDebouncing,
    clearInput,
    debouncedOnChange,
    handleTextFieldChange,
    textFieldRef,
  };
};
