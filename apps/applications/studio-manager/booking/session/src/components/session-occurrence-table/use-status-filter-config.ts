import { useMemo } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  STATUS_FILTER_OPTIONS,
  type StatusFilter,
} from "./status-filter-mapping";

const FIELD_ID = "status";
const FILTER_IS = "is";

/**
 * Adapts our single-select status filter to Kaizen's generic `Filter` API — the
 * only filter control `DetailsLayout.Header` accepts. A Kaizen filter is a query
 * builder: `fields` are what you can filter on, each with operators
 * (`availableFilters`) and `values`; `defaultFilters` is the active selection.
 */
export const useStatusFilterConfig = (
  selected: StatusFilter | null,
  onChange: (next: StatusFilter | null) => void,
): FilterProps => {
  const { t } = useTranslation("sessionManagement");

  return useMemo(
    () => ({
      singleField: true, // only one field, so its picker is hidden
      selectFieldLabel: t("pageTabs.statusFilter.label"),
      filters: [{ id: FILTER_IS, label: t("pageTabs.statusFilter.is") }], // operators
      fields: {
        [FIELD_ID]: {
          id: FIELD_ID,
          label: t("pageTabs.statusFilter.label"),
          availableFilters: [FILTER_IS],
          multiSelect: false,
          values: STATUS_FILTER_OPTIONS.map((value) => ({
            id: value,
            label: t(`pageTabs.statusFilter.${value}`),
          })),
        },
      },
      // Reflect the current selection back into the control (empty = no filter).
      defaultFilters: selected
        ? [{ id: 1, field: FIELD_ID, filter: FILTER_IS, valueIds: [selected] }]
        : [],
      // Kaizen hands back all active filter elements; pull our single status out.
      onFilterChange: (elements: FilterElementState[]) => {
        const status = elements.find((e) => e.field === FIELD_ID)?.valueIds[0];
        onChange((status as StatusFilter | undefined) ?? null);
      },
    }),
    [t, selected, onChange],
  );
};
