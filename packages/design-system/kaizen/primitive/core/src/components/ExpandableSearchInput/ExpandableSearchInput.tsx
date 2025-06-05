import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { flushSync } from "react-dom";

import Button from "#src/components/Button";
import TextField from "#src/components/TextField";
import useDebounce from "#src/hooks/debounce";

const DEFAULT_EXPANDED_WIDTH = 200;
const COLLAPSED_WIDTH = 32;
const TRANSITION_DURATION = 300;

export type ExpandableSearchInputProps =
  React.HTMLAttributes<HTMLDivElement> & {
    id: string;
    placeholder?: string;
    position?: "left" | "right";
    maxWidth?: number;
    inputValue?: string;
    onInputValueChange?: (value: string) => void;
    onButtonClick?: () => void;
    onClear?: () => void;
    debounceValue?: number;
  };

/**
 * The ExpandableSearchInput component provides interactive search functionality by utilizing a TextField.
 * Users can click the search icon to reveal or hide the input field for entering queries.
 * The component's appearance and animation are influenced by the position prop,
 * which determines the direction from which the input field expands.
 * @param props.className Classname to add to the expandable search container.
 * @param props.id Unique ID for the expandable search element.
 * @param props.placeholder Placeholder text to display when the input field is empty.
 * @param props.position Position of the input field relative to the search icon. Can be "left" or "right".
 * @param props.maxWidth Maximum width of the input field.
 * @param props.inputValue Current value of the input field.
 * @param props.onInputValueChange Callback function to handle changes in the input field value.
 * @param props.onButtonClick Callback function to handle the click event on the search icon.
 * @param props.onClear Callback function to handle the click event on the clear icon.
 * @param props.debounceValue Duration in milliseconds to debounce the input value change event. Defaults to 0ms.
 */
const ExpandableSearchInput: React.FC<ExpandableSearchInputProps> = ({
  className,
  id,
  placeholder,
  position = "left",
  maxWidth = DEFAULT_EXPANDED_WIDTH,
  inputValue,
  onInputValueChange,
  onButtonClick,
  onClear,
  debounceValue = 0,
  ...props
}) => {
  const [displayedAsInput, setDisplayedAsInput] = useState(false);
  const [value, setValue] = useState(inputValue || "");
  const [isOpened, setIsOpened] = useState(false);

  const handleButtonClick = useCallback(() => {
    flushSync(() => {
      setDisplayedAsInput(true);
    });
    setIsOpened(true);
    onButtonClick?.();
  }, [onButtonClick]);

  const handleClear = useCallback(() => {
    setValue("");
    setIsOpened(false);
    onClear?.();
  }, [onClear]);

  const handleBlur = useCallback(() => {
    if (value === "") {
      setIsOpened(false);
    }
  }, [value]);

  const debouncedInputValueChange = useDebounce(
    (newValue) => onInputValueChange?.(newValue),
    debounceValue,
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      debouncedInputValueChange(newValue);
    },
    [onInputValueChange],
  );

  return (
    <div
      className={classNames(
        className,
        "flex gap-xs items-center justify-between w-fit",
        {
          "ml-auto": position === "right",
        },
      )}
      {...props}
    >
      {displayedAsInput ? (
        <TextField
          containerProps={{
            style: {
              width: isOpened ? `${maxWidth}px` : `${COLLAPSED_WIDTH}px`,
              transition: `width ${TRANSITION_DURATION}ms ease-out`,
            },
            onTransitionEnd: () => setDisplayedAsInput(isOpened),
          }}
          id={id}
          type="search"
          value={value}
          onChange={handleInputChange}
          onClear={handleClear}
          onBlur={handleBlur}
          placeholder={placeholder}
          iconLeft="search-refraction"
          autoFocus
        />
      ) : (
        <Button
          color="main"
          intent="default"
          size="md"
          iconLeft="search-refraction"
          onClick={handleButtonClick}
        />
      )}
    </div>
  );
};

ExpandableSearchInput.displayName = "KaizenExpandableSearchInput";

export default ExpandableSearchInput;
