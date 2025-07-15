import { useCallback, useEffect, useRef, useState } from "react";

import {
  Autocomplete,
  type AutocompleteProps,
  Chip,
  type Item,
  type MenuOption,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";
import type { Tag, TagGroup } from "@bsport/store-cdp-tag";

import { useTranslation } from "#src/utils/i18n";
import {
  formatGroupedTagToMenuOptions,
  getTagById,
  groupTagMenuOptionsByGroupId,
} from "#src/utils/tagSelector";

const TAG_SELECTOR_DEBOUNCE_VALUE = 300;

export type TagSelectorProps = {
  initialTag?: Tag | null;
  tags: Tag[];
  tagGroups: TagGroup[];
  searchInputProps?: TextFieldProps;
  onSelectTag?: (tag: Tag) => void;
  onDismissTagChip?: () => void;
  onSearchBlur?: () => void;
};

export const TagSelector = ({
  initialTag,
  tags,
  tagGroups,
  searchInputProps,
  onDismissTagChip,
  onSelectTag,
  onSearchBlur,
}: TagSelectorProps) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(
    initialTag ?? null,
  );
  const [tagItems, setTagItems] = useState<MenuOption[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuOption[]>([]);
  const { t } = useTranslation("settings");

  const handleSearchTag = (searchQuery: string) => {
    if (searchQuery === "") {
      setFilteredItems(tagItems);
      return;
    }

    const groupedOptions = groupTagMenuOptionsByGroupId(tagItems);

    const filteredGroupedItems = groupedOptions
      .map((group) => ({
        title: group?.title,
        options: group?.options.filter(
          (option) =>
            "label" in option &&
            option.label.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((group) => (group?.options?.length ?? 0) > 0);

    const formattedFilteredItems =
      formatGroupedTagToMenuOptions(filteredGroupedItems);
    setFilteredItems(formattedFilteredItems);
  };

  const formatTagsIntoMenuOptions = useCallback(() => {
    // Group children by group id
    const tagByGroup: Record<number, Tag[]> = {};
    for (const tag of tags) {
      if (!tagByGroup[tag.group]) tagByGroup[tag.group] = [];
      tagByGroup[tag.group].push(tag);
    }

    // Build the select items array
    const selectItems = [];
    for (const group of tagGroups) {
      // Add group title
      selectItems.push({
        type: "title",
        label: group.name,
      });

      // Add children for this group
      for (const tag of tagByGroup[group.id] || []) {
        selectItems.push({
          id: `tag-${tag.id}`,
          label: tag.name,
          rightSlot: tag.color ? <ColorChip color={tag.color} /> : null,
        } as Item);
      }
    }

    return selectItems as MenuOption[];
  }, [tagGroups, tags]);

  const getTagChipLabel = (tag: Tag | null) => {
    if (!tag) return "";
    const groupName =
      tagGroups.find((tagGroup) => tagGroup.id === tag.group)?.name || "";
    return `${groupName}: ${tag.name}`;
  };

  const handleDismissTagChip = () => {
    if (searchInputRef?.current) {
      searchInputRef.current.value = "";
    }
    onDismissTagChip?.();
    setSelectedTag(null);
    setTagItems(formatTagsIntoMenuOptions());
    setFilteredItems([]);
  };

  const handleSelectTag = (tagId: string) => {
    const tag = getTagById({ tagId: tagId, tags });
    if (searchInputRef?.current) {
      searchInputRef.current.value = tag?.name || "";
    }
    if (!tag) return;
    onSelectTag?.(tag);
    setSelectedTag(tag);
  };

  useEffect(() => {
    const searchInputCurrentRef = searchInputRef.current;
    const handleSearchBlur = () => {
      onSearchBlur?.();
    };
    searchInputCurrentRef?.addEventListener("blur", handleSearchBlur);
    return () => {
      searchInputCurrentRef?.removeEventListener("blur", handleSearchBlur);
    };
  }, [searchInputRef, onSearchBlur]);

  useEffect(() => {
    setTagItems(formatTagsIntoMenuOptions());
  }, [formatTagsIntoMenuOptions]);

  useEffect(() => {
    if (initialTag) {
      setSelectedTag(initialTag);
      onSelectTag?.(initialTag);
    }
  }, [initialTag]);

  return (
    <div id="tag-selector-container" className="flex flex-row">
      <div
        id="tag-selector-input-chips-container"
        className="flex flex-col gap-xs"
      >
        <Autocomplete
          id="referral-program-tag-selector"
          className="min-w-[320px]"
          debounceValue={TAG_SELECTOR_DEBOUNCE_VALUE}
          items={
            filteredItems.length > 0
              ? filteredItems
              : (tagItems as AutocompleteProps["items"])
          }
          textfieldProps={{
            id: "referral-program-tag-selector-input",
            placeholder: t("active.form.tagSelector.placeholder"),
            iconRight: "chevron-down",
            ...searchInputProps,
            inputRef: searchInputRef,
          }}
          onValueChange={handleSearchTag}
          onSelect={handleSelectTag}
        />
        <div
          id="selected-tags-container"
          className="flex flex-wrap gap-2xs mt-2"
        >
          {selectedTag && (
            <Chip
              className="rounded-lg"
              key={`sub-tag-${selectedTag.name}-${selectedTag.id}`}
              dismissible
              type="weak"
              label={getTagChipLabel(selectedTag)}
              color="main"
              size="lg"
              onClick={handleDismissTagChip}
            />
          )}
        </div>
      </div>
    </div>
  );
};

type ColorChipProps = {
  // Specify the color as a hexadecimal string, e.g., "#50d71e" for green
  color: string;
};

const ColorChip = ({ color }: ColorChipProps) => {
  return (
    <div
      className={`w-[14px] h-[14px] rounded-[4px] `}
      style={{ backgroundColor: color }}
    ></div>
  );
};
