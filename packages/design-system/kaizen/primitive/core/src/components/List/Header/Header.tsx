import { type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback } from "react";

import Button, { ButtonProps } from "#src/components/Button";
import Checkbox from "#src/components/Checkbox";
import { listItem } from "#src/components/List";
import { useCheckboxContext } from "#src/contexts/CheckboxContext";

export type ListHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof listItem> & {
    id: string;
    title: string;
    description?: string;
    isSelectable?: boolean;
    onCheckboxChange?: (value: boolean) => void;
    buttons?:
      | [ButtonProps]
      | [ButtonProps, ButtonProps]
      | [ButtonProps, ButtonProps, ButtonProps];
  };

/**
 * A header component for rendering the top section of a list.
 * It provides a title, an optional description, a checkbox to select all items, and a set of buttons for actions.
 * @param props.className Classname to add to the list header container.
 * @param props.title The title text for the header.
 * @param props.id The id of the Header.
 * @param props.description An optional description displayed below the title.
 * @param props.isSelectable Boolean responsible to display or not the checkbox input.
 * @param props.onCheckboxChange Callback triggered when the checkbox value changes.
 * @param props.buttons A list of buttons to display in the header, up to 3.
 */
const Header: React.FC<ListHeaderProps> = ({
  id,
  className,
  title,
  description,
  isSelectable = false,
  onCheckboxChange,
  buttons,
  ...props
}) => {
  const { indeterminateState, selectAll } = useCheckboxContext();

  const handleChange = useCallback(
    (value: boolean) => {
      selectAll();
      onCheckboxChange?.(value);
    },
    [onCheckboxChange, selectAll],
  );

  return (
    <div
      className={classNames(
        listItem({ className, selected: indeterminateState === "checked" }),
        { "bg-surface-default-weaker": indeterminateState !== "checked" },
      )}
      {...props}
    >
      <div className="flex items-center gap-xs text-onsurface-default">
        {isSelectable && (
          <Checkbox
            id={id}
            value={indeterminateState}
            onChange={handleChange}
          />
        )}
        <div className="flex flex-col items-start gap-2xs max-w-[500px]">
          <span className="text-onsurface-default text-title-sm font-strong leading-md">
            {title}
          </span>
          {description && (
            <span className="text-onsurface-weak text-body-md leading-sm">
              {description}
            </span>
          )}
        </div>
      </div>

      {buttons && (
        <div className="flex items-center gap-sm">
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button?.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

Header.displayName = "KaizenListHeader";

export default Header;
