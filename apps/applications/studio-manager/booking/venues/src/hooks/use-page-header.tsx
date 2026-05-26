import { useState } from "react";

import { type ExpandableSearchInputWithTooltipProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const SEARCH_INPUT_DEBOUNCE = 300;

type HookReturn = {
  searchConfig: ExpandableSearchInputWithTooltipProps;
  searchInput: string;
};

export const usePageHeader = (): HookReturn => {
  const { t } = useTranslation("venues-list");
  const [searchInput, setSearchInput] = useState("");

  const searchConfig: ExpandableSearchInputWithTooltipProps = {
    id: "venues-page-search",
    inputValue: searchInput,
    onInputValueChange: setSearchInput,
    onClear: () => setSearchInput(""),
    debounceValue: SEARCH_INPUT_DEBOUNCE,
    placeholder: t("search.placeholder"),
  };

  return { searchConfig, searchInput };
};
