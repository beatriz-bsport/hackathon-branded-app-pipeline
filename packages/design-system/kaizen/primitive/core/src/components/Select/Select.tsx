import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React, { KeyboardEvent, useCallback, useState } from "react";

import Body from "#src/components/Body";
import Icon, { type IconName } from "#src/components/Icon";
import Loader from "#src/components/Loader";
import Menu from "#src/components/Menu";
import { Item } from "#src/components/Menu/types";
import Popover from "#src/components/Popover";
import { Placements } from "#src/hooks/placement-classes.hook";

const defaultClasses = [
  "w-full",
  "flex",
  "items-center",
  "gap-xs",
  "rounded-md",
  "text-onsurface-default",
  "bg-surface-action-default-elevated-rest",
  "hover:bg-surface-action-default-elevated-hovered",
  "active:bg-surface-action-default-elevated-pressed",
  "cursor-pointer",
  "transition ease-out duration-default",
] as const;

const variants = {
  size: {
    sm: ["h-lg", "px-xs"],
    md: ["h-xl", "p-xs"],
  },
  status: {
    default: [],
    critical: ["shadow-border-thin-critical"],
    positive: ["shadow-border-thin-positive"],
  },
  disabled: {
    true: ["opacity-sm", "pointer-events-none"],
    false: [],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const select = cva(defaultClasses, { variants });

export type SelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> &
  VariantProps<typeof select> & {
    name?: string;
    value?: string;
    defaultValue?: string;
    items: Item[];
    iconLeft?: IconName;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    popoverPlacement?: (typeof Placements)[number];
    onChange?: (option: string) => void;
    fullWidth?: boolean;
    label?: string;
    required?: boolean;
    loadingProps?: {
      isLoading: boolean;
      message?: string | undefined;
    };
  };

/**
 * A custom select component that displays a button which, when clicked or activated via a keyboard,
 * reveals a popover with selectable items. This component supports both controlled and uncontrolled modes,
 * integrates well with forms by allowing submission of the selected value, and provides accessibility features.
 *
 * - **Controlled Mode**: Pass the `value` prop to control the selected value externally. Use `onSelect` to handle changes.
 * - **Uncontrolled Mode**: Pass the `defaultValue` prop to initialize the selected value internally. The component manages its own state.
 * @param props.className Classname to add to the select.
 * @param props.id Id of the select.
 * @param props.name Name of the hidden input for form submissions.
 * @param props.size Size of the select. Can be "sm" or "md".
 * @param props.status Status of the select. Can be "default", "critical", or "positive".
 * @param props.value Controlled selected value. The value should be equal to the id of one of the options. Use this prop to manage the selected value externally.
 * @param props.defaultValue Default selected value (uncontrolled). Use this prop to initialize the selected value internally.
 * @param props.items List of selectable items. Each item should include an `id` and `label`.
 * @param props.iconLeft Icon displayed on the left side of the select button.
 * @param props.disabled Whether the select is disabled or not. Disabled state prevents user interaction.
 * @param props.helperText Text below the select to provide additional information.
 * @param props.errorText Text to display when the select is in error.
 * @param props.popoverPlacement Placement of the popover. Defaults to `"bottom-left"`. Can be any valid placement from the `Placements` type.
 * @param props.onChange Function to call when an option is selected. Receives the selected option's id as an argument.
 * @param props.fullWidth Optional Boolean to allow the Select component to take the whole available width of its parent.
 * @param props.label Optional String - gives a label title to the select field.
 * @param props.required Optional Boolean - Display a custom element next to the label if the select result is required.
 * @param props.loadingProps  Loading state configuration.
 *
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-select--docs
 */
const Select: React.FC<SelectProps> = ({
  className,
  id,
  name,
  size = "md",
  status,
  value,
  defaultValue,
  items,
  iconLeft,
  disabled,
  helperText,
  errorText,
  popoverPlacement = "bottom-left",
  onChange,
  fullWidth,
  label,
  required,
  loadingProps,
  ...props
}) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? "",
  );

  // The displayed value depends on whether it's controlled or uncontrolled
  const selectedValueId = isControlled ? value : internalValue;

  // Find the selected item, ensure it's not a DividerItem (which lacks 'label')
  const selectedItem = items.find(
    (item): item is { id: string; label: string } =>
      "id" in item && item.id === selectedValueId && "label" in item,
  );
  const selectedValue = selectedItem?.label ?? "";

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!isControlled) {
        setInternalValue(optionId);
      }

      onChange?.(optionId);
    },
    [isControlled, items, onChange],
  );

  return (
    <div
      data-component="Kaizen-Select"
      className={classNames("flex flex-col gap-2xs", { "w-full": fullWidth })}
    >
      {label && (
        <label
          htmlFor={id}
          className="flex gap-2xs text-onsurface-default text-body-md leading-sm"
        >
          <span>{label}</span>
          {required && (
            <span className="text-onsurface-status-critical-strong text-body-sm leading-xs">
              *
            </span>
          )}
        </label>
      )}
      <Popover className={classNames({ "w-full": fullWidth })}>
        <Popover.Anchor>
          {({ isPopoverOpened, setIsPopoverOpened }) => {
            const handleButtonClick = () => setIsPopoverOpened((prev) => !prev);

            const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
              if (["ArrowDown", "Enter", " "].includes(e.key)) {
                e.preventDefault();
                setIsPopoverOpened((prev) => !prev);
              }
            };

            return (
              <div data-component="Kaizen-Select-Anchor">
                {/* Invisible input to support form submission */}
                <input
                  type="hidden"
                  name={name || id}
                  value={selectedValue || undefined}
                />

                <button
                  className={classNames(
                    select({ className, size, status, disabled }),
                    {
                      "shadow-focused": isPopoverOpened,
                      "shadow-action-default-rest hover:shadow-action-default-hovered":
                        !isPopoverOpened,
                    },
                  )}
                  onClick={handleButtonClick}
                  onKeyDown={handleKeyDown}
                  aria-haspopup="listbox"
                  aria-expanded={isPopoverOpened}
                  aria-controls={`${id}-listbox`}
                  id={id}
                  type="button"
                  disabled={disabled}
                  {...props}
                >
                  {iconLeft && <Icon icon={iconLeft} size="sm" />}
                  <span
                    className={classNames("w-full text-left leading-xs", {
                      "text-body-md": size === "sm",
                      "text-body-lg": size === "md",
                    })}
                  >
                    {selectedValue}
                  </span>
                  <Icon icon="chevron-down" size="sm" />
                </button>
              </div>
            );
          }}
        </Popover.Anchor>
        <Popover.Content placement={popoverPlacement}>
          {({ setIsPopoverOpened }) => {
            if (loadingProps?.isLoading) {
              const loadingMessage = loadingProps?.message;
              return (
                <div
                  className="flex items-center justify-center p-2xs gap-md"
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

            return (
              <Menu
                items={items}
                disabled={disabled || false}
                onSelectOption={(optionId) => {
                  handleSelect(optionId);
                  setIsPopoverOpened(false);
                }}
                aria-labelledby={id}
              />
            );
          }}
        </Popover.Content>
      </Popover>

      {(helperText || errorText) && (
        <div>
          {helperText && (
            <Body htmlVariant="p" size="sm" color="weak">
              {helperText}
            </Body>
          )}
          {errorText && (
            <Body
              htmlVariant="p"
              size="sm"
              color="inherit"
              className="text-onsurface-status-critical-strong"
            >
              {errorText}
            </Body>
          )}
        </div>
      )}
    </div>
  );
};

Select.displayName = "KaizenSelect";

export default Select;
