import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchCategories } from "#src/hooks/use-fetch-categories";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useCategoryFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  // Load and filter categories
  const { data: categories } = useFetchCategories(companyId);
  const [categoriesSearch, setCategoriesSearch] = useState("");

  const filteredCategories =
    categories
      ?.map((category) => ({
        id: category.id.toString(),
        label: category.name,
      }))
      .filter((category) =>
        category.label.toLowerCase().includes(categoriesSearch.toLowerCase()),
      ) ?? [];

  return {
    id: SessionFilterTypes.ACTIVITY_CATEGORY,
    label: t("table.filters.activityCategory.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: filteredCategories,
    multiSelect: true,
    searchConfig: {
      value: categoriesSearch,
      onChange: (value: string) => {
        setCategoriesSearch(value);
      },
      placeholder: t("table.filters.searchPlaceholder"),
    },
  };
};
