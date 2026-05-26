import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { ChangeEvent, FocusEvent, useEffect, useState } from "react";

import Body from "#src/components/Body";
import Loader from "#src/components/Loader";
import Menu, { MenuProps } from "#src/components/Menu";
import Popover from "#src/components/Popover";
import TextField, { type TextFieldProps } from "#src/components/TextField";
import type { Placement } from "#src/hooks";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { type ChipItem, ChipList } from "../organisms/chip-list";
import { useAutocompleteItems } from "./hooks/use-autocomplete-items";
import { getRootId, useSelectedItems } from "./hooks/use-selected-items";
import { useTextFieldState } from "./hooks/use-text-field-state";
import type {
  AutocompleteItems,
  MapIdToOption,
  MenuOptionWithColor,
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

export const defaultMapOptionToChip = (
  option: MenuOptionWithColor,
): ChipItem => ({
  id: option.id,
  label: option.label || "",
  color: "main",
  size: "lg",
  type: "weak",
  customColor: option.customColor,
});

export type AutocompleteControlledProps = {
  /** Controlled selection. Always an array — single-select reads `value[0]`. */
  value: string[];
  /** Called with the next selection array after every user interaction. */
  onChange: (next: string[], toggledItem: string | null) => void;
  /** Toggle UI between radio (single) and checkbox (multi). Default `false`. */
  multiSelect?: boolean;
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
  /** Search mode: 'local' filters items client-side, 'remote' relies on external filtering */
  searchMode?: "local" | "remote";
  /** Callback function triggered whenever the input value changes */
  onValueChange?: (value: string) => void;
  /** Loading state configuration */
  loadingProps?: {
    isLoading: boolean;
    message?: string;
  };
  /** Disable the field, preventing all interactions */
  disabled?: boolean;
  /** In single-select mode, empty the textfield after each selection — useful for filterable lists */
  clearOnSelect?: boolean;
  /** Callback function triggered when the textfield clear action is performed */
  onClear?: () => void;
  /** Show chips of selected items (multi-select only). Default `true`. */
  withChips?: boolean;
  /** Customize how a selected option is rendered as a chip */
  mapOptionToChip?: (option: MenuOptionWithColor) => ChipItem;
  /** Keep selected items visible in the base list in addition to the "Selected" section. Default `false`. */
  withSelectedInBase?: boolean;
  /** Optional className for the wrapper element */
  className?: string;
};

/**
 * AutocompleteControlled
 *
 * Fully-controlled autocomplete. The caller owns the selection via `value` and
 * `onChange`. Use this for new code; `Autocomplete` remains as an uncontrolled
 * wrapper for legacy callers.
 */
export const AutocompleteControlled: React.FC<AutocompleteControlledProps> = ({
  className,
  textfieldProps,
  menuProps,
  items,
  fullWidth = false,
  debounceValue = 300,
  loadingProps,
  popoverPlacement = "bottom-left",
  multiSelect = false,
  value,
  onChange,
  searchMode = "local",
  onValueChange,
  disabled,
  clearOnSelect = false,
  withChips = true,
  mapOptionToChip = defaultMapOptionToChip,
  withSelectedInBase = false,
  onClear,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [mapIdToOption, setMapIdToOption] = useState<MapIdToOption>(
    new Map<string, MenuOptionWithColor>(),
  );

  /**
   * Maintains a persistent lookup map of all items ever seen.
   * Lets us render selected items even when they're filtered out of
   * the current results (e.g. during remote search).
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
    value,
    multiSelect,
    onValueChange,
    textFieldDefaultValue: textfieldProps?.value,
    mapIdToOption,
    clearOnSelect,
  });

  const { selectedItems, selectedItemsIds } = useSelectedItems({
    value,
    mapIdToOption,
  });

  const { flatMenuItems, isListEmpty } = useAutocompleteItems({
    hideSelectedItemsInBase: !withSelectedInBase,
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
            };

            const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
              openPopover();
              textfieldProps.onFocus?.(e);
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
                    onChange([], null);
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
                onSelectOption={(menuId) => {
                  const rootId = getRootId(menuId);
                  const item = mapIdToOption.get(rootId);
                  if (!item) return;

                  const isSelected = value.includes(rootId);
                  const nextValue = multiSelect
                    ? isSelected
                      ? value.filter((id) => id !== rootId)
                      : [...value, rootId]
                    : [rootId];

                  onChange(nextValue, rootId);

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

      {multiSelect && withChips && (
        <ChipList
          chips={selectedItems.map(mapOptionToChip)}
          handleDismissChip={(chipId) => {
            const rootId = getRootId(chipId);
            onChange(
              value.filter((id) => id !== rootId),
              rootId,
            );
          }}
          disabled={disabled}
        />
      )}
    </div>
  );
};

AutocompleteControlled.displayName = "KaizenAutocompleteControlled";
