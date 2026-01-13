import { type FC, useMemo } from "react";

import Chip from "#src/components/Chip";
import type { MenuOption } from "#src/components/Menu/types";

type AutocompleteChipsProps = {
  hideChips: boolean;
  multiSelect: boolean;
  selectedItems: MenuOption[];
  onDismissChip: (chipId: string) => void;
};

export const AutocompleteChips: FC<AutocompleteChipsProps> = ({
  hideChips,
  multiSelect,
  onDismissChip,
  selectedItems,
}) => {
  const chips = useMemo(() => {
    // Skip computation
    if (hideChips || !multiSelect) return [];

    return selectedItems
      .map((item) => {
        if (!item) return null;

        return {
          id: item.id,
          label: item.label || "",
          type: "weak" as const,
          color: "main" as const,
          size: "lg" as const,
          dismissible: true,
          onClick: () => {
            onDismissChip(item.id);
          },
        };
      })
      .filter((chip): chip is NonNullable<typeof chip> => chip !== null);
  }, [multiSelect, hideChips, selectedItems, onDismissChip]);

  if (hideChips || chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2xs">
      {chips.map((chip, index) => (
        <Chip key={`autocomplete-chip-${chip.id || index}`} {...chip} />
      ))}
    </div>
  );
};
