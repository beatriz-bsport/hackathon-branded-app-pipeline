import { useMemo } from "react";

import type { MenuOption } from "#src/components/Menu/types";

import type { MapIdToOption } from "../types";

const SELECTED_PREFIX = "autocomplete-selected-";

export const getSelectedId = (id: string) =>
  id.startsWith(SELECTED_PREFIX) ? id : `${SELECTED_PREFIX}${id}`;

export const getRootId = (id: string) =>
  id.startsWith(SELECTED_PREFIX) ? id.replace(SELECTED_PREFIX, "") : id;

type UseSelectedItemsProps = {
  value: string[];
  mapIdToOption: MapIdToOption;
};

/**
 * Derive the data needed to render selected items inside the menu's
 * "Selected" section and to highlight selected rows in the base list.
 *
 * Why prefixed ids?
 *   The same option can appear twice in the menu (Selected section + base
 *   list). Prefixed ids let the menu distinguish the two occurrences while
 *   `selectedItemsIds` keeps both forms so highlight checks work.
 */
export const useSelectedItems = ({
  value,
  mapIdToOption,
}: UseSelectedItemsProps) => {
  const primitiveValue = value.join(",");

  const selectedItems: MenuOption[] = useMemo(() => {
    return primitiveValue
      .split(",")
      .filter(Boolean)
      .map((id) => mapIdToOption.get(id))
      .filter((option) => !!option)
      .map((option) => ({ ...option, id: getSelectedId(option.id) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primitiveValue, mapIdToOption]);

  const selectedItemsIds = useMemo(
    () =>
      new Set(selectedItems.flatMap((item) => [item.id, getRootId(item.id)])),
    [selectedItems],
  );

  return { selectedItems, selectedItemsIds };
};
