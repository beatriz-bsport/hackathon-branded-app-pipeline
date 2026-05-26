import { useState } from "react";

import { type ExpandableSearchInputWithTooltipProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const SEARCH_INPUT_DEBOUNCE = 300;

type HookReturn = {
  venuesSearchConfig: ExpandableSearchInputWithTooltipProps;
  locationsSearchConfig: ExpandableSearchInputWithTooltipProps;
  venuesSearchInput: string;
  locationsSearchInput: string;
  resetLocationsSearch: () => void;
};

export const usePageHeader = (): HookReturn => {
  const { t } = useTranslation("venues-list");
  const [venuesSearchInput, setVenuesSearchInput] = useState("");
  const [locationsSearchInput, setLocationsSearchInput] = useState("");

  const venuesSearchConfig: ExpandableSearchInputWithTooltipProps = {
    id: "venues-page-search",
    inputValue: venuesSearchInput,
    onInputValueChange: setVenuesSearchInput,
    onClear: () => setVenuesSearchInput(""),
    debounceValue: SEARCH_INPUT_DEBOUNCE,
    placeholder: t("search.placeholder"),
  };

  const locationsSearchConfig: ExpandableSearchInputWithTooltipProps = {
    id: "locations-search",
    inputValue: locationsSearchInput,
    onInputValueChange: setLocationsSearchInput,
    onClear: () => setLocationsSearchInput(""),
    debounceValue: SEARCH_INPUT_DEBOUNCE,
    placeholder: t("search.locationsPlaceholder"),
  };

  return {
    venuesSearchConfig,
    locationsSearchConfig,
    venuesSearchInput,
    locationsSearchInput,
    resetLocationsSearch: () => setLocationsSearchInput(""),
  };
};
