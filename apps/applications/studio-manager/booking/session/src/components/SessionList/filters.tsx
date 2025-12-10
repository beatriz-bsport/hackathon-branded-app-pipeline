import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "../../utils/i18n";

const FILTER_IS = "is" as const;
const FILTER_NOT = "not" as const;

export const useFilterConfig = (): FilterProps => {
  const { t } = useTranslation("sessionList");
  return {
    fields: {
      "activity-type": {
        id: "activity-type",
        label: t("table.filters.activityType.label"),
        availableFilters: [FILTER_IS, FILTER_NOT],
        values: [
          {
            id: "group-activity",
            label: t("table.filters.activityType.groupActivity"),
          },
          {
            id: "workshop",
            label: t("table.filters.activityType.workshop"),
          },
        ],
        multiSelect: false,
      },
    },
    filters: [
      {
        id: FILTER_IS,
        label: t("table.filters.is"),
      },
      {
        id: FILTER_NOT,
        label: t("table.filters.not"),
      },
    ],
    selectFieldLabel: t("table.filters.label"),
    onFilterChange: (filters: FilterElementState[]) => {
      console.log("Filter changed:", filters);
    },
  };
};
