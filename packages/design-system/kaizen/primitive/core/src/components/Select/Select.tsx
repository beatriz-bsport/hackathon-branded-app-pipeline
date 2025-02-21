import React, { KeyboardEvent, useCallback, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import Icon, { type IconName } from "#src/components/Icon";
import Popover from "#src/components/Popover";
import Menu from "#src/components/Menu";
import { Item, MenuOption } from "#src/components/Menu/types";

const defaultClasses = [
  "w-full",
  "flex",
  "items-center",
  "gap-xs",
  "px-xs",
  "py-xs",
  "rounded-md",
  "text-onsurface-default",
  "bg-surface-action-default-elevated-rest",
  "hover:bg-surface-action-default-elevated-hovered",
  "active:bg-surface-action-default-elevated-pressed",
  "cursor-pointer",
  "transition ease-out duration-default",
] as const;

const variants = {
  status: {
    default: [],
    critical: ["shadow-border-thin-critical"],
    positive: ["shadow-border-thin-positive"],
  },
  disabled: {
    true: ["opacity-md", "pointer-events-none"],
    false: [],
  },
} as const;

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const select = cva(defaultClasses, { variants });

export type SelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> &
  VariantProps<typeof select> & {
    name?: string;
    label: string;
    items: Item[];
    iconLeft?: IconName;
    disabled?: boolean;
    onSelect?: (option: string) => void;
  };

/**
 * A custom select component that displays a button which, when clicked or activated via a keyboard,
 * reveals a popover with selectable items. This component supports various visual states and integrates
 * well with forms by allowing submission of the selected value.
 * @param props.className Classname to add to the select.
 * @param props.id Id of the select.
 * @param props.name Name of the hidden input for form submissions.
 * @param props.status Status of the select. Can be "default", "critical", or "positive".
 * @param props.label Label of the select.
 * @param props.items Items of the select.
 * @param props.iconLeft Icon on the left side of the select.
 * @param props.disabled Whether the select is disabled or not.
 * @param props.onSelect Function to call when an option is selected.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-select--docs
 */
const Select: React.FC<SelectProps> = ({
  className,
  id,
  name,
  status,
  label,
  items,
  iconLeft,
  disabled,
  onSelect,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(label);

  return (
    <Popover>
      <Popover.Anchor>
        {({ isPopoverOpened, setIsPopoverOpened }) => {
          const handleButtonClick = () => setIsPopoverOpened((prev) => !prev);

          const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsPopoverOpened((prev) => !prev);
            }
          };

          return (
            <>
              {/* Invisible input to support form submission */}
              <input
                type="hidden"
                name={name || id}
                value={selectedValue || undefined}
              />

              <button
                className={classNames(select({ className, status, disabled }), {
                  "shadow-focused": isPopoverOpened,
                  "shadow-action-default-rest hover:shadow-action-default-hovered":
                    !isPopoverOpened,
                })}
                onClick={handleButtonClick}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isPopoverOpened}
                aria-controls={`${id}-listbox`}
                id={id}
                disabled={disabled}
                {...props}
              >
                {iconLeft && <Icon icon={iconLeft} size="sm" />}
                <span className="w-full text-left">{selectedValue}</span>
                <Icon icon="chevron-selector-vertical" size="sm" />
              </button>
            </>
          );
        }}
      </Popover.Anchor>
      <Popover.Content placement="bottom-left">
        {({ setIsPopoverOpened }) => {
          const handleSelect = useCallback(
            (value: string) => {
              const option = items.find(
                (item) => (item as MenuOption).id === value,
              );
              setSelectedValue((option as MenuOption).label || value);
              setIsPopoverOpened(false);
              onSelect?.(value);
            },
            [onSelect],
          );

          return (
            <Menu
              items={items}
              disabled={disabled || false}
              onSelectOption={handleSelect}
              aria-labelledby={id}
            />
          );
        }}
      </Popover.Content>
    </Popover>
  );
};

Select.displayName = "KaizenSelect";

export default Select;
