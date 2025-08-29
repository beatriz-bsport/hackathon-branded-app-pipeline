import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAutocompleteItems } from "#src/components/Autocomplete/hooks/use-autocomplete-items";
import { useAutocompleteSelection } from "#src/components/Autocomplete/hooks/use-autocomplete-selection";
import Body from "#src/components/Body";
import Chip from "#src/components/Chip";
import Loader from "#src/components/Loader";
import Menu from "#src/components/Menu";
import type { Item, MenuOption } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";
import TextField, { type TextFieldProps } from "#src/components/TextField";
import type { Placement } from "#src/hooks";
import useDebounce from "#src/hooks/debounce";

const defaultClasses = ["flex", "flex-col", "gap-sm"] as const;

const autocomplete = cva(defaultClasses, {
  variants: {
    fullWidth: {
      true: ["w-full"],
      false: ["w-auto"],
    },
  },
});

export type AutocompleteItems =
  | {
      title: string;
      options: MenuOption[];
    }[]
  | MenuOption[];

type BaseAutocompleteProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  /** Props passed to the underlying TextField component */
  textfieldProps: TextFieldProps;
  /** List of items to provide as autocompletion options */
  items: AutocompleteItems;
  /** Whether the popover should take the full width of its container */
  fullWidth?: boolean;
  /** Debounce duration in milliseconds to limit how often value change callbacks are triggered */
  debounceValue?: number;
  /** Placement of the popover relative to the input field */
  popoverPlacement?: Placement;
  /** Array of item IDs that should be pre-selected on component mount */
  defaultSelectedIds?: string[];
  /** Search mode: 'local' filters items client-side, 'remote' relies on external filtering */
  searchMode?: "local" | "remote";
  /** Callback function triggered whenever the input value changes */
  onValueChange?: (value: string) => void;
  /** Loading state configuration */
  loadingProps?: {
    isLoading: boolean;
    message?: string;
  };
  /** options to disable the field making the autocomplete, textfield and popover not usable */
  disabled?: boolean;
  /** Empty the selected value array when clicking, used when you want to display a filterable list of choice not made to be kept */
  clearOnSelect?: boolean;
};

type MultiSelectAutocompleteProps = BaseAutocompleteProps & {
  /** Enable multi-selection mode using checkboxes instead of radio buttons */
  multiSelect: true;
  /** Callback function triggered when items are selected (multi-select mode) */
  onSelect?: (selectedValues: string[]) => void;
};

type SingleSelectAutocompleteProps = BaseAutocompleteProps & {
  /** Enable multi-selection mode using checkboxes instead of radio buttons */
  multiSelect?: false;
  /** Callback function triggered when an item is selected (single-select mode) */
  onSelect?: (selectedValue: string) => void;
};

export type AutocompleteProps =
  | MultiSelectAutocompleteProps
  | SingleSelectAutocompleteProps;

/**
 * Autocomplete Component
 *
 * A text input field that offers autocompletion from a set of items.
 * It functions by filtering these items according to the user's input and displaying them in a popover.
 * Supports both single and multi-selection modes, with optional pre-selected items.
 */
const Autocomplete: React.FC<AutocompleteProps> = ({
  className,
  textfieldProps,
  items,
  fullWidth = false,
  debounceValue = 500,
  loadingProps,
  popoverPlacement = "bottom-left",
  multiSelect = false,
  defaultSelectedIds = [],
  searchMode = "local",
  onSelect,
  onValueChange,
  disabled,
  clearOnSelect = false,
  ...props
}) => {
  const textFieldRef = React.useRef<HTMLInputElement | null>(null);
  // Use custom hooks for state management
  const {
    selectedValues,
    setSelectedValues,
    cachedItems,
    setCachedItems,
    textfieldValue,
    setTextFieldValue,
    searchedValue,
    setSearchedValue,
  } = useAutocompleteSelection(
    items,
    defaultSelectedIds,
    multiSelect,
    textfieldProps,
  );

  const { items: filteredItems } = useAutocompleteItems({
    items,
    cachedItems,
    searchInput: searchedValue,
    searchMode,
  });

  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounced value change handler
  const debouncedOnChange = useDebounce((value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
    setSearchedValue(value);
    setIsDebouncing(false);
  }, debounceValue);

  // Handle text field input changes
  const handleTextFieldChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement>,
      setIsPopoverOpened: (open: boolean) => void,
    ) => {
      const inputValue = event.target.value || "";

      setTextFieldValue(inputValue);
      if (searchMode === "remote") {
        setIsPopoverOpened(true);
        setSearchedValue(inputValue);
        if (onValueChange) {
          onValueChange(inputValue);
        }
      }

      if (searchMode === "local") {
        setIsDebouncing(true);
        debouncedOnChange(inputValue);
      }
    },
    [
      searchMode,
      debouncedOnChange,
      onValueChange,
      setTextFieldValue,
      setSearchedValue,
    ],
  );

  // Handle item selection
  const handleSelect = useCallback(
    (value: string, setIsPopoverOpened: (open: boolean) => void) => {
      const selectedItem = filteredItems
        .flatMap((item) => ("options" in item ? item.options : [item]))
        .find((option) => option.id === value);
      if (!selectedItem) return;

      if (!multiSelect && clearOnSelect) {
        const singleValue = value || "";
        (onSelect as (selectedItem: string) => void)?.(singleValue);
        setSearchedValue("");
        setTextFieldValue("");
        setIsPopoverOpened(false);
        return;
      }

      // Update cached items
      setCachedItems((prev) => {
        const existingItem = prev.find((item) => item.id === value);
        if (existingItem) {
          return prev.filter((item) => item.id !== value);
        }
        if (multiSelect) {
          return [...prev, selectedItem];
        }
        return [selectedItem];
      });
      // Update selected values
      setSelectedValues((prev) => {
        if (multiSelect) {
          return prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value];
        }

        return [value];
      });

      // For single-select, update input and close popover
      if (!multiSelect) {
        setTextFieldValue(selectedItem.label);
        setIsPopoverOpened(false);
      }
    },
    [
      filteredItems,
      setCachedItems,
      setSelectedValues,
      multiSelect,
      clearOnSelect,
      setTextFieldValue,
    ],
  );

  // Generate chips for multi-select display
  const chips = useMemo(() => {
    if (!multiSelect) return undefined;

    return selectedValues
      .map((value) => {
        const item = cachedItems.find((i) => i.id === value);
        if (!item) return null;
        return {
          id: value,
          label: item.label || "",
          type: "weak" as const,
          color: "main" as const,
          size: "lg" as const,
          dismissible: true,
          onClick: () => {
            setCachedItems((prev) => prev.filter((i) => i.id !== value));
            setSelectedValues((prev) => prev.filter((v) => v !== value));
          },
        };
      })
      .filter((chip): chip is NonNullable<typeof chip> => chip !== null);
  }, [
    multiSelect,
    selectedValues,
    cachedItems,
    setCachedItems,
    setSelectedValues,
  ]);

  // Convert filtered items to flat menu items
  const flatMenuItems = useMemo(() => {
    return filteredItems
      .flatMap((item, index, array) => {
        if ("title" in item && "options" in item) {
          const title = {
            type: "title" as const,
            label: item.title,
            id: `${item.title}-title`,
          };

          const divider =
            array.length - 1 !== index
              ? {
                  type: "divider" as const,
                  id: `${item.title}-divider`,
                }
              : null;

          return [title, ...item.options, divider].filter((x) => x !== null);
        }
        return [item];
      })
      .filter((x) => x !== null) as Item[];
  }, [filteredItems]);

  useEffect(() => {
    // Call onSelect with appropriate parameter based on multiSelect mode
    if (onSelect) {
      if (multiSelect) {
        // In multi-select mode, pass the array
        (onSelect as (selectedValues: string[]) => void)(selectedValues);
      } else {
        // In single-select mode, pass the first selected value or empty string
        const singleValue = selectedValues[0] || "";
        (onSelect as (selectedValue: string) => void)(singleValue);
      }
    }
  }, [selectedValues]);

  return (
    <div
      className={autocomplete({ className, fullWidth: fullWidth })}
      {...props}
    >
      <Popover className={classNames({ "w-full": fullWidth })}>
        <Popover.Anchor>
          {({ setIsPopoverOpened, isPopoverOpened }) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              if (!isPopoverOpened) {
                setIsPopoverOpened(true);
              }
              handleTextFieldChange(e, setIsPopoverOpened);
              props.onChange?.(e);
            };

            const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
              setIsPopoverOpened(filteredItems.length > 0);
              props.onFocus?.(e);
            };

            return (
              <TextField
                disabled={disabled}
                inputRef={textFieldRef}
                {...textfieldProps}
                value={textfieldValue}
                onChange={handleChange}
                onFocus={handleFocus}
                id={textfieldProps.id}
                autocomplete="off"
                fullWidth={fullWidth || textfieldProps.fullWidth}
                onClear={() => {
                  setTextFieldValue("");
                  setSearchedValue("");
                  if (onValueChange) onValueChange("");
                }}
              />
            );
          }}
        </Popover.Anchor>
        {(filteredItems.length > 0 ||
          isDebouncing ||
          loadingProps?.isLoading) && (
          <Popover.Content
            placement={popoverPlacement}
            className={classNames({ "w-full": fullWidth })}
            maxWidthPx={
              textFieldRef.current?.getBoundingClientRect().width || undefined
            }
          >
            {({ setIsPopoverOpened }) => {
              if (isDebouncing || loadingProps?.isLoading) {
                return (
                  <div
                    className="flex items-center justify-center p-4"
                    role="status"
                    aria-live="polite"
                  >
                    <Loader size="md" />
                    {loadingProps?.message && (
                      <Body htmlVariant="span" className="ml-2">
                        {loadingProps.message}
                      </Body>
                    )}
                  </div>
                );
              }

              return (
                <Menu
                  multiSelect={multiSelect}
                  items={flatMenuItems}
                  onSelectOption={(value) =>
                    handleSelect(value, setIsPopoverOpened)
                  }
                  selectedValues={selectedValues}
                />
              );
            }}
          </Popover.Content>
        )}
      </Popover>
      <div>
        {chips && chips.length > 0 ? (
          <div className="flex flex-wrap gap-2xs">
            {chips.map((chip, index) => (
              <Chip key={chip.id || index} {...chip} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

Autocomplete.displayName = "KaizenAutocomplete";

export default Autocomplete;
