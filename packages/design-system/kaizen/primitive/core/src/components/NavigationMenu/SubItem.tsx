import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import React, { MouseEvent, useCallback, useEffect, useMemo } from "react";

import { useNavigationMenuContext } from "#src/components/NavigationMenu/Context";
import type { BaseItem } from "#src/components/NavigationMenu/types";

import Body from "../Body";
import { useItemContext } from "./ItemContext";

const navigationMenuSubItem = cva([
  "group",
  "flex flex-row items-center justify-start",
  "border-none outline-none",
  "h-[26px] min-h-lg",
  "w-full",
  "gap-2xs",
  "pl-md",
  "transition ease-out duration-long",
]);

const navigationMenuSubItemLabel = cva(
  [
    "w-full",
    "text-left align-middle",
    "rounded-sm",
    "px-xs py-[2px]",
    "font-size-body-sm",
    "transition-all duration-normal",
  ],
  {
    variants: {
      selected: {
        true: [
          "group-hover:bg-surface-action-main-selected-hovered",
          "group-focus-visible:bg-surface-action-main-selected-hovered",
          "group-active:bg-surface-action-main-selected-pressed",
          "text-onsurface-main-weak",
        ],
        false: [
          "group-hover:bg-surface-action-default-weak-hovered",
          "group-focus-visible:bg-surface-action-default-weak-hovered",
          "group-active:bg-surface-action-default-weak-pressed",
          "text-onsurface-weak",
        ],
      },
    },
  },
);

export type SubItemProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof navigationMenuSubItem> &
  BaseItem;

/**
 * SubItem
 *
 * A sub-item component for a navigation menu, allowing users to select an item and update the navigation state.
 *
 * This component uses the `Context` to manage selection state and triggers the `onClick` handler when clicked.
 * It also visually indicates the selected state of the sub-item.
 *
 * @param  props.className - Additional CSS classes for custom styling.
 * @param  props.id - Unique identifier for the navigation sub-item.
 * @param  props.label - The text label displayed for the navigation sub-item.
 * @param  props.active - Whether the sub-item is active.
 */
const SubItem: React.FC<SubItemProps> = ({
  className,
  id,
  label,
  active,
  endSlot,
  ...props
}) => {
  const { selectedItemId, setSelectedItemId, onItemClick } =
    useNavigationMenuContext();

  const { setActiveSubItemId } = useItemContext();

  const selected = selectedItemId === id;

  const indicator = useMemo(
    () => (
      <div className="w-[0.125rem] h-full relative">
        <div
          className={classNames("absolute w-full h-full", {
            "bg-onsurface-main-weak rounded-sm": selected,
            "bg-surface-action-default-weak-hovered": !selected,
          })}
        />
      </div>
    ),
    [selected],
  );

  useEffect(() => {
    if (id !== selectedItemId && active) {
      setSelectedItemId(id);
      setActiveSubItemId(id);
    }
  }, [active]);

  const handleOnClick = useCallback(
    (e: MouseEvent) => {
      setSelectedItemId(id);
      setActiveSubItemId(id);
      return onItemClick?.({ id, label })(e);
    },
    [setSelectedItemId, onItemClick, id, label],
  );

  return (
    <button
      role="button"
      tabIndex={0}
      className={navigationMenuSubItem({ className })}
      onClick={handleOnClick}
      {...props}
    >
      {indicator}
      <div
        className={classNames(
          "flex items-center w-full gap-xs",
          navigationMenuSubItemLabel({ selected }),
        )}
      >
        <Body
          htmlVariant="p"
          size="md"
          color="inherit"
          weight={selected ? "stronger" : "weak"}
        >
          {label}
        </Body>
        {!!endSlot && (
          <div className="ml-auto flex items-center">{endSlot}</div>
        )}
      </div>
    </button>
  );
};

export default SubItem;
