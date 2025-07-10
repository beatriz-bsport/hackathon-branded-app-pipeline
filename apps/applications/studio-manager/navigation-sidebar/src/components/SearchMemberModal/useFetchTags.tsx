import { useEffect, useMemo } from "react";

import {
  type TagGroup,
  fetchTagGroupsAction,
  fetchTagsAction,
  selectTagGroups,
  selectTags,
  useTagStore,
} from "@bsport/store-cdp-tag";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

import type { TagsMap } from "./constants";

const _fetchTags = fetchTagsAction.bind(null, fetch);
const _fetchTagGroups = fetchTagGroupsAction.bind(null, fetch);

export const useFetchTags = () => {
  // ----- Load Tags and TagGroups -----

  const [{ isLoading: isLoadingTags }, fetchTags] = useAsync<typeof _fetchTags>(
    {
      asyncFn: _fetchTags,
    },
  );

  const [{ isLoading: isLoadingTagGroups }, fetchTagGroups] = useAsync<
    typeof _fetchTagGroups
  >({
    asyncFn: _fetchTagGroups,
  });

  const tags = useTagStore(selectTags);
  const tagGroups = useTagStore(selectTagGroups);

  useEffect(() => {
    fetchTagGroups();
    fetchTags();
  }, [fetchTags, fetchTagGroups]);

  // ----- Format tags -----

  const tagsMap = useMemo(() => {
    const result: TagsMap = new Map();
    if (!tags || !tagGroups) {
      return result;
    }

    // Create a map to retrieve the category of a tag
    const mapTagToCategory = new Map<number, TagGroup>();
    tagGroups.forEach((tagGroup) => {
      tagGroup.tags.forEach((tagId) => mapTagToCategory.set(tagId, tagGroup));
    });

    // Loop over tags to build the final result
    tags.forEach((tag) => {
      result.set(tag.id, {
        categoryName: mapTagToCategory.get(tag.id)?.name,
        tagName: tag.name,
        color: tag.color,
      });
    });

    return result;
  }, [tags, tagGroups]);

  return {
    tagsMap,
    isLoadingTags: isLoadingTagGroups || isLoadingTags,
  };
};
