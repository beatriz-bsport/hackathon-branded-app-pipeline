import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { ChangeEvent, FocusEvent, useEffect, useState } from "react";

import Body from "#src/components/Body";
import Loader from "#src/components/Loader";
import Menu, { MenuProps } from "#src/components/Menu";
import type { MenuOption } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";
import TextField, { type TextFieldProps } from "#src/components/TextField";
import type { Placement } from "#src/hooks";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { AutocompleteChips } from "./AutocompleteChips";
import { useAutocompleteItems } from "./hooks/use-autocomplete-items";
import {
  type UseSelectedItemsProps,
  useSelectedItems,
} from "./hooks/use-selected-items";
import { useTextFieldState } from "./hooks/use-text-field-state";
import type {
  AutocompleteItems,
  MapIdToOption,
  MultiSelectAutocompleteProps,
  SingleSelectAutocompleteProps,
} from "./types";

const defaultClasses = ["flex", "flex-col", "gap-sm"] as const;

const autocomplete = cva(defaultClasses, {
  variants: {
    fullWidth: {
      true: ["w-full"],
      false: ["w-auto"],
    },
  },
});

type BaseAutocompleteProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  /** Props passed to the underlying TextField component */
  textfieldProps: TextFieldProps;
  /** Props passed to the underlying Menu component */
  menuProps?: Partial<MenuProps>;
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
  /** Callback function triggered when the textfield clear action is performed */
  onClear?: () => void;
  /** Whether to not display chips in a multi select context */
  hideChips?: boolean;
  /** Whether to display selected items in the base items list, as they are grouped in a "Selected" section */
  showSelectedItemsInBase?: boolean;
  /**
   * Whether to provide a custom logic for toggling items (select or unselect).
   * Should return the final array of ids to keep. If single choice, ensure the length of the array is 1 or 0.
   * */
  onToggleItem?: ({
    prev,
    toggledItem,
  }: {
    prev: string[];
    toggledItem: string;
  }) => string[];
};

export type AutocompleteProps = BaseAutocompleteProps &
  (MultiSelectAutocompleteProps | SingleSelectAutocompleteProps);

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
  menuProps,
  items,
  fullWidth = false,
  debounceValue = 300,
  loadingProps,
  popoverPlacement = "bottom-left",
  multiSelect = false,
  defaultSelectedIds = [],
  searchMode = "local",
  onSelect,
  onValueChange,
  disabled,
  clearOnSelect = false,
  hideChips = false,
  showSelectedItemsInBase = false,
  onClear,
  onToggleItem,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [mapIdToOption, setMapIdToOption] = useState<MapIdToOption>(
    new Map<string, MenuOption>(),
  );

  /**
   * Maintains a persistent lookup map of all items ever seen.
   * This allows retrieving full item details for selected items
   * even when they're filtered out of the current results.
   */
  useEffect(() => {
    const newMapIdToOption: MapIdToOption = new Map();

    const flattenOptions = items.flatMap((item) =>
      "options" in item ? item.options : [item],
    );
    for (const option of flattenOptions) {
      newMapIdToOption.set(option.id, option);
    }

    setMapIdToOption((prev) => new Map([...prev, ...newMapIdToOption]));
  }, [items]);

  const {
    textFieldRef,
    textFieldValue,
    searchedValue,
    setTextFieldValue,
    handleTextFieldChange,
    isDebouncing,
    clearInput,
  } = useTextFieldState({
    debounceValue,
    defaultSelectedIds,
    multiSelect,
    onValueChange,
    textFieldDefaultValue: textfieldProps?.value,
    mapIdToOption,
  });

  const { clearSelection, selectedItems, selectedItemsIds, toggleItem } =
    useSelectedItems({
      defaultSelectedIds,
      mapIdToOption,
      multiSelect,
      onSelect,
      onToggleItem,
      // Type assertion needed: onSelect signature varies based on multiSelect discriminant
    } as UseSelectedItemsProps);

  const { flatMenuItems, isListEmpty } = useAutocompleteItems({
    hideSelectedItemsInBase: !showSelectedItemsInBase,
    items,
    searchedValue,
    searchMode,
    selectedItems,
    selectedItemsIds,
  });

  const isLoading = isDebouncing || loadingProps?.isLoading;

  return (
    <div
      data-component="Kaizen-Autocomplete"
      className={autocomplete({ className, fullWidth: fullWidth })}
      {...props}
    >
      <Popover className={classNames({ "w-full": fullWidth })}>
        <Popover.Anchor>
          {({ setIsPopoverOpened, isPopoverOpened }) => {
            const openPopover = () => {
              if (!isPopoverOpened) {
                setIsPopoverOpened(true);
              }
            };

            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              openPopover();
              handleTextFieldChange(e.target.value);
              props.onChange?.(e);
            };

            const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
              openPopover();
              props.onFocus?.(e);
            };

            return (
              <TextField
                disabled={disabled}
                inputRef={textFieldRef}
                {...textfieldProps}
                value={textFieldValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onClick={openPopover}
                id={textfieldProps.id}
                autocomplete="off"
                fullWidth={fullWidth || textfieldProps.fullWidth}
                onClear={() => {
                  clearInput();
                  if (!multiSelect) {
                    clearSelection();
                  }
                  onClear?.();
                }}
              />
            );
          }}
        </Popover.Anchor>

        <Popover.Content
          placement={popoverPlacement}
          className={classNames({ "w-full": fullWidth })}
          maxWidthPx={
            textFieldRef.current?.getBoundingClientRect().width || undefined
          }
        >
          {({ setIsPopoverOpened }) => {
            if (isLoading) {
              const loadingMessage = loadingProps?.message;
              return (
                <div
                  className="flex items-center justify-center p-4 gap-md"
                  role="status"
                  aria-live="polite"
                >
                  <Loader size="md" />

                  {loadingMessage && (
                    <Body htmlVariant="span">{loadingMessage}</Body>
                  )}
                </div>
              );
            }

            if (isListEmpty) {
              return (
                <div className="flex items-center justify-center p-4">
                  <Body>{t("emptyState.noResultsFound.title")}</Body>
                </div>
              );
            }

            return (
              <Menu
                multiSelect={multiSelect}
                items={flatMenuItems}
                onSelectOption={(value) => {
                  const item = toggleItem(value);

                  if (!item) return;

                  if (!multiSelect) {
                    if (clearOnSelect) {
                      clearInput();
                    } else {
                      setTextFieldValue(item.label);
                    }

                    setIsPopoverOpened(false);
                  }
                }}
                selectedValues={Array.from(selectedItemsIds)}
                {...(menuProps ?? {})}
              />
            );
          }}
        </Popover.Content>
      </Popover>

      <AutocompleteChips
        hideChips={hideChips}
        multiSelect={multiSelect}
        onDismissChip={toggleItem}
        selectedItems={selectedItems}
      />
    </div>
  );
};

Autocomplete.displayName = "KaizenAutocomplete";

export default Autocomplete;
