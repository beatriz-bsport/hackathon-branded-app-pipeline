import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { cva, cx } from "class-variance-authority";
import Collapse from "#src/components/Collapse";
import Icon from "#src/components/Icon";
import SubItem from "#src/components/NavigationMenu/SubItem";
import { useNavigationMenuContext } from "#src/components/NavigationMenu/Context";

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

export type ItemProps = {
  id: string;
};

/**
 * Item
 *
 * A component representing a menu item in a navigation menu, supporting expandable sub-items and dynamic interactions.
 * This component uses the `Context` to manage the state of selected and open items.
 *
 * @param  props.id - Unique identifier for the menu item.
 */
const Item: React.FC<ItemProps> = ({ id }) => {
  const {
    selectedItemId,
    openMenuId,
    setOpenMenuId,
    onItemClick,
    setSelectedItemId,
    itemsById,
  } = useNavigationMenuContext();

  const item = itemsById[id];

  const { icon, label, endSlot, subItems, href, target } = item;
  const subItemsRef = useRef<HTMLDivElement | null>(null);
  const isOpen = openMenuId === id;
  const isActive =
    (subItems?.some((subItem) => subItem.id === selectedItemId) && !isOpen) ||
    id === selectedItemId;
  const hasSubitems = !!subItems?.length;

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
              if (!subItems?.length) setSelectedItemId(id);
              return onItemClick?.(item)(e);
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
      {hasSubitems && (
        <Collapse.Content>
          <div ref={subItemsRef}>
            {subItems.map((subItem) => (
              <SubItem subItem={subItem} key={subItem.id} />
            ))}
          </div>
        </Collapse.Content>
      )}
    </Collapse>
  );
};

Item.displayName = "KaizenNavigationMenuItem";

export default Item;
