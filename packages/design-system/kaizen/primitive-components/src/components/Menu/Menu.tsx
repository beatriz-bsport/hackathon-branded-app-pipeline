import React, { useCallback, useMemo } from "react";
import MenuItem from "#src/components/MenuItem";
import type { MenuType } from "#src/components/Menu/types";

export type MenuProps = React.HTMLAttributes<HTMLDivElement> & MenuType;
/**
 * StandaloneMenu is a React functional component that renders a list of menu items.
 * It supports various item types such as titles, dividers, and selectable options (radio or checkbox).
 * This component does not use a popover wrapper and is rendered as-is.
 * @param  props.className - Additional class names for the menu container.
 * @param props.disabled - Whether the menu is disabled.
 * @param props.items - Array of menu items to render. Each item can be a title, divider, or selectable option.
 * @param props.multiSelect - Enables multi-selection for the menu options. If true, checkboxes are used; otherwise, radio buttons are used.
 * @param props.onSelectOption - Callback fired when a menu item is selected. Receives the selected item ID as an argument.
 * @param props.selectedValues - Array of selected item IDs (for multiSelect mode) or a single selected item ID (for single select mode).
 */
const Menu: React.FC<MenuProps> = ({
  className,
  disabled,
  items = [],
  multiSelect,
  onSelectOption,
  selectedValues,
  ...props
}) => {
  const handleSelectOption = useCallback(
    (menuItemId: string) => () => {
      onSelectOption?.(menuItemId);
    },
    [onSelectOption],
  );

  if (!items.length) {
    console.warn("The Menu component should have at least one item to render.");
  }

  const menuItems = useMemo(() => {
    return items.map((item, itemIndex) => {
      if (item.type === "divider")
        return <MenuItem type="divider" key={`divider:${itemIndex}`} />;

      if (item.type === "title")
        return (
          <MenuItem
            type="title"
            label={item.label}
            key={`title:${item.label}`}
          />
        );

      return multiSelect ? (
        <MenuItem
          type="checkbox"
          disabled={disabled}
          label={item.label}
          avatar={item.avatar}
          iconLeft={item.iconLeft}
          value={selectedValues?.includes(item.id) ? "checked" : "unchecked"}
          id={item.id}
          key={item.id}
          onClick={handleSelectOption(item.id)}
        />
      ) : (
        <MenuItem
          type="radio"
          disabled={disabled}
          label={item.label}
          avatar={item.avatar}
          iconLeft={item.iconLeft}
          value={item.id}
          id={item.id}
          key={item.id}
          checked={selectedValues?.[0] === item.id}
          onChange={handleSelectOption(item.id)}
        />
      );
    });
  }, [items, multiSelect, disabled, selectedValues, handleSelectOption]);

  return (
    <div className={className} {...props}>
      <ul role="menu" className="flex flex-col gap-xs pb-xs">
        {menuItems}
      </ul>
    </div>
  );
};

Menu.displayName = "KaizenMenu";

export default Menu;
