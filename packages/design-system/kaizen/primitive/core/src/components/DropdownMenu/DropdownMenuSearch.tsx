import { type FC } from "react";

import TextField from "#src/components/TextField";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { useDropdownMenuContext } from "./DropdownMenuContext";
import type { DropdownMenuSearchProps } from "./types";

/**
 * DropdownMenuSearch - Search/filter input for menu items
 * @param props.placeholder - Placeholder text for the search input
 * @param props.value - Controlled value (optional)
 * @param props.onChange - Controlled onChange handler (optional)
 */
export const DropdownMenuSearch: FC<DropdownMenuSearchProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const placeholderText = placeholder ?? t("dropdownMenu.search.placeholder");

  const { searchValue, setSearchValue } = useDropdownMenuContext();
  const currentValue = value !== undefined ? value : searchValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onChange?.("");
  };

  return (
    <div className="mb-xs">
      <TextField
        id="dropdown-menu-search"
        type="search"
        placeholder={placeholderText}
        value={currentValue}
        onChange={handleChange}
        onClear={handleClear}
        fullWidth
      />
    </div>
  );
};

DropdownMenuSearch.displayName = "DropdownMenuSearch";
