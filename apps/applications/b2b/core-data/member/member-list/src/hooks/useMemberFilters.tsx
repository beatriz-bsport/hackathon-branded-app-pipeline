import { useCallback, useState, useEffect } from "react";
import { useTranslation } from "#src/utils/i18n";
import type {
  FilterProps,
  FilterField,
  FilterElementState,
} from "@bsport/kaizen-primitive-core";
import {
  fetchTagList,
  fetchTagGroupList,
  type TagGroup,
  type Tag,
} from "#src/store-api-custom-data-plaform-pkg";

const FILTER_IS = "is" as const;
const FILTER_IS_NOT = "isNot" as const;

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
  tags_included?: string; // Union of selected tags
  tags_excluded?: string; // Union of excluded tags
};

export const useMemberFilters = () => {
  const { t } = useTranslation("common");
  const [tagFields, setTagFields] = useState<Record<string, FilterField>>({});
  const [activeFilters, setActiveFilters] = useState<FilterParams>({
    tags_excluded: "",
    tags_included: "",
  });

  // ----- Filter configuration -----
  const filters = [
    { id: FILTER_IS, label: t("filters.operators.is") },
    { id: FILTER_IS_NOT, label: t("filters.operators.isNot") },
  ];

  // ----- Handlers -----

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ tags_excluded: "", tags_included: "" });
  }, []);

  // Load tags to update tagFields
  useEffect(() => {
    const fetchAndSetTags = async () => {
      // Retrieve tags and tag groups, and join them
      const tagList = await fetchTagList();
      const tagGroupList = await fetchTagGroupList();
      const tagGroupListWithTags: TagGroup<Tag>[] = tagGroupList.map(
        (tagGroup) => {
          return {
            ...tagGroup,
            tags: [...tagList.filter((tag) => tagGroup.tags.includes(tag.id))],
          };
        },
      );
      // Compute filter fields where each tag group is a category
      const tagFields = tagGroupListWithTags.reduce(
        (acc: Record<string, FilterField>, tagGroup) => {
          return {
            ...acc,
            [`tag-group-${tagGroup.id}`]: {
              id: `tag-group-${tagGroup.id}`,
              label: tagGroup.name,
              availableFilters: filters.map((filter) => filter.id),
              values: tagGroup.tags.map((tag) => {
                return {
                  id: `${tag.id}`,
                  label: `${tag.name}`,
                };
              }),
              multiSelect: true,
            },
          };
        },
        {},
      );
      setTagFields(tagFields);
    };

    fetchAndSetTags();
  }, []);

  const filterConfig: FilterProps = {
    fields: tagFields,
    filters: filters,
    onFilterChange: (selectedFilters) => {
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
    selectFieldLabel: t("filters.label"),
  };

  return {
    handleClearFilters,
    filterConfig,
    activeFilters,
  };
};
