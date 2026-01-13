import { useCallback, useEffect, useMemo, useState } from "react";

import type { MenuOption } from "#src/components/Menu/types";

import type {
  MapIdToOption,
  MultiSelectAutocompleteProps,
  SingleSelectAutocompleteProps,
} from "../types";

export type UseSelectedItemsProps = {
  /**
   * @todo Insert setters to control the data
   */
  defaultSelectedIds: string[];
  mapIdToOption: MapIdToOption;
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
}: UseSelectedItemsProps) => {
  const initialSelectedItemsValue = defaultSelectedIds
    .map((id) => mapIdToOption.get(id))
    .filter((option) => !!option)
    .map((option) => ({ ...option, id: getSelectedId(option.id) }));

  /**
   * Store the selected items with all the data.
   * Why not storing ids only ?
   * Because when the search input is changing, for remote search,
   * the base items are changing as well. Thus, the menu needs
   * all the data directly available from selectedItems.
   */
  const [selectedItems, setSelectedItems] = useState<MenuOption[]>(
    initialSelectedItemsValue,
  );

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
        const isItemInSelection = prev.some(
          (selectedItem) => selectedItem.id === selectedId,
        );

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
    setSelectedItems,
    toggleItem,
  };
};
