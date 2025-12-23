import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useLevelFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  // Load and filter levels
  const { data: levels } = useFetchLevels(companyId);
  const [levelsSearch, setLevelsSearch] = useState("");
  const getLevelName = useLevelName();

  const filteredLevels = levels
    ? Object.values(levels)
        .map((level) => ({
          id: level.id.toString(),
          label: getLevelName({ levelId: level.id, levelName: level.name }),
        }))
        .filter((level) =>
          level.label.toLowerCase().includes(levelsSearch.toLowerCase()),
        )
    : [];

  return {
    id: SessionFilterTypes.LEVEL,
    label: t("table.filters.level.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: filteredLevels,
    multiSelect: true,
    searchConfig: {
      value: levelsSearch,
      onChange: (value: string) => {
        setLevelsSearch(value);
      },
      placeholder: t("table.filters.searchPlaceholder"),
    },
  };
};
