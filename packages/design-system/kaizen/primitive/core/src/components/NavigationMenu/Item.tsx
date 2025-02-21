import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
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

const navigationMenuItem = cva(defaultClasses, {
  variants: {
    selected: {
      true: ["bg-onsurface-main-weak"],
      false: ["bg-surface-action-default-weak-hovered"],
    },
  },
});

export type ItemProps = VariantProps<typeof navigationMenuItem> & {
  id: string;
};

/**
 * Item
 *
 * A component representing a menu item in a navigation menu, supporting expandable sub-items and dynamic interactions.
 * This component uses the `Context` to manage the state of selected and open items.
 *
 * @param  props.id - Unique identifier for the menu item.
 * @param  props.selected - Defines if the menu item is selected.
 */
const Item: React.FC<ItemProps> = ({ id, selected }) => {
  const {
    selectedItemId,
    openItemId,
    setOpenItemId,
    onItemClick,
    setSelectedItemId,
    itemsById,
  } = useNavigationMenuContext();
  const item = itemsById[id];
  const { icon, label, rightSlot, subItems, href, target } = item;
  const subItemsRef = useRef<HTMLDivElement | null>(null);
  const isOpen = openItemId === id;
  const isActive =
    (subItems?.some((subItem) => subItem.id === selectedItemId) && !isOpen) ||
    id === selectedItemId;

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
    <Collapse id={id}>
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
          const content = useMemo(
            () => (
              <>
                <div
                  className={classNames(
                    "flex items-center gap-xs",
                    isActive
                      ? "text-onsurface-main-weak"
                      : "text-onsurface-default",
                  )}
                >
                  {!!icon && <Icon icon={icon} size="sm" />}
                  {!!label && (
                    <span className="font-size-body-md">{label}</span>
                  )}
                </div>
                <div className="flex items-center gap-xs">
                  {!!rightSlot && <div className="flex">{rightSlot}</div>}
                  {!!subItems?.length && (
                    <Icon
                      className={classNames(
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
            [icon, label, rightSlot, subItems],
          );

          useEffect(() => {
            setIsCollapseOpen(openItemId === id);
          }, [openItemId]);

          const handleOnClick = useCallback(
            (e: MouseEvent) => {
              setOpenItemId((prevState) => (prevState === id ? "" : id));
              if (!subItems?.length) setSelectedItemId(id);
              return onItemClick?.(item)(e);
            },
            [setOpenItemId, id, onItemClick],
          );

          return href ? (
            <a
              role="link"
              tabIndex={0}
              href={href}
              target={target}
              className={navigationMenuItem({ selected })}
              onClick={handleOnClick}
              {...collapseProps}
            >
              {content}
            </a>
          ) : (
            <button
              role="button"
              tabIndex={0}
              className={navigationMenuItem({ selected })}
              onClick={handleOnClick}
              {...collapseProps}
            >
              {content}
            </button>
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        <div ref={subItemsRef}>
          {!!subItems?.length &&
            subItems.map((subItem) => (
              <SubItem subItem={subItem} key={subItem.id} />
            ))}
        </div>
      </Collapse.Content>
    </Collapse>
  );
};

Item.displayName = "KaizenNavigationMenuItem";

export default Item;
