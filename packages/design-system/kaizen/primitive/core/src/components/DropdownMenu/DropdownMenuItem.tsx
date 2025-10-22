import MenuItem from "#src/components/Menu/MenuItem";
import { extractTextFromNode } from "#src/utils/extract-text-from-node";

import { useDropdownMenuContext } from "./DropdownMenuContext";
import type { DropdownMenuItemProps } from "./types";

/**
 * DropdownMenuItem - A selectable item within the DropdownMenu
 *
 * This component automatically filters itself based on the search value from context.
 * It handles both single and multi-select modes.
 *
 * @example
 * ```tsx
 * <DropdownMenu.Item id="edit" icon="pencil-02">
 *   Edit
 * </DropdownMenu.Item>
 * ```
 */
export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { id, children, disabled, icon, avatar, rightSlot, description } =
    props;

  const {
    searchValue,
    selectedValues,
    setSelectedValues,
    multiSelect,
    onSelectItem,
    closePopover,
  } = useDropdownMenuContext();

  const itemText = extractTextFromNode(children);

  if (searchValue) {
    const lowerQuery = searchValue.toLowerCase().trim();
    const matchesSearch =
      itemText.toLowerCase().includes(lowerQuery) ||
      (description?.toLowerCase()?.includes(lowerQuery) ?? false);

    if (!matchesSearch) {
      return null;
    }
  }

  const isSelected = selectedValues.includes(id);

  if (multiSelect) {
    const handleCheckboxClick = () => {
      if (disabled) {
        return;
      }

      const newSelectedValues = isSelected
        ? selectedValues.filter((value) => value !== id)
        : [...selectedValues, id];

      setSelectedValues(newSelectedValues);
      onSelectItem?.(id, newSelectedValues);
    };

    return (
      <MenuItem
        type="checkbox"
        id={id}
        label={itemText}
        onClick={handleCheckboxClick}
        disabled={disabled ?? false}
        iconLeft={icon}
        avatar={avatar}
        rightSlot={rightSlot}
        value={isSelected ? "checked" : "unchecked"}
        liHTMLAttributesProps={{
          role: "menuitemcheckbox",
          "aria-checked": isSelected,
        }}
      />
    );
  }

  const handleRadioChange = () => {
    if (disabled) {
      return;
    }

    setSelectedValues([id]);
    closePopover();
    onSelectItem?.(id, [id]);
  };

  return (
    <MenuItem
      type="radio"
      id={id}
      label={itemText}
      value={id}
      checked={isSelected}
      onChange={handleRadioChange}
      disabled={disabled ?? false}
      iconLeft={icon}
      avatar={avatar}
      rightSlot={rightSlot}
      description={description}
    />
  );
}
