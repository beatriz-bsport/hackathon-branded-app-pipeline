import type { ReactNode } from "react";

import { Body, ColorIndicator } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter/items-search-filter";
import type {
  ItemsSearchFilterGroup,
  ItemsSearchFilterOption,
} from "#src/components/primitive-filters/items-search-filter/types";

import type {
  TagFilterTagCatalogEntry,
  TagFilterTagGroupCatalogEntry,
} from "../types";

type TagFilterItemsSearchProps = {
  id: string;
  tags: TagFilterTagCatalogEntry[];
  tagGroups: TagFilterTagGroupCatalogEntry[];
  value: number[];
  onChange: (nextSelectedTagIds: number[]) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptySelectionLabel?: string;
  errorText?: string;
};

const groupNameById = (
  tagGroups: TagFilterTagGroupCatalogEntry[],
): Map<number, string> =>
  new Map(tagGroups.map((tagGroup) => [tagGroup.id, tagGroup.name]));

/**
 * Builds `ItemsSearchFilter` options sorted by group name, then tag name.
 */
const buildSortedItemsSearchOptions = (
  tags: TagFilterTagCatalogEntry[],
  tagGroups: TagFilterTagGroupCatalogEntry[],
): ItemsSearchFilterOption[] => {
  const groupNames = groupNameById(tagGroups);
  return [...tags]
    .map((tag) => ({
      tag,
      groupLabel: (groupNames.get(tag.group) ?? "").trim(),
    }))
    .sort((left, right) => {
      const groupCompare = left.groupLabel.localeCompare(
        right.groupLabel,
        undefined,
        {
          sensitivity: "base",
        },
      );
      if (groupCompare !== 0) {
        return groupCompare;
      }
      return left.tag.name.localeCompare(right.tag.name, undefined, {
        sensitivity: "base",
      });
    })
    .map(({ tag, groupLabel }) => ({
      id: tag.id,
      name: tag.name,
      description: groupLabel ? groupLabel.toUpperCase() : undefined,
    }));
};

const buildTagByIdMap = (
  tags: TagFilterTagCatalogEntry[],
): Map<number, TagFilterTagCatalogEntry> =>
  new Map(tags.map((tag) => [tag.id, tag]));

/**
 * Partitions filtered tag options into category slices (stable category order).
 * Uses `option.description` as the category key (see `buildSortedItemsSearchOptions`).
 */
const groupTagOptionsByCategoryHeading = (
  filtered: ItemsSearchFilterOption[],
): ItemsSearchFilterGroup[] => {
  const order: string[] = [];
  const buckets = new Map<string, ItemsSearchFilterOption[]>();

  for (const option of filtered) {
    const headingKey = option.description?.trim() ?? "";
    if (!buckets.has(headingKey)) {
      order.push(headingKey);
      buckets.set(headingKey, []);
    }
    buckets.get(headingKey)!.push(option);
  }

  return order.map((headingKey) => ({
    heading: headingKey,
    options: buckets.get(headingKey)!,
  }));
};

/**
 * Controlled multiselect for company tags, backed by `ItemsSearchFilter`.
 */
export const TagFilterItemsSearch = ({
  id,
  tags,
  tagGroups,
  value,
  onChange,
  disabled = false,
  searchPlaceholder,
  emptySelectionLabel,
  errorText,
}: TagFilterItemsSearchProps) => {
  const options = buildSortedItemsSearchOptions(tags, tagGroups);
  const tagsById = buildTagByIdMap(tags);

  const formatWithDot = (option: ItemsSearchFilterOption): ReactNode => {
    const tag = tagsById.get(option.id);
    return (
      <div className="flex min-w-0 items-center gap-xs">
        {tag ? (
          <ColorIndicator color={tag.color} size="2xs" type="block" />
        ) : null}
        <div className="min-w-0">
          <Body size="md" weight="strong" color="default" className="truncate">
            {option.description
              ? `${option.name} - ${option.description}`
              : option.name}
          </Body>
        </div>
      </div>
    );
  };

  return (
    <ItemsSearchFilter
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      searchPlaceholder={searchPlaceholder}
      emptySelectionLabel={emptySelectionLabel}
      errorText={errorText}
      searchIncludesDescription
      groupFilteredOptions={groupTagOptionsByCategoryHeading}
      menuOptionFormatter={(option) => {
        const tag = tagsById.get(option.id);
        return {
          label: option.name,
          leftSlot: tag ? (
            <ColorIndicator color={tag.color} size="2xs" type="block" />
          ) : undefined,
        };
      }}
      selectedOptionFormatter={formatWithDot}
    />
  );
};
