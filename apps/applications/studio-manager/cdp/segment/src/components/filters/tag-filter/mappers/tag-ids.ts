import type { TagFilterFormValue } from "../types";

/**
 * Returns tag ids sent to the API for the include side (empty when the section is disabled).
 */
export const effectiveIncludedTagIds = (value: TagFilterFormValue): number[] =>
  value.includeSectionEnabled ? dedupeSortedTagIds(value.tagsIncluded) : [];

/**
 * Returns tag ids sent to the API for the exclude side (empty when the section is disabled).
 */
export const effectiveExcludedTagIds = (value: TagFilterFormValue): number[] =>
  value.excludeSectionEnabled ? dedupeSortedTagIds(value.tagsExcluded) : [];

/**
 * Deduplicates numeric tag ids and sorts ascending for stable API payloads.
 */
export const dedupeSortedTagIds = (tagIds: number[]): number[] =>
  [...new Set(tagIds)].sort((left, right) => left - right);

/**
 * Returns true when both id lists contain the same members (order-insensitive).
 */
export const haveSameTagIdMembers = (
  left: number[],
  right: number[],
): boolean => {
  const sortedLeft = dedupeSortedTagIds(left);
  const sortedRight = dedupeSortedTagIds(right);
  if (sortedLeft.length !== sortedRight.length) {
    return false;
  }
  return sortedLeft.every((id, index) => id === sortedRight[index]);
};
