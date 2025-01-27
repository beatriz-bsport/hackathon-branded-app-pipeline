import React, { MouseEvent, useCallback, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import type { BaseItem } from "#src/components/NavigationMenu/types";
import { useNavigationMenuContext } from "#src/components/NavigationMenu/Context";

const navigationMenuSubItem = cva([
  "group",
  "flex flex-row items-center justify-start",
  "border-none outline-none",
  "h-lg min-h-lg",
  "w-full",
  "gap-xs",
  "transition ease-out duration-long",
]);

export type SubItemProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof navigationMenuSubItem> & {
    subItem: BaseItem;
  };

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
 */
const SubItem: React.FC<SubItemProps> = ({ className, subItem, ...props }) => {
  const { selectedItemId, setSelectedItemId, onItemClick } =
    useNavigationMenuContext();

  const selected = selectedItemId === subItem.id;

  const renderedLabel = useMemo(
    () =>
      subItem.label ? (
        <span
          className={classNames(
            "font-size-body-sm",
            selected ? "text-onsurface-main-weak" : "text-onsurface-weak",
          )}
        >
          {subItem.label}
        </span>
      ) : null,
    [subItem.label, selected],
  );

  const indicator = useMemo(
    () => (
      <div className="w-[0.125rem] h-full relative">
        {selected && (
          <div className="absolute w-full h-full bg-onsurface-main-weak rounded-sm" />
        )}
        <div className="absolute w-full h-full bg-surface-action-default-weak-hovered" />
      </div>
    ),
    [selected],
  );

  const handleOnClick = useCallback(
    (e: MouseEvent) => {
      setSelectedItemId(subItem.id);
      return onItemClick?.(subItem)(e);
    },
    [setSelectedItemId, onItemClick, subItem.id],
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
          [
            "h-[1.25rem] w-full",
            "px-2xs",
            "flex justify-start items-center",
            "rounded-sm",
          ],
          selected
            ? [
                "group-hover:bg-surface-action-main-selected-hovered",
                "group-focus-visible:bg-surface-action-main-selected-hovered",
                "group-active:bg-surface-action-main-selected-pressed",
              ]
            : [
                "group-hover:bg-surface-action-default-weak-hovered",
                "group-focus-visible:bg-surface-action-default-weak-hovered",
                "group-active:bg-surface-action-default-weak-pressed",
              ],
        )}
      >
        {renderedLabel}
      </div>
    </button>
  );
};

export default SubItem;
