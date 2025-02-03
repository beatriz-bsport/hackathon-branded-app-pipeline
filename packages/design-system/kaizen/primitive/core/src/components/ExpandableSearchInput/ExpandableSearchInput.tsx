import React, { useCallback, useState } from "react";
import classNames from "classnames";
import Button from "#src/components/Button";
import TextField from "#src/components/TextField";

const DEFAULT_EXPANDED_WIDTH = 200;
const COLLAPSED_WIDTH = 32;

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
  ...props
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [value, setValue] = useState(inputValue || "");
  const [isOpened, setIsOpened] = useState(false);

  const handleButtonClick = useCallback(() => {
    setIsInputVisible(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 20);
    onButtonClick?.();
  }, [onButtonClick]);

  const handleClear = useCallback(() => {
    setIsOpened(false);
    setTimeout(() => {
      setValue("");
      setIsInputVisible(false);
    }, 300);
    onClear?.();
  }, [onClear]);

  const handleBlur = useCallback(() => {
    if (value === "") {
      setIsOpened(false);
      setTimeout(() => {
        setIsInputVisible(false);
      }, 300);
    }
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onInputValueChange?.(newValue);
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
      {!isInputVisible && (
        <Button
          color="main"
          intent="default"
          size="md"
          iconLeft="search-refraction"
          onClick={handleButtonClick}
        />
      )}
      {isInputVisible && (
        <TextField
          style={{
            width: isOpened ? `${maxWidth}px` : `${COLLAPSED_WIDTH}px`,
            transition: "width 300ms ease-out",
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
      )}
    </div>
  );
};

ExpandableSearchInput.displayName = "KaizenExpandableSearchInput";

export default ExpandableSearchInput;
