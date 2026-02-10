import { useSuspenseQueries } from "@tanstack/react-query";

import { invariant } from "#src/utils/invariant";

import {
  tagGroupsQueryOptions,
  tagRulesQueryOptions,
  tagsQueryOptions,
} from "./api";
import type { Tag, TagGroup, TagRule, TagRuleWithTag } from "./types";

/**
 * Combine function extracted for referential stability.
 * Joins tag rules with their tag names from the tags array and tag group names.
 * Backend now handles filtering by smartlist_id.
 */
const combineTagRulesWithTags = (
  results: [{ data: TagRule[] }, { data: Tag[] }, { data: TagGroup[] }],
): TagRuleWithTag[] => {
  const [tagRulesResult, tagsResult, tagGroupsResult] = results;

  const tagMap = new Map(tagsResult.data.map((tag) => [tag.id, tag]));
  const tagGroupMap = new Map(tagGroupsResult.data.map((g) => [g.id, g.name]));

  return tagRulesResult.data.map((rule): TagRuleWithTag => {
    const tag = tagMap.get(rule.tag);
    invariant(tag, `Tag not found for tag ID: ${rule.tag}`);

    const tagGroupName = tagGroupMap.get(tag.group);

    return {
      ...rule,
      tagName: tag.name,
      tagGroupName,
      tagColor: tag.color,
    };
  });
};

/**
 * Hook that combines tag rules with their tag names
 * using useSuspenseQueries for parallel fetching with Suspense support.
 *
 * Filters tag rules by smartlist_id and joins with tag names from the tags array.
 */
export const useTagRules = (smartlistId: string) => {
  return useSuspenseQueries({
    queries: [
      tagRulesQueryOptions(smartlistId),
      tagsQueryOptions(),
      tagGroupsQueryOptions(),
    ],
    combine: (results) => combineTagRulesWithTags(results),
  });
};

export type { TagRuleWithTag } from "./types";
