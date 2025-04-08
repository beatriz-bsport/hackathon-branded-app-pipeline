import { cva, cx } from "class-variance-authority";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import Collapse from "#src/components/Collapse";
import Icon from "#src/components/Icon";
import { useNavigationMenuContext } from "#src/components/NavigationMenu/Context";
import SubItem from "#src/components/NavigationMenu/SubItem";

import type { NavigationMenuItem } from "./types";

const defaultClasses = [
  "group",
  "h-xl min-h-xl w-full",
  "rounded-md",
  "p-xs",
  "justify-between",
  "cursor-pointer",
  "border-none outline-none",
  "transition ease-out duration-long",
  // Flex config
  "flex flex-row items-center justify-start",
  // States
  "hover:bg-surface-action-default-weak-hovered",
  "focus-visible:bg-surface-action-default-weak-hovered",
  "active:bg-surface-action-default-weak-pressed",
];

const navigationMenuItem = cva(defaultClasses);

type BaseItemProps = Omit<NavigationMenuItem, "subItems"> & {
  onClick?: (e: MouseEvent) => void;
};

type SubItemsProps = BaseItemProps & {
  subItems: NavigationMenuItem["subItems"];
  children?: never;
};

type ChildrenProps = BaseItemProps & {
  subItems?: never;
  children?: React.ReactNode;
};

export type ItemProps = SubItemsProps | ChildrenProps;

/**
 * Item
 *
 * A component representing a menu item in a navigation menu, supporting expandable sub-items and dynamic interactions.
 * This component uses the `Context` to manage the state of selected and open items.
 *
 * @param  props.id - Unique identifier for the menu item.
 */
const Item: React.FC<ItemProps> = (props) => {
  const {
    id,
    icon,
    label,
    endSlot,
    subItems,
    children,
    href,
    target,
    onClick,
  } = props;
  const context = useNavigationMenuContext();

  // Use context values only if props are not provided
  const {
    selectedItemId,
    openMenuId,
    setOpenMenuId = () => {},
    onItemClick,
    setSelectedItemId = () => {},
  } = context || {};
  const subItemsRef = useRef<HTMLDivElement | null>(null);
  const isOpen = openMenuId === id;
  const isActive = React.useMemo(() => {
    if (id === selectedItemId) return true;

    // when a subitem is selected and it is collapsed we set the parent as active
    if (subItems?.some((subItem) => subItem.id === selectedItemId)) {
      return !isOpen;
    }

    // when a child is selected and it is collapsed we set the parent as active
    if (children) {
      const childrenArray = React.Children.toArray(children);
      const hasActiveChild = childrenArray.some(
        (child) =>
          React.isValidElement(child) && child.props.id === selectedItemId,
      );
      return hasActiveChild && !isOpen;
    }

    return false;
  }, [id, selectedItemId, isOpen, subItems, children]);

  const hasSubitems = !!subItems?.length || !!children;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        subItemsRef.current?.classList.add("hidden");
      }, 500);
    }
    if (isOpen && subItemsRef.current?.classList.contains("hidden")) {
      subItemsRef.current?.classList.remove("hidden");
    }
  }, [isOpen]);

  return (
    <Collapse id={id} className="mb-2xs last:mb-[0px]">
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
          const content = useMemo(
            () => (
              <>
                <div
                  className={cx(
                    "flex transition-all duration-normal items-center gap-xs overflow-hidden",
                    {
                      "text-onsurface-main-weak": isActive,
                      "text-onsurface-default": !isActive,
                      "font-stronger":
                        isActive &&
                        (!hasSubitems || (hasSubitems && !isCollapseOpen)),
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
                        "transform transition-transform duration-long text-onsurface-default",
                        isCollapseOpen ? "rotate-[-90deg]" : "rotate-90",
                      )}
                      icon="chevron-right"
                      size="sm"
                    />
                  )}
                </div>
              </>
            ),
            [icon, label, endSlot, hasSubitems, isActive, isCollapseOpen],
          );

          useEffect(() => {
            setIsCollapseOpen(openMenuId === id);
          }, [openMenuId]);

          const handleOnClick = useCallback(
            (e: MouseEvent) => {
              setOpenMenuId((prevState) => (prevState === id ? "" : id));
              if (!subItems?.length && !children) setSelectedItemId(id);
              if (onClick) onClick(e);
              else if (onItemClick) onItemClick(props)(e);
            },
            [setOpenMenuId, id, onItemClick],
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
              {content}
            </a>
          ) : (
            <button
              role="button"
              tabIndex={0}
              className={navigationMenuItem()}
              onClick={handleOnClick}
              {...collapseProps}
            >
              {content}
            </button>
          );
        }}
      </Collapse.Controller>
      {(hasSubitems || children) && (
        <Collapse.Content>
          <div ref={subItemsRef}>
            {subItems?.map(({ id, label }) => (
              <SubItem id={id} label={label} key={id} />
            ))}
            {children}
          </div>
        </Collapse.Content>
      )}
    </Collapse>
  );
};

Item.displayName = "KaizenNavigationMenuItem";

export default Item;
