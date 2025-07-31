import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  FilterElementState,
  FilterField,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import {
  type Tag,
  type TagGroup,
  fetchTagGroupsAction,
  fetchTagsAction,
  selectTagGroups,
  selectTags,
  useTagStore,
} from "@bsport/store-cdp-tag";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is" as const;
const FILTER_IS_NOT = "isNot" as const;

const fetchTagGroups = fetchTagGroupsAction.bind(null, fetch);
const fetchTags = fetchTagsAction.bind(null, fetch);

type TagGroupWithTags = Omit<TagGroup, "tags"> & {
  tags: Tag[];
};

/**
 * @param selectedFilters Current selection of the Filter
 * @param operator Keep only selected filters that match the operator
 * @returns A string union of tags that match the operator
 */
const buildTagsSelector = ({
  selectedFilters,
  operator,
}: {
  selectedFilters: FilterElementState[];
  operator: typeof FILTER_IS | typeof FILTER_IS_NOT;
}) => {
  return [
    ...new Set(
      selectedFilters
        .filter((element) => element.filter === operator)
        .map((element) => element.valueIds.join(",")),
    ),
  ].join(",");
};

// Related to MemberFilters in the backend
export type FilterParams = {
  tags_included: string; // Union of selected tags
  tags_excluded: string; // Union of excluded tags
};

export const useFilterMembers = () => {
  const { t } = useTranslation("common");

  // ----- Load tags -----

  useEffect(() => {
    fetchTags();
    fetchTagGroups();
  }, []);

  const tags = useTagStore(selectTags);
  const tagGroups = useTagStore(selectTagGroups);

  // ----- State to build and store dynamically filters -----

  const [tagFields, setTagFields] = useState<Record<string, FilterField>>({});

  const [activeFilters, setActiveFilters] = useState<FilterParams>({
    tags_excluded: "",
    tags_included: "",
  });

  // ----- Handlers -----

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ tags_excluded: "", tags_included: "" });
    filterRef.current?.resetFilters?.();
  }, []);

  // ----- Filter configuration -----

  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const filters = useMemo(
    () => [
      { id: FILTER_IS, label: t("filters.operators.is") },
      { id: FILTER_IS_NOT, label: t("filters.operators.isNot") },
    ],
    [t],
  );

  useEffect(() => {
    if (tags.length > 0 && tagGroups.length > 0) {
      const tagGroupListWithTags: TagGroupWithTags[] = tagGroups.map(
        (tagGroup) => ({
          ...tagGroup,
          tags: [...tags.filter((tag) => tagGroup.tags.includes(tag.id))],
        }),
      );

      // Compute filter fields where each tag group is a category
      const tagFields = tagGroupListWithTags.reduce(
        (acc: Record<string, FilterField>, tagGroup) => ({
          ...acc,
          [`tag-group-${tagGroup.id}`]: {
            id: `tag-group-${tagGroup.id}`,
            label: tagGroup.name,
            availableFilters: filters.map((filter) => filter.id),
            values: tagGroup.tags.map((tag) => ({
              id: `${tag.id}`,
              label: `${tag.name}`,
            })),
            multiSelect: false,
          },
        }),
        {},
      );
      setTagFields(tagFields);
    }
  }, [tags, tagGroups, filters]);

  const onFilterChange = useCallback(
    (selectedFilters: FilterElementState[]) => {
      setActiveFilters({
        tags_included: buildTagsSelector({
          selectedFilters,
          operator: FILTER_IS,
        }),
        tags_excluded: buildTagsSelector({
          selectedFilters,
          operator: FILTER_IS_NOT,
        }),
      });
    },
    [],
  );

  const filterConfig: FilterProps = useMemo(() => {
    return {
      fields: tagFields,
      filters: filters,
      onFilterChange,
      selectFieldLabel:
        Object.keys(tagFields).length === 1
          ? tagFields[Object.keys(tagFields)[0]].label
          : t("filters.label"),
    };
  }, [tagFields, filters, onFilterChange, t]);

  return {
    handleClearFilters,
    filterConfig,
    activeFilters,
    filterRef,
  };
};
