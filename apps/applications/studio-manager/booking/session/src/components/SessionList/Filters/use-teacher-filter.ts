import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchTeachers } from "#src/hooks/use-search-teachers";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { selectFilters, useSessionListStore } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useTeacherFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useSessionListStore(selectFilters);

  // Get persisted teacher IDs from filters
  const [persistedTeacherIds] = useState(() => {
    const teacherFilter = filters.find(
      (f) => f.field === SessionFilterTypes.TEACHER,
    );
    return (
      teacherFilter?.valueIds
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)) || []
    );
  });

  // Fetch persisted teachers by IDs
  const { data: persistedTeachers } = useFetchTeachers(
    persistedTeacherIds,
    true,
    {},
    (teachers) =>
      teachers?.map((teacher) => ({
        id: `${teacher.id}`,
        label: teacher.name,
      })) || [],
  );

  // Load teachers for the teacher filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: teachers } = useSearchTeachers(debouncedSearch);

  // Merge persisted teachers with search results, avoiding duplicates
  const allTeachers = useMemo(() => {
    const searchTeachers = teachers || [];
    const persisted = persistedTeachers || [];

    return uniqBy([...searchTeachers, ...persisted], (val) => val.id);
  }, [teachers, persistedTeachers]);

  return {
    id: SessionFilterTypes.TEACHER,
    label: t("table.filters.teacher.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: allTeachers,
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
