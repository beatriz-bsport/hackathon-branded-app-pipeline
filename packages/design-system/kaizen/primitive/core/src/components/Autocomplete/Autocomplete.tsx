import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Menu from "#src/components/Menu";
import { Item, MenuOption } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";
import TextField, { type TextFieldProps } from "#src/components/TextField";
import useDebounce from "#src/hooks/debounce";

const defaultClasses = ["flex", "flex-col", "gap-sm"] as const;

const autocomplete = cva(defaultClasses);

type AutocompleteItems =
  | {
      title: string;
      options: MenuOption[];
    }[]
  | MenuOption[];

export type AutocompleteProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  textfieldProps: TextFieldProps;
  items: AutocompleteItems;
  fullWidth?: boolean;
  debounceValue?: number;
  onSelect?: (value: string) => void;
  onValueChange?: (value: string) => void;
};

/**
 * This component is a text input field that offers autocompletion from a set of items.
 * It functions by filtering these items according to the user's input and displaying them in a popover.
 * Debounces the `onChange` callback if supplied, otherwise filters items.
 * @param props.className Classname to add to the autocomplete container.
 * @param props.textfield Props to pass to the underlying TextField.
 * @param props.items List of items to provide as autocompletion.
 * @param props.fullWidth Boolean to define if the popover should take the full width of its container.
 * @param props.debounceValue Optional debounce duration (in milliseconds) to limit how often value change callbacks are triggered.
 * @param props.onValueChange Callback function that is triggered whenever the input value changes.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-autocomplete--docs
 */
const Autocomplete: React.FC<AutocompleteProps> = ({
  className,
  textfieldProps,
  items,
  fullWidth,
  debounceValue = 500,
  onSelect,
  onValueChange,
  ...props
}) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const debouncedOnChange = useDebounce((value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
  }, debounceValue);

  const filterItems = useCallback(
    (inputValue: string): AutocompleteItems => {
      const normalizedInput = inputValue.toLowerCase();

      const isMatch = (label: string, input: string): boolean => {
        let idx = 0;
        for (const char of input) {
          idx = label.indexOf(char, idx);
          if (idx === -1) return false;
          idx++;
        }
        return true;
      };

      return Array.isArray(items) && "title" in items[0]
        ? (items as { title: string; options: MenuOption[] }[])
            .map(({ title, options }) => ({
              title,
              options: options.filter((option) =>
                isMatch(option.label?.toLowerCase() || "", normalizedInput),
              ),
            }))
            .filter(
              (group) =>
                group.options.length > 0 ||
                group.title.toLowerCase().includes(normalizedInput),
            )
        : (items as MenuOption[]).filter((option) =>
            isMatch(option.label?.toLowerCase() || "", normalizedInput),
          );
    },
    [items],
  );

  return (
    <div className={autocomplete({ className })} {...props}>
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => {
            const handleTextFieldChange = useCallback(
              (event: ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value?.toLowerCase() || "";

                if (onValueChange) {
                  debouncedOnChange(inputValue);
                } else {
                  const matchingItems = filterItems(inputValue);
                  setIsPopoverOpened(matchingItems.length > 0);
                  setFilteredItems(matchingItems);
                }
              },
              [onValueChange, debouncedOnChange, filterItems],
            );

            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              handleTextFieldChange(e);
              props.onChange?.(e);
            };

            const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
              setIsPopoverOpened(filteredItems.length > 0);
              props.onFocus?.(e);
            };

            return (
              <TextField
                {...textfieldProps}
                onChange={handleChange}
                onFocus={handleFocus}
                id={textfieldProps.id}
              />
            );
          }}
        </Popover.Anchor>
        {filteredItems.length > 0 && (
          <Popover.Content
            placement="bottom-left"
            className={classNames({ "w-full": fullWidth })}
          >
            {({ setIsPopoverOpened }) => {
              const handleSelect = (value: string) => {
                const inputElement = document.getElementById(
                  textfieldProps.id,
                ) as HTMLInputElement | null;

                const selectedOption = filteredItems
                  .flatMap((item) =>
                    "options" in item ? item.options : [item],
                  )
                  .find((option) => option.id === value);

                if (!inputElement || !selectedOption) return;

                inputElement.value = selectedOption.label;
                setIsPopoverOpened(false);

                const selectedGroup = filteredItems.find(
                  (item) =>
                    "options" in item &&
                    item.options.some((option) => option.id === value),
                );

                setFilteredItems(
                  selectedGroup && "title" in selectedGroup
                    ? [
                        {
                          title: selectedGroup.title,
                          options: [selectedOption],
                        },
                      ]
                    : [selectedOption],
                );

                onSelect?.(value);
              };

              const flatItems = filteredItems
                .flatMap((item, index, array) => {
                  if ("title" in item && "options" in item) {
                    const title = {
                      type: "title",
                      label: item.title,
                      id: `${item.title}-title`,
                    };

                    const divider =
                      array.length - 1 !== index
                        ? {
                            type: "divider",
                            id: `${item.title}-divider`,
                          }
                        : undefined;

                    return [title, ...item.options, divider].filter(
                      (x) => x !== undefined,
                    );
                  }
                  return [item];
                })
                .filter((x) => x !== undefined) as Item[];

              return <Menu items={flatItems} onSelectOption={handleSelect} />;
            }}
          </Popover.Content>
        )}
      </Popover>
    </div>
  );
};

Autocomplete.displayName = "KaizenAutocomplete";

export default Autocomplete;
