import classNames from "classnames";
import React, { useMemo } from "react";

import Avatar from "#src/components/Avatar";
import Button from "#src/components/Button";
import Chip from "#src/components/Chip";
import Icon from "#src/components/Icon";
import { sortableListItem } from "#src/components/SortableList/SortableList";
import type { Sortable } from "#src/components/SortableList/types";

export type ListItemProps = React.HTMLAttributes<HTMLLIElement> & Sortable;

/**
 * A list item component that displays a title, optional description, and various widgets
 * like avatars, icons, chips, and buttons. Used to construct a list with
 * customizable behavior for each item.
 * @param props.className Classname to add to the list item container.
 * @param props.title The main title of the list item.
 * @param props.rightTitle An additional title displayed on the right side of the item.
 * @param props.description An optional description displayed below the title.
 * @param props.icon Name of the icon to display within the item.
 * @param props.avatar Configuration for the avatar component within the item.
 * @param props.chips An array of chips to display, up to 3, with details about their labels and styles.
 * @param props.chipsDirection Direction for displaying the chips: "start" or "end".
 * @param props.buttons An array of button configurations, up to 3, displayed within the item.
 * @param props.id The id of the item.
 */
const Item: React.FC<ListItemProps> = ({
  id,
  className,
  title,
  rightTitle,
  description,
  icon,
  avatar,
  chips,
  chipsDirection = "start",
  buttons,
  ...props
}) => {
  const renderedChips = useMemo(
    () =>
      chips ? (
        <div className="flex items-center gap-2xs">
          {chips.map((chip) => (
            <Chip key={chip.label} {...chip} />
          ))}
        </div>
      ) : null,
    [chips],
  );

  return (
    <li
      id={id}
      className={classNames(sortableListItem({ className }))}
      {...props}
    >
      <div className="flex items-center gap-sm text-onsurface-default">
        <Icon
          icon="align-justify"
          size="sm"
          className="cursor-grab text-onsurface-weaker"
        />
        {(avatar && <Avatar {...avatar} />) ||
          (icon && <Icon icon={icon} size="md" />) ||
          null}
        <div className="flex flex-col items-start gap-2xs max-w-[500px]">
          <span className="text-onsurface-default text-body-lg leading-md">
            {title}
          </span>
          {description && (
            <span className="text-onsurface-weak text-body-md leading-sm">
              {description}
            </span>
          )}
        </div>
        {chipsDirection === "start" && renderedChips}
      </div>
      <div className="flex items-center gap-sm">
        {rightTitle && (
          <span className="text-onsurface-default text-body-lg leading-md">
            {rightTitle}
          </span>
        )}
        {chipsDirection === "end" && renderedChips}
        {buttons && (
          <div className="flex items-center gap-sm">
            {buttons.map((button) => (
              <Button key={button.id} {...button} />
            ))}
          </div>
        )}
      </div>
    </li>
  );
};

Item.displayName = "KaizenListItem";

export default Item;
