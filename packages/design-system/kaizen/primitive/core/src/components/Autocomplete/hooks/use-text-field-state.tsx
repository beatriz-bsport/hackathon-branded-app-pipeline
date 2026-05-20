import { useCallback, useEffect, useRef, useState } from "react";

import type { MenuOption } from "#src/components/Menu";
import useDebounce from "#src/hooks/debounce";

type UseTextFieldStateProps = {
  debounceValue: number;
  value: string[];
  mapIdToOption: Map<string, MenuOption>;
  multiSelect: boolean;
  onValueChange?: (nextValue: string) => void;
  textFieldDefaultValue?: string;
  clearOnSelect: boolean;
};

export const useTextFieldState = ({
  debounceValue,
  value,
  mapIdToOption,
  multiSelect,
  onValueChange,
  textFieldDefaultValue,
  clearOnSelect,
}: UseTextFieldStateProps) => {
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  /**
   * Displayed text inside the TextField
   */
  const [textFieldValue, setTextFieldValue] = useState("");

  /**
   * Initialize the TextField label once, from the initial selection
   * (single-select) or from the explicit default value. The effect retries on
   * each render until a label can be resolved (e.g. async item hydration),
   * then locks.
   *
   * After init, the displayed text is updated only by explicit callers:
   * - user typing via `handleTextFieldChange`
   * - menu selection via `setTextFieldValue(item.label)` in the parent
   * - `clearInput` (textfield clear button or `clearOnSelect`)
   *
   * No continuous `value → textFieldValue` sync — that would fight
   * `clearOnSelect` (which intentionally empties the input right after a
   * selection) and would override user search input.
   */
  const hasInitializedTextField = useRef(false);
  useEffect(() => {
    if (hasInitializedTextField.current) return;

    if (!multiSelect) {
      const defaultLabel = textFieldDefaultValue ?? "";
      if (value.length > 0) {
        const initialSelectedOption = mapIdToOption.get(value[0]);
        const initialLabel = initialSelectedOption?.label ?? defaultLabel;
        if (initialLabel) {
          setTextFieldValue(initialLabel);
          hasInitializedTextField.current = true;
          return;
        }
      }

      if (clearOnSelect) {
        // Skip initialization if the first condition doesn't meet
        setTextFieldValue(defaultLabel);
        hasInitializedTextField.current = true;
        return;
      }
    }

    if (textFieldDefaultValue) {
      setTextFieldValue(textFieldDefaultValue);
      hasInitializedTextField.current = true;
    }
  }, [multiSelect, value, mapIdToOption, textFieldDefaultValue, clearOnSelect]);

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
