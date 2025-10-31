import React, { useCallback, useId, useMemo, useState } from "react";

import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";
import TextField from "#src/components/TextField";

import type { DropdownMenuManagedProps } from "./DropdownMenu";

/**
 * DropdownMenuManaged - Internal component for managed (non-composable) API
 * This component provides a turnkey dropdown experience with pre-wired state and popover handling
 */
export function DropdownMenuManaged(props: DropdownMenuManagedProps) {
  const {
    className,
    target,
    onSelectOption,
    placement,
    selectedValues: legacySelectedValues,
    multiSelect,
    searchConfig,
    items,
    maxHeightPx,
    fullWidth,
    defaultOpened: opened,
  } = props;

  const textFieldId = useId();

  const [internalSearch, setInternalSearch] = useState("");

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

  const query =
    searchConfig?.value !== undefined ? searchConfig.value : internalSearch;

  const filteredItems = useMemo(() => {
    if (!query) {
      return items;
    }

    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      if (item.type === "divider" || item.type === "title") {
        return false;
      }

      return item.label?.toLowerCase().includes(lowerQuery);
    });
  }, [items, query]);

  return (
    <Popover className={className} opened={opened} fullWidth={fullWidth}>
      <Popover.Anchor>{target}</Popover.Anchor>
      <Popover.Content placement={placement} maxHeightPx={maxHeightPx}>
        {({ setIsPopoverOpened }) => (
          <div>
            {searchConfig?.placeholder && (
              <div className="mb-xs">
                <TextField
                  id={textFieldId}
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
                multiSelect={multiSelect}
                onSelectOption={(id: string) => {
                  onSelectOption({
                    id,
                    setIsPopoverOpened,
                  });
                }}
                selectedValues={legacySelectedValues}
              />
            )}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
