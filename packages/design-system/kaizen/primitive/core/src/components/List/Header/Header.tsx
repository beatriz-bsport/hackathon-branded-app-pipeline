import { type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback } from "react";

import Button from "#src/components/Button";
import Checkbox from "#src/components/Checkbox";
import type { CollapseProps } from "#src/components/Collapse/Collapse";
import DropdownMenu from "#src/components/DropdownMenu";
import { listItem } from "#src/components/List";
import { useCheckboxContext } from "#src/contexts/CheckboxContext";
import useSplitActionsByDisplayOrder, {
  type ActionButton,
  type ActionsDropdownConfig,
} from "#src/hooks/use-split-actions-by-display-order";

type HeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof listItem> & {
    id: string;
    title: string;
    description?: string;
    isSelectable?: boolean;
    onCheckboxChange?: (value: boolean) => void;
    buttons?: ActionButton[];
    dropdownConfig?: ActionsDropdownConfig;
    collapsibleProps?: Omit<CollapseProps, "children">;
    onCollapse?: () => void;
    isCollapseOpen?: boolean;
  };

export type ListHeaderProps = Omit<
  HeaderProps,
  "collapsibleProps" | "onCollapse" | "isCollapseOpen"
>;

/**
 * A header component for rendering the top section of a list.
 * It provides a title, an optional description, a checkbox to select all items, and a set of buttons for actions.
 * @param props.className Classname to add to the list header container.
 * @param props.title The title text for the header.
 * @param props.id The id of the Header.
 * @param props.description An optional description displayed below the title.
 * @param props.isSelectable Boolean responsible to display or not the checkbox input.
 * @param props.collapsibleProps Object allow the list to be transformed in a collapsible list and to hide its content.
 * @param props.onCheckboxChange Callback triggered when the checkbox value changes.
 * @param props.buttons A list of buttons to display in the header, after 2 of them, the other actions will be pushed to a dropdown menu.
 * @param props.dropdownConfig An optionnal object, dropdown config such as the max number of actions displayed inline or the dropdown component fields.
 */
const Header: React.FC<HeaderProps> = ({
  id,
  className,
  title,
  description,
  isSelectable = false,
  onCheckboxChange,
  buttons,
  dropdownConfig,
  collapsibleProps,
  onCollapse,
  isCollapseOpen,
  ...props
}) => {
  const { indeterminateState, selectAll } = useCheckboxContext();
  const { actions, dropdownMenuProps } = useSplitActionsByDisplayOrder({
    actions: buttons || [],
    dropdownConfig: dropdownConfig,
  });

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
        {
          "justify-between bg-surface-default-weaker":
            indeterminateState !== "checked",
        },
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

      <div className="flex items-center gap-sm">
        {actions?.map((action) => (
          <Button key={action.id} {...action}>
            {action?.label}
          </Button>
        ))}
        {dropdownMenuProps && <DropdownMenu {...dropdownMenuProps} />}
        {collapsibleProps && (
          <Button
            color="default"
            intent="flat"
            size="md"
            className={`w-fit transform transition-transform duration-300 ease-in-out ${
              isCollapseOpen ? "rotate-0" : "-rotate-90"
            }`}
            iconRight="chevron-down"
            onClick={onCollapse}
          />
        )}
      </div>
    </div>
  );
};

Header.displayName = "KaizenListHeader";

export default Header;
