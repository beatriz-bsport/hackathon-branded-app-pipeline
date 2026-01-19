import { useCallback, useEffect, useMemo, useState } from "react";

import type { MenuOption } from "#src/components/Menu/types";

import type {
  MapIdToOption,
  MultiSelectAutocompleteProps,
  SingleSelectAutocompleteProps,
} from "../types";

export type UseSelectedItemsProps = {
  defaultSelectedIds: string[];
  mapIdToOption: MapIdToOption;
  onToggleItem?: ({
    prev,
    toggledItem,
  }: {
    prev: string[];
    toggledItem: string;
  }) => string[];
} & (MultiSelectAutocompleteProps | SingleSelectAutocompleteProps);

const SELECTED_PREFIX = "autocomplete-selected-";

const getSelectedId = (id: string) =>
  id.startsWith(SELECTED_PREFIX) ? id : `${SELECTED_PREFIX}${id}`;

const getRootId = (id: string) =>
  id.startsWith(SELECTED_PREFIX) ? id.replace(SELECTED_PREFIX, "") : id;

export const useSelectedItems = ({
  defaultSelectedIds,
  mapIdToOption,
  multiSelect,
  onSelect,
  onToggleItem,
}: UseSelectedItemsProps) => {
  /**
   * Store the selected items with all the data.
   * Why not storing ids only ?
   * Because when the search input is changing, for remote search,
   * the base items are changing as well. Thus, the menu needs
   * all the data directly available from selectedItems.
   */
  const [selectedItems, setSelectedItems] = useState<MenuOption[]>([]);

  /**
   * Issue - mapIdToOption & defaultSelectedIds are several renders behind.
   *
   * 1. We need to wait for both to be defined to set the initial value for selectedItems.
   * Because defaultSelectedIds may be a new reference on each render, we use primitive string
   * to limit the number of dependencies updates.
   *
   * 2. Based on the result of the useMemo, we want to trigger the update of the initial for selectedItems.
   * However, for remote search, items are dynamically updated, and mapIdToOption as well.
   * Thus, we need to use primitive comparison to trigger the useEffect that update the state.
   */
  const primitiveSelectedIds = defaultSelectedIds.join(",");

  const initialItems = useMemo(() => {
    return primitiveSelectedIds
      .split(",")
      .map((id) => mapIdToOption.get(id))
      .filter((option) => !!option)
      .map((option) => ({ ...option, id: getSelectedId(option.id) }));
  }, [primitiveSelectedIds, mapIdToOption]);

  const primitiveInitialItemsIds = initialItems
    .map((item) => item.id)
    .sort()
    .join(",");

  useEffect(() => {
    setSelectedItems(initialItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primitiveInitialItemsIds]);

  /**
   * The Set of selected ids for an efficient lookup
   */
  const selectedItemsIds = useMemo(
    () =>
      new Set(
        selectedItems.flatMap((item: MenuOption) => [
          item.id,
          getRootId(item.id),
        ]),
      ),
    [selectedItems],
  );

  /**
   * Handle the "Add" or "Remove" management of the selectedItems state,
   * based on multiSelect and current state.
   * The toggle can be triggered from both the Selected Items section and the base list.
   */
  const toggleItem = useCallback(
    (itemId: string) => {
      const selectedId = getSelectedId(itemId);
      const rootId = getRootId(itemId);
      const item = mapIdToOption.get(rootId);

      setSelectedItems((prev) => {
        // Apply custom logic if provided
        if (onToggleItem) {
          const previousIds = prev.map((option) => getRootId(option.id));
          const updatedIds = onToggleItem({
            prev: previousIds,
            toggledItem: rootId,
          });

          return updatedIds
            .map((id) => mapIdToOption.get(id))
            .filter((item) => !!item)
            .map((option) => ({
              ...option,
              id: getSelectedId(option.id),
            }));
        }

        // Else fallback to basic "remove if present, else append"
        const isItemInSelection = prev.some(
          (selectedItem) => selectedItem.id === selectedId,
        );

        /**
         * Reset to base ids before passing it to the custom toggleItem logic
         */

        if (isItemInSelection) {
          return prev.filter((selectedItem) => selectedItem.id !== selectedId);
        }

        if (!item) return prev;

        const nextSelectedItem = { ...item, id: selectedId };

        if (multiSelect) {
          return [...prev, nextSelectedItem];
        }

        return [nextSelectedItem];
      });

      return item;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapIdToOption, multiSelect],
  );

  useEffect(() => {
    if (!onSelect) return;

    if (multiSelect) {
      onSelect(selectedItems.map((item) => getRootId(item.id)));
    } else {
      onSelect(
        selectedItems?.length > 0 ? getRootId(selectedItems[0].id ?? "") : "",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, multiSelect]);

  return {
    selectedItems,
    selectedItemsIds,
    toggleItem,
  };
};
