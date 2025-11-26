import { cva, cx } from "class-variance-authority";
import React, { MouseEvent, useCallback, useEffect, useState } from "react";

import Collapse from "#src/components/Collapse";
import Icon from "#src/components/Icon";
import type { IconName } from "#src/components/Icon";
import { useNavigationMenuContext } from "#src/components/NavigationMenu/Context";
import { ItemProvider } from "#src/components/NavigationMenu/ItemContext";
import type { NavigationMenuItem } from "#src/components/NavigationMenu/types";

const defaultClasses = [
  "group",
  "h-xl min-h-xl w-full",
  "rounded-md",
  "p-xs",
  "cursor-pointer",
  "border-none outline-none",
  "transition ease-out duration-default",
  // Flex config
  "flex flex-row items-center justify-between",
  // States
  "hover:bg-surface-action-default-weak-hovered",
  "focus-visible:bg-surface-action-default-weak-hovered",
  "active:bg-surface-action-default-weak-pressed",
];

const navigationMenuItem = cva(defaultClasses);

export type ItemProps = NavigationMenuItem & {
  onClick?: (e: MouseEvent) => void;
  disableSelection?: boolean;
  children?: React.ReactNode;
};

/**
 * Item
 *
 * A component representing a menu item in a navigation menu, supporting expandable sub-items and dynamic interactions.
 * This component uses the `Context` to manage the state of selected and open items.
 *
 * @param  props.id - Unique identifier for the menu item.
 * @param  props.label - The text label displayed for the menu item.
 * @param  props.icon - The icon displayed for the menu item.
 * @param  props.endSlot - Additional content to be displayed at the end of the menu item.
 * @param  props.children - Child elements to be displayed within the menu item.
 * @param  props.href - The URL to navigate to when the menu item is clicked.
 * @param  props.target - The target attribute for the link.
 * @param  props.onClick - Callback function to be executed when the menu item is clicked.
 * @param  props.active - Whether the menu item is active.
 * @param  props.disableSelection - Whether to disable automatic selection when the menu item is clicked.
 */
const Item: React.FC<ItemProps> = (props) => {
  const {
    id,
    icon,
    label,
    endSlot,
    children,
    href,
    target,
    onClick,
    active,
    disableSelection,
  } = props;
  const context = useNavigationMenuContext();

  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);

  // Use context values only if props are not provided
  const {
    selectedItemId,
    openMenuId,
    setOpenMenuId = () => {},
    onItemClick,
    setSelectedItemId = () => {},
  } = context || {};
  const isOpen = openMenuId === id;

  const isActive = React.useMemo(() => {
    if (id === selectedItemId) return true;

    // when a child is selected and it is collapsed we set the parent as active
    if (children) {
      const hasActiveChild = activeSubItemId === selectedItemId;
      return hasActiveChild && !isOpen;
    }

    return false;
  }, [id, activeSubItemId, selectedItemId, isOpen, children]);

  const hasSubitems = !!children;

  useEffect(() => {
    if (id !== selectedItemId && active) {
      setSelectedItemId(id);
    }
  }, [active, id, selectedItemId, setSelectedItemId]);

  // Auto-open parent group when it contains an active subitem
  useEffect(() => {
    if (activeSubItemId && activeSubItemId === selectedItemId && children) {
      setOpenMenuId(id);
    }
  }, [activeSubItemId]);

  const handleOnClick = useCallback(
    (event: MouseEvent) => {
      if (!disableSelection) {
        setOpenMenuId((prevState) => (prevState === id ? "" : id));
      }

      if (!disableSelection && !children) {
        setSelectedItemId(id);
      }

      if (onClick) {
        onClick(event);
      } else if (onItemClick) {
        onItemClick(props)(event);
      }
    },
    [
      setOpenMenuId,
      id,
      onItemClick,
      props,
      children,
      onClick,
      setSelectedItemId,
      disableSelection,
    ],
  );

  return (
    <ItemProvider
      activeSubItemId={activeSubItemId}
      setActiveSubItemId={setActiveSubItemId}
    >
      <Collapse id={id} className="mb-2xs last:mb-[0px]">
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => (
            <CollapseContent
              openMenuId={openMenuId}
              id={id}
              href={href}
              target={target}
              handleOnClick={handleOnClick}
              isActive={isActive}
              hasSubitems={hasSubitems}
              icon={icon}
              label={label}
              endSlot={endSlot}
              collapseProps={collapseProps}
              setIsCollapseOpen={setIsCollapseOpen}
              isCollapseOpen={isCollapseOpen}
            />
          )}
        </Collapse.Controller>
        {children && <Collapse.Content>{children}</Collapse.Content>}
      </Collapse>
    </ItemProvider>
  );
};

Item.displayName = "KaizenNavigationMenuItem";

export default Item;

type CollapseContentProps = {
  openMenuId: string;
  id: string;
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  handleOnClick: (event: MouseEvent) => void;
  isActive: boolean;
  hasSubitems: boolean;
  icon?: IconName;
  label: string;
  endSlot?: React.ReactNode;
  collapseProps: {
    "data-collapse-target": string;
    "aria-controls": string;
  };
  setIsCollapseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapseOpen: boolean;
};

const CollapseContent: React.FC<CollapseContentProps> = ({
  openMenuId,
  id,
  href,
  target,
  handleOnClick,
  isActive,
  hasSubitems,
  icon,
  label,
  endSlot,
  collapseProps,
  setIsCollapseOpen,
  isCollapseOpen,
}) => {
  useEffect(() => {
    setIsCollapseOpen(openMenuId === id);
  }, [openMenuId, setIsCollapseOpen, id]);

  const Content = () => (
    <>
      <div
        className={cx(
          "flex transition-all duration-normal items-center gap-xs overflow-hidden",
          {
            "text-onsurface-main-weak": isActive,
            "text-onsurface-default": !isActive,
            "font-stronger":
              isActive && (!hasSubitems || (hasSubitems && !isCollapseOpen)),
          },
        )}
      >
        {!!icon && <Icon icon={icon} size="sm" />}
        {!!label && (
          <span
            className={cx("font-size-body-md truncate w-full", {
              "pl-xs": !icon,
            })}
          >
            {label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-xs">
        {!!endSlot && <div className="flex">{endSlot}</div>}
        {hasSubitems && (
          <Icon
            className={cx(
              "transform transition-transform duration-default text-onsurface-default",
              isCollapseOpen ? "rotate-[-90deg]" : "rotate-90",
            )}
            icon="chevron-right"
            size="sm"
          />
        )}
      </div>
    </>
  );

  return href ? (
    <a
      role="link"
      tabIndex={0}
      href={href}
      target={target}
      className={navigationMenuItem()}
      onClick={handleOnClick}
      {...collapseProps}
    >
      <Content />
    </a>
  ) : (
    <button
      role="button"
      tabIndex={0}
      className={navigationMenuItem()}
      onClick={handleOnClick}
      {...collapseProps}
    >
      <Content />
    </button>
  );
};
