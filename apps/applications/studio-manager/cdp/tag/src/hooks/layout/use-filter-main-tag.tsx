import { useCallback, useMemo, useRef, useState } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import type { TagGroup } from "@bsport/store-cdp-tag";

import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is" as const;
const FILTER_IS_NOT = "isNot" as const;

export type FilterParams = {
  tag_groups_included: number[]; // Union of selected tags
  tag_groups_excluded: number[]; // Union of excluded tags
};

export const useFilterMaintag = ({ tagGroups }: { tagGroups: TagGroup[] }) => {
  const { t } = useTranslation("tags");

  const [activeTagGroupIdFilters, setActiveTagGroupIdFilters] =
    useState<FilterParams>({
      tag_groups_included: [],
      tag_groups_excluded: [],
    });

  // ----- Handlers -----

  const handleClearFilters = useCallback(() => {
    setActiveTagGroupIdFilters({
      tag_groups_included: [],
      tag_groups_excluded: [],
    });
    filterRef.current?.resetFilters?.();
  }, []);

  // ----- Filter configuration -----

  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const filters = useMemo(
    () => [
      { id: FILTER_IS, label: t("page.filters.operators.is") },
      { id: FILTER_IS_NOT, label: t("page.filters.operators.isNot") },
    ],
    [t],
  );

  const tagFields = useMemo(
    () => ({
      tagGroup: {
        id: "tagGroup-filter",
        label: t("page.filters.label"),
        availableFilters: [FILTER_IS, FILTER_IS_NOT],
        values: tagGroups.map((tagGroup) => ({
          id: tagGroup.name,
          label: tagGroup.name,
        })),
        multiSelect: true,
      },
    }),
    [tagGroups],
  );

  const onFilterChange = useCallback(
    (filters: FilterElementState[]) => {
      const includedTagGroupIds = new Set<number>();
      const excludedTagGroupIds = new Set<number>();

      // Process each filter in the array
      for (const filter of filters) {
        if (filter.field === "tagGroup") {
          // Convert tag names to IDs
          filter.valueIds.forEach((tagName) => {
            const tagGroup = tagGroups.find((tg) => tg.name === tagName);
            if (!tagGroup) return;

            if (filter.filter === FILTER_IS) {
              includedTagGroupIds.add(tagGroup.id);
            } else {
              excludedTagGroupIds.add(tagGroup.id);
            }
          });
        }
      }

      // Remove duplicates using Set
      const uniqueIncluded = Array.from(new Set(includedTagGroupIds));
      const uniqueExcluded = Array.from(new Set(excludedTagGroupIds));

      setActiveTagGroupIdFilters({
        tag_groups_included: uniqueIncluded,
        tag_groups_excluded: uniqueExcluded,
      });
    },
    [tagGroups],
  );

  const filterConfig: FilterProps = useMemo(() => {
    return {
      fields: tagFields,
      filters: filters,
      onFilterChange,
      selectFieldLabel: t("page.filters.label"),
    };
  }, [tagFields, filters, onFilterChange, t]);

  return {
    handleClearFilters,
    filterConfig,
    activeFilters: activeTagGroupIdFilters,
    filterRef,
  };
};
