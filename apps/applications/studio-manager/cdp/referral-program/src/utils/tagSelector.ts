import type { Item, MenuOption } from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";

import { isMenuOption } from "#src/utils/typeGuard";

type GroupedTagItem = {
  title: string;
  options: Item[];
};

/**
 * Finds and returns a Tag object from a list of tags, given a prefixed tagId.
 * The tagId is expected to be prefixed with "tag-" (e.g., "tag-123").
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.tagId - The prefixed tag ID string (e.g., "tag-123").
 * @param {Tag[]} params.tags - The array of Tag objects to search within.
 * @returns {Tag | null} The matching Tag object if found, otherwise null.
 */
export function getTagById({
  tagId,
  tags,
}: {
  tagId: string;
  tags: Tag[];
}): Tag | null {
  // Extract the numeric ID from the tagId string, because tag items ids for the autocomplete are prefixed with "tag-"
  const id = parseInt(tagId.replace("tag-", ""), 10);
  return tags.find((tag) => tag.id === id) || null;
}

/**
 * Groups menu option items by their group title.
 * Each group starts with an item of type "title", followed by its associated options.
 *
 * @param {MenuOption[]} tagItems - The flat array of menu options (including titles and options).
 * @returns {GroupedTagItem[]} An array of grouped tag items, each with a title and its options.
 */
export function groupTagMenuOptionsByGroupId(
  tagItems: MenuOption[],
): GroupedTagItem[] {
  return tagItems
    .map((item, index): GroupedTagItem | null => {
      let groupTitle = null;

      if ("type" in item && item.type && item.type === "title") {
        groupTitle = item.label;
      } else {
        return null;
      }

      const groupItems = [];

      for (const nextElement of tagItems.slice(index + 1)) {
        if (!("type" in nextElement)) {
          groupItems.push(nextElement);
        } else {
          break;
        }
      }

      return {
        title: groupTitle,
        options: groupItems,
      };
    })
    .filter((item): item is GroupedTagItem => item !== null); // <-- type guard
}

/**
 * Converts an array of grouped tag items into a flat array of menu options,
 * formatting each option with a prefixed ID and including group titles.
 *
 * @param {GroupedTagItem[]} groupedTagItems - The array of grouped tag items.
 * @returns {MenuOption[]} A flat array of menu options suitable for rendering in a menu.
 */
export function formatGroupedTagToMenuOptions(
  groupedTagItems: GroupedTagItem[],
): MenuOption[] {
  return groupedTagItems
    .map((group) => {
      const groupTitle = group?.title;
      const groupOptions = group?.options || [];
      const formattedOptions = groupOptions.map((option) => {
        if (isMenuOption(option)) {
          return {
            id: option.id,
            label: option.label,
            rightSlot: option.rightSlot || null,
          };
        }
      });
      return [{ type: "title", label: groupTitle }, ...formattedOptions];
    })
    .flat() as MenuOption[];
}

/**
 * Finds and returns a Tag object from a list of tags, given a real number tag id.
 * The tagId is expected to a real number (e.g., 123).
 *
 * @param {Object} params - The parameters object.
 * @param {number} params.tagId - The real id from the tag.
 * @param {Tag[]} params.tags - The array of Tag objects to search within.
 * @returns {Tag | null} The matching Tag object if found, otherwise null.
 */
export function getTagByApiId({
  tagId,
  tags,
}: {
  tagId: number;
  tags: Tag[];
}): Tag | null {
  return tags.find((tag) => tag.id === tagId) || null;
}
