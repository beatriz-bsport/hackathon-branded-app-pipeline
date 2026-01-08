import classNames from "classnames";
import React from "react";

import Button from "#src/components/Button";
import DropdownMenu from "#src/components/DropdownMenu";
import Icon from "#src/components/Icon";
import { sortableListItem } from "#src/components/SortableList/SortableList";
import type { ActionButton, ActionsDropdownConfig } from "#src/hooks";
import useSplitActionsByDisplayOrder from "#src/hooks/use-split-actions-by-display-order";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type SortableListHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  collapseController?: () => void;
  isCollapseOpen: boolean;
} & {
  id: string;
  title: string;
  description?: string;
  buttons?: ActionButton[];
  dropdownConfig?: ActionsDropdownConfig;
  isDraggable?: boolean;
};

/**
 * A header component for rendering the top section of a Sortable list.
 * It provides a title, an optional description, a checkbox to select all items, and a set of buttons for actions.
 * @param props.className Classname to add to the list header container.
 * @param props.title The title text for the header.
 * @param props.id The id of the Header.
 * @param props.description An optional description displayed below the title.
 * @param props.buttons A list of buttons to display in the header, after 2 of them, the other actions will be pushed to a dropdown menu.
 * @param props.dropdownConfig An optional object, dropdown config such as the max number of actions displayed inline or the dropdown component fields.
 * @param props.collapseController The callback responsible for opening and closing the collapse.
 * If it's defined, an Icon is displaid on the right of the component to trigger this function.
 */
const Header: React.FC<SortableListHeaderProps> = ({
  buttons,
  className,
  collapseController,
  description,
  id,
  isCollapseOpen,
  title,
  dropdownConfig,
  isDraggable,
  ...props
}) => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });
  const { actions, dropdownMenuProps } = useSplitActionsByDisplayOrder({
    actions: buttons || [],
    dropdownConfig: dropdownConfig,
  });

  return (
    <div
      data-component="Kaizen-SortableList-Header"
      id={id}
      className={classNames(
        "bg-surface-default-weaker",
        sortableListItem({ className }),
      )}
      draggable
      {...props}
    >
      <div className="flex items-center gap-xs text-onsurface-default">
        {isDraggable && (
          <Icon
            icon="align-justify"
            size="sm"
            className="cursor-grab text-onsurface-weaker"
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
        {collapseController && (
          <Button
            kind="icon-button"
            label={isCollapseOpen ? t("list.collapse") : t("list.expand")}
            icon="chevron-down"
            color="default"
            intent="flat"
            size="md"
            className={`w-fit transform transition-transform duration-300 ease-in-out ${
              isCollapseOpen ? "rotate-0" : "-rotate-90"
            }`}
            onClick={collapseController}
          />
        )}{" "}
      </div>
    </div>
  );
};

Header.displayName = "KaizenListHeader";

export default Header;
