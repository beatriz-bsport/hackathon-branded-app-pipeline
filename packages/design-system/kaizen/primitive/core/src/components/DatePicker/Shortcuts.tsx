import React, { useEffect, useState } from "react";

import Menu from "#src/components/Menu";
import type { MenuOption, TitleItem } from "#src/components/Menu/types";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { SelectedDate } from "./DatePicker";

const SHORTCUT_MENU_MIN_WIDTH = 220;

export type ShortcutItem = {
  id: string;
  label: string;
  getDate: () => SelectedDate;
};

type ShortcutsProps = {
  items: ShortcutItem[];
  onSelect: (shortcutLabel: string) => void;
  resetSelection: boolean;
};

const Shortcuts: React.FC<ShortcutsProps> = ({
  items,
  onSelect,
  resetSelection,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [selectedShortcut, setSelectedShortcut] = useState("");

  useEffect(() => {
    if (resetSelection) {
      setSelectedShortcut("");
    }
  }, [resetSelection]);

  const menuItems: (TitleItem | MenuOption)[] = [
    { type: "title", label: t("datePicker.shortcutsTitle") },
    ...items.map((item) => ({
      id: item.label,
      label: item.label,
      type: null,
    })),
  ];

  const handleSelect = (shortcutId: string) => {
    setSelectedShortcut(shortcutId);
    onSelect(shortcutId);
  };

  return (
    <Menu
      data-component="Kaizen-DatePicker-ShortcutsMenu"
      items={menuItems}
      selectedValues={selectedShortcut ? [selectedShortcut] : []}
      onSelectOption={handleSelect}
      className={`min-w-[${SHORTCUT_MENU_MIN_WIDTH}px] py-lg`}
    />
  );
};

export default Shortcuts;
