import React from "react";
import classNames from "classnames";
import Button from "#src/components/Button";
import { sortableListItem } from "#src/components/SortableList/SortableList";
import Icon from "#src/components/Icon";
import type { ListHeader } from "./types";

export type ListHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  collapseController?: () => void;
  isCollapseOpen: boolean;
} & ListHeader;

/**
 * A header component for rendering the top section of a Sortable list.
 * It provides a title, an optional description, a checkbox to select all items, and a set of buttons for actions.
 * @param props.className Classname to add to the list header container.
 * @param props.title The title text for the header.
 * @param props.id The id of the Header.
 * @param props.description An optional description displayed below the title.
 * @param props.buttons A list of buttons to display in the header, up to 3.
 * @param props.collapseController The callback responsible for opening and closing the collapse.
 * If it's defined, an Icon is displaid on the right of the component to trigger this function.
 * @param props.collapseController. A boolean set by collapseController
 */
const Header: React.FC<ListHeaderProps> = ({
  buttons,
  className,
  collapseController,
  description,
  id,
  isCollapseOpen,
  title,
  ...props
}) => {
  return (
    <div
      id={id}
      className={classNames(sortableListItem({ className }))}
      draggable
      {...props}
    >
      <div className="flex items-center gap-xs text-onsurface-default">
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
        {collapseController && (
          <Icon
            icon="chevron-down"
            size="sm"
            onClick={collapseController}
            className={classNames(
              "cursor-pointer transition-all ease-in-out duration-extra-long",
              { "rotate-180": isCollapseOpen },
            )}
          />
        )}
        {buttons && (
          <div className="flex items-center gap-sm">
            {buttons.map((button) => (
              <Button key={button.id} {...button} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Header.displayName = "KaizenListHeader";

export default Header;
