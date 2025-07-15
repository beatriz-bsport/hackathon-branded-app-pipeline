import React, {
  type ComponentProps,
  useCallback,
  useMemo,
  useState,
} from "react";

import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";
import TextField from "#src/components/TextField";

export type DropdownMenuItems = ComponentProps<typeof Menu>["items"];

export type DropdownMenuSearchConfig = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export type DropdownMenuProps = {
  className?: string;
  target: ComponentProps<typeof Popover.Anchor>["children"];
  placement?: ComponentProps<typeof Popover.Content>["placement"];
  items: DropdownMenuItems;
  onSelectOption: (params: {
    id: string;
    setIsPopoverOpened: (value: boolean) => void;
  }) => void;
  selectedValues?: ComponentProps<typeof Menu>["selectedValues"];
  searchConfig?: DropdownMenuSearchConfig;
};

/**
 * DropdownMenu
 * @param props.className - Optional CSS class name for the component.
 * @param props.target - Render callback for the popover anchor.
 * @param props.placement - Placement of the popover.
 * @param props.items - Items to be rendered inside the menu.
 * @param props.onSelectOption - Callback invoked when an item is selected.
 * @param props.selectedValues - Selected item IDs (single or multiple).
 * @param props.searchConfig - Optional search configuration (placeholder, value, onChange).
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-dropdownmenu--docs
 **/
export default function DropdownMenu({
  className,
  target,
  items,
  onSelectOption,
  placement,
  selectedValues,
  searchConfig,
}: DropdownMenuProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const query =
    searchConfig?.value !== undefined ? searchConfig.value : internalSearch;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (searchConfig?.onChange) {
        searchConfig.onChange(value);
      } else {
        setInternalSearch(value);
      }
    },
    [searchConfig],
  );

  const handleClear = useCallback(() => {
    if (searchConfig?.onChange) {
      searchConfig.onChange("");
    } else {
      setInternalSearch("");
    }
  }, [searchConfig]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      if (item.type === "divider" || item.type === "title") return false;
      return item.label?.toLowerCase().includes(lowerQuery);
    });
  }, [items, query]);

  return (
    <Popover className={className}>
      <Popover.Anchor>{target}</Popover.Anchor>
      <Popover.Content placement={placement}>
        {({ setIsPopoverOpened }) => (
          <div>
            {searchConfig?.placeholder && (
              <div className="mb-xs">
                <TextField
                  id="dropdown-menu-search"
                  type="search"
                  placeholder={searchConfig.placeholder}
                  value={query}
                  onChange={handleSearchChange}
                  onClear={handleClear}
                  fullWidth
                />
              </div>
            )}
            {filteredItems.length > 0 && (
              <Menu
                items={filteredItems}
                onSelectOption={(id: string) => {
                  onSelectOption({
                    id,
                    setIsPopoverOpened,
                  });
                }}
                selectedValues={selectedValues}
              />
            )}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
