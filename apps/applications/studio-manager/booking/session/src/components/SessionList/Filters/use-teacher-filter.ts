import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchTeachers } from "#src/hooks/use-search-teachers";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useTeacherFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");

  // Load teachers for the teacher filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: teachers } = useSearchTeachers(debouncedSearch);

  return {
    id: SessionFilterTypes.TEACHER,
    label: t("table.filters.teacher.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: teachers || [],
    multiSelect: true,
    searchConfig: {
      value: inputValue,
      onChange: (value: string) => {
        setInputValue(value);
        debouncedSetDebouncedSearch(value);
      },
      placeholder: t("table.filters.searchPlaceholder"),
    },
  };
};
